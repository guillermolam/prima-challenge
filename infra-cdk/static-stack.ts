import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3'
import * as cloudfront from '@aws-cdk/aws-cloudfront'
import * as route53 from '@aws-cdk/aws-route53'
import * as s3deploy from '@aws-cdk/aws-s3-deployment'
import { StaticStackProps } from './multi-stack-definition';
import * as path from 'path'
import { ViewerProtocolPolicy } from '@aws-cdk/aws-cloudfront';

/** STATIC **/
export class StaticStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: StaticStackProps) {
        super(scope, id, props);

        const siteDomain = props!.domain.siteSubDomain + "." + props!.domain.domainName;
        new cdk.CfnOutput(this, "Site", { value: "https://" + siteDomain });

        // Route53 DNS
        // The name of the record  must match a custom domain name for your API, such as api.example.com.
        const zone = new route53.PublicHostedZone(this, 'HostedZone', {
            zoneName: props!.domain.domainName
        });

        // S3 Content bucket
        const siteBucket = new s3.Bucket(this, "SiteBucket", {
            bucketName: siteDomain,
            websiteIndexDocument: "index.html",
            websiteErrorDocument: "404.html",
            publicReadAccess: true,
            removalPolicy: cdk.RemovalPolicy.DESTROY
        });
        new cdk.CfnOutput(this, "Bucket", { value: siteBucket.bucketName });

        // CloudFront distribution that provides HTTPS
        const distribution = new cloudfront.CloudFrontWebDistribution(
            this,
            "SiteDistribution",
            {
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                geoRestriction: {
                    restrictionType: "whitelist",
                    locations: [
                        "US",
                        "CA",
                        "ES",
                        "DE",
                    ],
                },
                defaultRootObject: 'index.html',
                originConfigs: [
                    {
                        s3OriginSource: {
                            s3BucketSource: siteBucket
                        },
                        customOriginSource: {
                            domainName: siteBucket.bucketWebsiteDomainName,
                            originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
                            httpPort: 80,
                            httpsPort: 443
                        },
                        behaviors: [{ isDefaultBehavior: true }],
                    },
                ],
            }
        );
        new cdk.CfnOutput(this, "DistributionId", {
            value: distribution.distributionId,
        });

        // Deploy site contents to S3 bucket
        new s3deploy.BucketDeployment(this, "DeployWithInvalidation", {
            sources: [s3deploy.Source.asset(path.resolve(__dirname, '../out'))],
            destinationBucket: siteBucket,
            distribution,
            distributionPaths: ["/*"],
        });
    }
}