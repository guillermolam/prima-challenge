import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as fs from "fs";
import * as awsx from "@pulumi/awsx";

const stackConfig = new pulumi.Config("prisma-website");
const vpc = new awsx.ec2.Vpc('vpc-59a45931', {
    cidrBlock: '10.0.0.0/16',
    enableDnsHostnames: true,
    numberOfAvailabilityZones: 2,
    tags: {
        Name: 'Prisma VPC'
    }
});
// Export a few resulting fields to make them easy to use:
export const vpcId = vpc.id;
export const vpcPrivateSubnetIds = vpc.privateSubnetIds;
export const vpcPublicSubnetIds = vpc.publicSubnetIds;

const publicKey = stackConfig.requireSecret("publicKey");
const key = new aws.ec2.KeyPair('key', {
    keyName: "keypair-pulumi",
    publicKey: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDsOGFj1K9BwwGEBbP6oIJWhQlziVN+87nWY0JtuM9FAYHL0Nxj5FwkqljnP+IJRYfqOBK3Q0BIgq90akgN2Po9S3+C8ILCFcTWSDmYsVsDkdS96BXTXNFmH0YX6S7zqsOpvtbvURZTO56fNc+2TU8g/kPt7pmr/9XAj/5PCSj2txPmTmBU5kqdiXWlWJxdgUIWpE/3tPX2iWKETu16s0RLriZbHVp8w0pr9GYq5483bmJVzu9F6eQ74ThVaaUWfK9V9Ds5lyI9g3jKQC1bgi1ISxVyWpf/OkVJvPHEWri6AVFFWrlwRNKl9WLsRPuyJ+iHLku7nIa2a0bDJcYDevZb guillermolammartin@Guille.local",
    tags: {
        name: "keypair-pulumi-ec2"
    }
});

const sshGroup = new aws.ec2.SecurityGroup('ssh-access', {
    ingress: [
        { protocol: 'tcp', fromPort: 22, toPort: 22, cidrBlocks: ['0.0.0.0/0'] }
    ],
    vpcId: vpc.id
});

const internetGroup = new aws.ec2.SecurityGroup('internet-access', {
    ingress: [
        { protocol: 'tcp', fromPort: 80, toPort: 80, cidrBlocks: ['0.0.0.0/0'] }
    ],
    egress: [
        { protocol: '-1', fromPort: 0, toPort: 0, cidrBlocks: ['0.0.0.0/0'] }
    ],
    vpcId: vpc.id
});

const tlsGroup = new aws.ec2.SecurityGroup('tls-access', {
    ingress: [
        { protocol: 'tcp', fromPort: 443, toPort: 443, cidrBlocks: ['0.0.0.0/0'] }
    ],
    vpcId: vpc.id
});

const ubuntuAmi = aws.getAmi({
    mostRecent: true,
    filters: [
        {
            name: "name",
            values: ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"],
        },
        {
            name: "virtualization-type",
            values: ["hvm"],
        },
    ],
    owners: ["099720109477"],
});

const size = "t2.micro";     // t2.micro is available in the AWS free tier
const server = new aws.ec2.Instance('prisma-webserver', {
    instanceType: size,
    ami: ubuntuAmi.then(ami => ami.id),
    subnetId: pulumi.output(vpc.publicSubnetIds)[0],
    vpcSecurityGroupIds: [sshGroup.id, internetGroup.id, tlsGroup.id],
    keyName: key.keyName,
    associatePublicIpAddress: true,
    userData: fs.readFileSync("provision-ubuntu.sh", "utf-8"),
    tags: {
        Name: "prisma-webserver",
    },
});

const server2 = new aws.ec2.Instance('prisma-webserver-2', {
    instanceType: size,
    ami: ubuntuAmi.then(ami => ami.id),
    subnetId: pulumi.output(vpc.publicSubnetIds)[1],
    vpcSecurityGroupIds: [sshGroup.id, internetGroup.id, tlsGroup.id],
    keyName: key.keyName,
    associatePublicIpAddress: true,
    userData: fs.readFileSync("provision-ubuntu.sh", "utf-8"),
    tags: {
        Name: "prisma-webserver-2",
    },
});

// Create a new load balancer
const loadBalancer = new aws.elb.LoadBalancer("load-balancer-prisma", {
    name: 'load-balancer-prisma',
    subnets: [
        pulumi.output(vpc.publicSubnetIds)[0],
        pulumi.output(vpc.publicSubnetIds)[1]
    ],
    securityGroups: [
        tlsGroup.id, internetGroup.id, sshGroup.id
    ],
    listeners: [
        {
            instancePort: 80,
            instanceProtocol: "http",
            lbPort: 80,
            lbProtocol: "http",
        },
        {
            instancePort: 8000,
            instanceProtocol: "http",
            lbPort: 443,
            lbProtocol: "https",
            sslCertificateId: "arn:aws:acm:eu-west-3:401280197872:certificate/ce8236f5-727d-4626-b2b0-6f7a84f26aaf",
        },
    ],
    healthCheck: {
        healthyThreshold: 2,
        unhealthyThreshold: 2,
        timeout: 3,
        target: "HTTP:80/",
        interval: 30,
    },
    instances: [server.id, server2.id],
    crossZoneLoadBalancing: true,
    idleTimeout: 400,
    connectionDraining: true,
    connectionDrainingTimeout: 400,
    tags: {
        Name: "foobar-elb",
    },
});

// WEB ACL to restrict attacks
const webAclName = "common-attacks-web-acl";
const stack = new aws.cloudformation.Stack(webAclName, {
    parameters: {
    },
    templateUrl: 'https://s3.amazonaws.com/cloudformation-examples/community/common-attacks.json'
});

// Dynamic Cloudfront
const ttl = 60 * 10;
const distributionArgs: aws.cloudfront.DistributionArgs = {
    enabled: true,
    defaultCacheBehavior: {
        targetOriginId: loadBalancer.id,
        viewerProtocolPolicy: "redirect-to-https",
        allowedMethods: ["GET", "HEAD"],
        cachedMethods: ["GET", "HEAD"],

        forwardedValues: {
            cookies: { forward: "none" },
            queryString: false,
        },

        minTtl: 0,
        defaultTtl: ttl,
        maxTtl: ttl,
    },
    restrictions: {
        geoRestriction: {
            restrictionType: "whitelist",
            locations: [
                "ES",
                "DE",
            ],
        },
    },
    webAclId: webAclName,
    origins: [
        {
            originId: loadBalancer.name,
            domainName: loadBalancer.name,
            customOriginConfig: {

                originProtocolPolicy: "http-only",
                httpPort: 80,
                httpsPort: 443,
                originSslProtocols: ["TLSv1.2"]
            },
        },
    ],
    priceClass: "PriceClass_100",
    viewerCertificate: {
        cloudfrontDefaultCertificate: true,
    }
};

const cdn = new aws.cloudfront.Distribution("cdn", distributionArgs);

export const publicIp = server.publicIp;
export const publicHostName = server.publicDns;