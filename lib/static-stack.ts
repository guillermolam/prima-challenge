import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3'
import * as cloudfront from '@aws-cdk/aws-cloudfront'
import * as route53 from '@aws-cdk/aws-route53'
import * as s3deploy from '@aws-cdk/aws-s3-deployment'
import * as acm from '@aws-cdk/aws-certificatemanager'
import * as targets from '@aws-cdk/aws-route53-targets/lib'
import { StaticStackProps } from './multi-stack-definition';
import * as path from 'path'
import { CertificateValidation } from '@aws-cdk/aws-certificatemanager';

/** STATIC **/
export class StaticStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: StaticStackProps) {
        super(scope, id, props);

        const siteDomain = props!.domain.siteSubDomain + "." + props!.domain.domainName;
        new cdk.CfnOutput(this, "Site", { value: "https://" + siteDomain });

        // Route53 DNS
        const zone = route53.HostedZone.fromLookup(this, 'baseZone', {
            domainName: props!.domain.siteSubDomain
        });

        // S3 Content bucket
        const siteBucket = new s3.Bucket(this, "SiteBucket", {
            bucketName: siteDomain,
            websiteIndexDocument: "index.html",
            websiteErrorDocument: "error.html",
            publicReadAccess: true,
            removalPolicy: cdk.RemovalPolicy.DESTROY
        });
        new cdk.CfnOutput(this, "Bucket", { value: siteBucket.bucketName });

        // TLS certificate
        const certificateArn = new acm.DnsValidatedCertificate(
            this,
            "SiteCertificate",
            {
                domainName: props!.domain.domainName,
                hostedZone: zone,
                region: props!.env.region,
                validation: CertificateValidation.fromDns(zone)
            }
        ).certificateArn;
        new cdk.CfnOutput(this, "Certificate", { value: certificateArn });

        // CloudFront distribution that provides HTTPS
        const distribution = new cloudfront.CloudFrontWebDistribution(
            this,
            "SiteDistribution",
            {
                aliasConfiguration: {
                    acmCertRef: certificateArn,
                    names: [siteDomain],
                    sslMethod: cloudfront.SSLMethod.SNI,
                    securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2019,
                },
                originConfigs: [
                    {
                        customOriginSource: {
                            domainName: siteBucket.bucketWebsiteDomainName,
                            originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
                        },
                        behaviors: [{ isDefaultBehavior: true }],
                    },
                ],
            }
        );
        new cdk.CfnOutput(this, "DistributionId", {
            value: distribution.distributionId,
        });

        // Route53 alias record for the CloudFront distribution
        new route53.ARecord(this, "SiteAliasRecord", {
            recordName: siteDomain,
            target: route53.RecordTarget.fromAlias(
                new targets.CloudFrontTarget(distribution)
            ),
            zone,
        });

        // Deploy site contents to S3 bucket
        new s3deploy.BucketDeployment(this, "DeployWithInvalidation", {
            sources: [s3deploy.Source.asset(path.resolve(__dirname, '../.next'))],
            destinationBucket: siteBucket,
            distribution,
            distributionPaths: ["/*"],
        });
    }
}