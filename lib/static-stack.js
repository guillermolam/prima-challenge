"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticStack = void 0;
const cdk = require("@aws-cdk/core");
const s3 = require("@aws-cdk/aws-s3");
const cloudfront = require("@aws-cdk/aws-cloudfront");
const route53 = require("@aws-cdk/aws-route53");
const s3deploy = require("@aws-cdk/aws-s3-deployment");
const acm = require("@aws-cdk/aws-certificatemanager");
const targets = require("@aws-cdk/aws-route53-targets/lib");
const path = require("path");
/** STATIC **/
class StaticStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const siteDomain = props.domain.siteSubDomain + "." + props.domain.domainName;
        new cdk.CfnOutput(this, "Site", { value: "https://" + siteDomain });
        // Route53 DNS
        const zone = new route53.PublicHostedZone(this, 'HostedZone', {
            zoneName: props.domain.domainName
        });
        new acm.Certificate(this, 'Certificate', {
            domainName: siteDomain,
            validation: acm.CertificateValidation.fromDns(zone),
        });
        // Content bucket
        const siteBucket = new s3.Bucket(this, "SiteBucket", {
            bucketName: siteDomain,
            websiteIndexDocument: "index.html",
            websiteErrorDocument: "error.html",
            publicReadAccess: true,
            // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
            // the new bucket, and it will remain in your account until manually deleted. By setting the policy to
            // DESTROY, cdk destroy will attempt to delete the bucket, but will error if the bucket is not empty.
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        new cdk.CfnOutput(this, "Bucket", { value: siteBucket.bucketName });
        // TLS certificate
        const certificateArn = new acm.DnsValidatedCertificate(this, "SiteCertificate", {
            domainName: siteDomain,
            hostedZone: zone,
            region: props.env.region,
        }).certificateArn;
        new cdk.CfnOutput(this, "Certificate", { value: certificateArn });
        // CloudFront distribution that provides HTTPS
        const distribution = new cloudfront.CloudFrontWebDistribution(this, "SiteDistribution", {
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
        });
        new cdk.CfnOutput(this, "DistributionId", {
            value: distribution.distributionId,
        });
        // Route53 alias record for the CloudFront distribution
        new route53.ARecord(this, "SiteAliasRecord", {
            recordName: siteDomain,
            target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
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
exports.StaticStack = StaticStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3RhdGljLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFxQztBQUNyQyxzQ0FBcUM7QUFDckMsc0RBQXFEO0FBQ3JELGdEQUErQztBQUMvQyx1REFBc0Q7QUFDdEQsdURBQXNEO0FBQ3RELDREQUEyRDtBQUUzRCw2QkFBNEI7QUFFNUIsY0FBYztBQUNkLE1BQWEsV0FBWSxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ3RDLFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBd0I7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxVQUFVLEdBQUcsS0FBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEdBQUcsR0FBRyxHQUFHLEtBQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO1FBQ2hGLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsS0FBSyxFQUFFLFVBQVUsR0FBRyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBRXBFLGNBQWM7UUFDZCxNQUFNLElBQUksR0FBRyxJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQzFELFFBQVEsRUFBRSxLQUFNLENBQUMsTUFBTSxDQUFDLFVBQVc7U0FDdEMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDckMsVUFBVSxFQUFFLFVBQVU7WUFDdEIsVUFBVSxFQUFFLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1NBQ3RELENBQUMsQ0FBQztRQUVILGlCQUFpQjtRQUNqQixNQUFNLFVBQVUsR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUNqRCxVQUFVLEVBQUUsVUFBVTtZQUN0QixvQkFBb0IsRUFBRSxZQUFZO1lBQ2xDLG9CQUFvQixFQUFFLFlBQVk7WUFDbEMsZ0JBQWdCLEVBQUUsSUFBSTtZQUV0QixnR0FBZ0c7WUFDaEcsc0dBQXNHO1lBQ3RHLHFHQUFxRztZQUNyRyxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO1NBQzNDLENBQUMsQ0FBQztRQUNILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUUsS0FBSyxFQUFFLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBRXBFLGtCQUFrQjtRQUNsQixNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyx1QkFBdUIsQ0FDbEQsSUFBSSxFQUNKLGlCQUFpQixFQUNqQjtZQUNJLFVBQVUsRUFBRSxVQUFVO1lBQ3RCLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLE1BQU0sRUFBRSxLQUFNLENBQUMsR0FBRyxDQUFDLE1BQU07U0FDNUIsQ0FDSixDQUFDLGNBQWMsQ0FBQztRQUNqQixJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBRWxFLDhDQUE4QztRQUM5QyxNQUFNLFlBQVksR0FBRyxJQUFJLFVBQVUsQ0FBQyx5QkFBeUIsQ0FDekQsSUFBSSxFQUNKLGtCQUFrQixFQUNsQjtZQUNJLGtCQUFrQixFQUFFO2dCQUNoQixVQUFVLEVBQUUsY0FBYztnQkFDMUIsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDO2dCQUNuQixTQUFTLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHO2dCQUNuQyxjQUFjLEVBQUUsVUFBVSxDQUFDLHNCQUFzQixDQUFDLGFBQWE7YUFDbEU7WUFDRCxhQUFhLEVBQUU7Z0JBQ1g7b0JBQ0ksa0JBQWtCLEVBQUU7d0JBQ2hCLFVBQVUsRUFBRSxVQUFVLENBQUMsdUJBQXVCO3dCQUM5QyxvQkFBb0IsRUFBRSxVQUFVLENBQUMsb0JBQW9CLENBQUMsU0FBUztxQkFDbEU7b0JBQ0QsU0FBUyxFQUFFLENBQUMsRUFBRSxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsQ0FBQztpQkFDM0M7YUFDSjtTQUNKLENBQ0osQ0FBQztRQUNGLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDdEMsS0FBSyxFQUFFLFlBQVksQ0FBQyxjQUFjO1NBQ3JDLENBQUMsQ0FBQztRQUVILHVEQUF1RDtRQUN2RCxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO1lBQ3pDLFVBQVUsRUFBRSxVQUFVO1lBQ3RCLE1BQU0sRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FDbEMsSUFBSSxPQUFPLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLENBQzdDO1lBQ0QsSUFBSTtTQUNQLENBQUMsQ0FBQztRQUVILG9DQUFvQztRQUNwQyxJQUFJLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsd0JBQXdCLEVBQUU7WUFDMUQsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNyRSxpQkFBaUIsRUFBRSxVQUFVO1lBQzdCLFlBQVk7WUFDWixpQkFBaUIsRUFBRSxDQUFDLElBQUksQ0FBQztTQUM1QixDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUFyRkQsa0NBcUZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJ1xuaW1wb3J0ICogYXMgY2xvdWRmcm9udCBmcm9tICdAYXdzLWNkay9hd3MtY2xvdWRmcm9udCdcbmltcG9ydCAqIGFzIHJvdXRlNTMgZnJvbSAnQGF3cy1jZGsvYXdzLXJvdXRlNTMnXG5pbXBvcnQgKiBhcyBzM2RlcGxveSBmcm9tICdAYXdzLWNkay9hd3MtczMtZGVwbG95bWVudCdcbmltcG9ydCAqIGFzIGFjbSBmcm9tICdAYXdzLWNkay9hd3MtY2VydGlmaWNhdGVtYW5hZ2VyJ1xuaW1wb3J0ICogYXMgdGFyZ2V0cyBmcm9tICdAYXdzLWNkay9hd3Mtcm91dGU1My10YXJnZXRzL2xpYidcbmltcG9ydCB7IFN0YXRpY1N0YWNrUHJvcHMgfSBmcm9tICcuL211bHRpLXN0YWNrLWRlZmluaXRpb24nO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJ1xuXG4vKiogU1RBVElDICoqL1xuZXhwb3J0IGNsYXNzIFN0YXRpY1N0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGF0aWNTdGFja1Byb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgICAgIGNvbnN0IHNpdGVEb21haW4gPSBwcm9wcyEuZG9tYWluLnNpdGVTdWJEb21haW4gKyBcIi5cIiArIHByb3BzIS5kb21haW4uZG9tYWluTmFtZTtcbiAgICAgICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgXCJTaXRlXCIsIHsgdmFsdWU6IFwiaHR0cHM6Ly9cIiArIHNpdGVEb21haW4gfSk7XG5cbiAgICAgICAgLy8gUm91dGU1MyBETlNcbiAgICAgICAgY29uc3Qgem9uZSA9IG5ldyByb3V0ZTUzLlB1YmxpY0hvc3RlZFpvbmUodGhpcywgJ0hvc3RlZFpvbmUnLCB7XG4gICAgICAgICAgICB6b25lTmFtZTogcHJvcHMhLmRvbWFpbi5kb21haW5OYW1lIVxuICAgICAgICB9KTtcbiAgICAgICAgbmV3IGFjbS5DZXJ0aWZpY2F0ZSh0aGlzLCAnQ2VydGlmaWNhdGUnLCB7XG4gICAgICAgICAgICBkb21haW5OYW1lOiBzaXRlRG9tYWluLFxuICAgICAgICAgICAgdmFsaWRhdGlvbjogYWNtLkNlcnRpZmljYXRlVmFsaWRhdGlvbi5mcm9tRG5zKHpvbmUpLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBDb250ZW50IGJ1Y2tldFxuICAgICAgICBjb25zdCBzaXRlQnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCBcIlNpdGVCdWNrZXRcIiwge1xuICAgICAgICAgICAgYnVja2V0TmFtZTogc2l0ZURvbWFpbixcbiAgICAgICAgICAgIHdlYnNpdGVJbmRleERvY3VtZW50OiBcImluZGV4Lmh0bWxcIixcbiAgICAgICAgICAgIHdlYnNpdGVFcnJvckRvY3VtZW50OiBcImVycm9yLmh0bWxcIixcbiAgICAgICAgICAgIHB1YmxpY1JlYWRBY2Nlc3M6IHRydWUsXG5cbiAgICAgICAgICAgIC8vIFRoZSBkZWZhdWx0IHJlbW92YWwgcG9saWN5IGlzIFJFVEFJTiwgd2hpY2ggbWVhbnMgdGhhdCBjZGsgZGVzdHJveSB3aWxsIG5vdCBhdHRlbXB0IHRvIGRlbGV0ZVxuICAgICAgICAgICAgLy8gdGhlIG5ldyBidWNrZXQsIGFuZCBpdCB3aWxsIHJlbWFpbiBpbiB5b3VyIGFjY291bnQgdW50aWwgbWFudWFsbHkgZGVsZXRlZC4gQnkgc2V0dGluZyB0aGUgcG9saWN5IHRvXG4gICAgICAgICAgICAvLyBERVNUUk9ZLCBjZGsgZGVzdHJveSB3aWxsIGF0dGVtcHQgdG8gZGVsZXRlIHRoZSBidWNrZXQsIGJ1dCB3aWxsIGVycm9yIGlmIHRoZSBidWNrZXQgaXMgbm90IGVtcHR5LlxuICAgICAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgICAgfSk7XG4gICAgICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsIFwiQnVja2V0XCIsIHsgdmFsdWU6IHNpdGVCdWNrZXQuYnVja2V0TmFtZSB9KTtcblxuICAgICAgICAvLyBUTFMgY2VydGlmaWNhdGVcbiAgICAgICAgY29uc3QgY2VydGlmaWNhdGVBcm4gPSBuZXcgYWNtLkRuc1ZhbGlkYXRlZENlcnRpZmljYXRlKFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgIFwiU2l0ZUNlcnRpZmljYXRlXCIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZG9tYWluTmFtZTogc2l0ZURvbWFpbixcbiAgICAgICAgICAgICAgICBob3N0ZWRab25lOiB6b25lLFxuICAgICAgICAgICAgICAgIHJlZ2lvbjogcHJvcHMhLmVudi5yZWdpb24sXG4gICAgICAgICAgICB9XG4gICAgICAgICkuY2VydGlmaWNhdGVBcm47XG4gICAgICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsIFwiQ2VydGlmaWNhdGVcIiwgeyB2YWx1ZTogY2VydGlmaWNhdGVBcm4gfSk7XG5cbiAgICAgICAgLy8gQ2xvdWRGcm9udCBkaXN0cmlidXRpb24gdGhhdCBwcm92aWRlcyBIVFRQU1xuICAgICAgICBjb25zdCBkaXN0cmlidXRpb24gPSBuZXcgY2xvdWRmcm9udC5DbG91ZEZyb250V2ViRGlzdHJpYnV0aW9uKFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgIFwiU2l0ZURpc3RyaWJ1dGlvblwiLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGFsaWFzQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICBhY21DZXJ0UmVmOiBjZXJ0aWZpY2F0ZUFybixcbiAgICAgICAgICAgICAgICAgICAgbmFtZXM6IFtzaXRlRG9tYWluXSxcbiAgICAgICAgICAgICAgICAgICAgc3NsTWV0aG9kOiBjbG91ZGZyb250LlNTTE1ldGhvZC5TTkksXG4gICAgICAgICAgICAgICAgICAgIHNlY3VyaXR5UG9saWN5OiBjbG91ZGZyb250LlNlY3VyaXR5UG9saWN5UHJvdG9jb2wuVExTX1YxXzJfMjAxOSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9yaWdpbkNvbmZpZ3M6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VzdG9tT3JpZ2luU291cmNlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9tYWluTmFtZTogc2l0ZUJ1Y2tldC5idWNrZXRXZWJzaXRlRG9tYWluTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5Qcm90b2NvbFBvbGljeTogY2xvdWRmcm9udC5PcmlnaW5Qcm90b2NvbFBvbGljeS5IVFRQX09OTFksXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgYmVoYXZpb3JzOiBbeyBpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZSB9XSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCBcIkRpc3RyaWJ1dGlvbklkXCIsIHtcbiAgICAgICAgICAgIHZhbHVlOiBkaXN0cmlidXRpb24uZGlzdHJpYnV0aW9uSWQsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFJvdXRlNTMgYWxpYXMgcmVjb3JkIGZvciB0aGUgQ2xvdWRGcm9udCBkaXN0cmlidXRpb25cbiAgICAgICAgbmV3IHJvdXRlNTMuQVJlY29yZCh0aGlzLCBcIlNpdGVBbGlhc1JlY29yZFwiLCB7XG4gICAgICAgICAgICByZWNvcmROYW1lOiBzaXRlRG9tYWluLFxuICAgICAgICAgICAgdGFyZ2V0OiByb3V0ZTUzLlJlY29yZFRhcmdldC5mcm9tQWxpYXMoXG4gICAgICAgICAgICAgICAgbmV3IHRhcmdldHMuQ2xvdWRGcm9udFRhcmdldChkaXN0cmlidXRpb24pXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgem9uZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gRGVwbG95IHNpdGUgY29udGVudHMgdG8gUzMgYnVja2V0XG4gICAgICAgIG5ldyBzM2RlcGxveS5CdWNrZXREZXBsb3ltZW50KHRoaXMsIFwiRGVwbG95V2l0aEludmFsaWRhdGlvblwiLCB7XG4gICAgICAgICAgICBzb3VyY2VzOiBbczNkZXBsb3kuU291cmNlLmFzc2V0KHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi8ubmV4dCcpKV0sXG4gICAgICAgICAgICBkZXN0aW5hdGlvbkJ1Y2tldDogc2l0ZUJ1Y2tldCxcbiAgICAgICAgICAgIGRpc3RyaWJ1dGlvbixcbiAgICAgICAgICAgIGRpc3RyaWJ1dGlvblBhdGhzOiBbXCIvKlwiXSxcbiAgICAgICAgfSk7XG4gICAgfVxufSJdfQ==