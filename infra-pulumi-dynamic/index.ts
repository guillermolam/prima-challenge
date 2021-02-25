import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as fs from "fs";

const stackConfig = new pulumi.Config("prisma-website");
const vpc = new aws.ec2.Vpc('vpc-59a45931', {
    cidrBlock: '10.0.0.0/16',
    enableDnsHostnames: true
});

const internetGateway = new aws.ec2.InternetGateway('prisma-internetgateway', {
    vpcId: vpc.id
});

const subnet = new aws.ec2.Subnet('prisma-public-subnet', {
    cidrBlock: '10.0.0.0/24',
    tags: {
        Name: 'Main'
    },
    vpcId: vpc.id
});

// Allow access to any address outside VPC except for addresses inside VPC.
const publicRouteTable = new aws.ec2.RouteTable('prisma-route-table', {
    routes: [
        {
            cidrBlock: '0.0.0.0/0',
            gatewayId: internetGateway.id
        }
    ],
    vpcId: vpc.id
});

const publicRouteTableAssociation = new aws.ec2.RouteTableAssociation(
    'prisma-route-table-association',
    {
        routeTableId: publicRouteTable.id,
        subnetId: subnet.id
    }
);

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

const amiprisma = pulumi.output(aws.getAmi({
    mostRecent: true,
    filters: [
        {
            name: "name",
            values: ["prisma-webserver-ami"],
        },
        {
            name: "virtualization-type",
            values: ["hvm"],
        },
    ],
    owners: ["401280197872"],
}));

const size = "t2.micro";     // t2.micro is available in the AWS free tier
const server = new aws.ec2.Instance('prisma-webserver', {
    instanceType: size,
    ami: amiprisma.id,
    subnetId: subnet.id,
    vpcSecurityGroupIds: [sshGroup.id, internetGroup.id, tlsGroup.id],
    keyName: key.keyName,
    associatePublicIpAddress: true,
    userData: fs.readFileSync("provision-amzn.sh", "utf-8"),
    tags: {
        Name: "prisma-webserver",
    },
});

const eip = new aws.ec2.Eip("prisma-server-eip", {
    instance: server.id,
    vpc: true
});

export const publicIp = server.publicIp;
export const publicHostName = server.publicDns;