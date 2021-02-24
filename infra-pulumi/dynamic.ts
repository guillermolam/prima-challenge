import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as dotenv from "dotenv"

const vpc = new aws.ec2.Vpc('vpc-59a45931', {
    cidrBlock: '10.0.0.0/16'
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

const sshGroup = new aws.ec2.SecurityGroup('ssh-access', {
    ingress: [
        { protocol: 'tcp', fromPort: 22, toPort: 22, cidrBlocks: ['0.0.0.0/0'] }
    ],
    vpcId: vpc.id
});
dotenv.config();
const publicKey = process.env.SSH_KEY; // Substitute for your own SSH PUBLIC KEY
if (!publicKey) throw new Error('Missing public key.');
const key = new aws.ec2.KeyPair('key', { publicKey });

const internetGroup = new aws.ec2.SecurityGroup('internet-access', {
    egress: [
        { protocol: '-1', fromPort: 0, toPort: 0, cidrBlocks: ['0.0.0.0/0'] }
    ],
    vpcId: vpc.id
});


const ami = pulumi.output(aws.getAmi({
    filters: [{
        name: "name",
        values: ["amzn-ami-hvm-*"],
    }],
    owners: ["137112412989"], // This owner ID is Amazon
    mostRecent: true,
}));

const group = new aws.ec2.SecurityGroup("prisma-secgrp", {
    ingress: [
        { protocol: "tcp", fromPort: 22, toPort: 22, cidrBlocks: ["0.0.0.0/0"] },
    ],
});

const size = "t2.micro";     // t2.micro is available in the AWS free tier
const server = new aws.ec2.Instance('my-server', {
    instanceType: size,
    ami: ami.id,
    subnetId: subnet.id,
    vpcSecurityGroupIds: [sshGroup.id, internetGroup.id],
    keyName: key.keyName
});

const eip = new aws.ec2.Eip("my - server - eip", {
    instance: server.id,
    vpc: true
});


export const publicIp = server.publicIp;
export const publicHostName = server.publicDns;