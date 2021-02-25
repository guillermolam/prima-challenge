import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2'
import { AmazonLinuxImage, UserData } from '@aws-cdk/aws-ec2';
import { Role, ServicePrincipal, ManagedPolicy } from '@aws-cdk/aws-iam'
import { DynamicStackProps } from './multi-stack-definition';
import { Ec2 } from './ec2-definition';

/*** DYNAMIC ***/
export class DynamicStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: DynamicStackProps) {
    super(scope, id, props);

    const siteDomain = props!.domain.siteSubDomain + "." + props!.domain.domainName;
    // create VPC w/ public and private subnets in 1 AZ
    // this also creates a NAT Gateway 
    // I am using 1 AZ because it's a demo.  In real life always use >=2
    // an Internet Gateway is created by default whenever you create a public subnet.
    const publicSubnectConfiguration = {
      cidrMask: 16,
      name: 'public-subnet',
      subnetType: ec2.SubnetType.PUBLIC,
    };
    const vpc = new ec2.Vpc(this, 'prisma-vpc', {
      maxAzs: 1,
      cidr: '10.0.0.0/16',
      subnetConfiguration: [publicSubnectConfiguration],
      natGateways: 1
    });

    const securityGroup = new ec2.SecurityGroup(this, 'ssh-and-internet-access', {
      vpc: vpc,
      allowAllOutbound: true,
      description: 'SSH, HTTP and HTTPS access'
    });
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'SSH from anywhere');
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'HTTP Ingress');
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'HTTPS Ingress');
    securityGroup.addEgressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'HTTP Egress');
    securityGroup.addEgressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'HTTPS Egress');

    // define a user data script to install & launch our web server 
    const ssmaUserData = UserData.forLinux();
    // make sure the latest SSM Agent is installed.
    const SSM_AGENT_RPM = 'https://s3.amazonaws.com/ec2-downloads-windows/SSMAgent/latest/linux_amd64/amazon-ssm-agent.rpm';
    ssmaUserData.addCommands(`sudo yum install -y ${SSM_AGENT_RPM}`, 'restart amazon-ssm-agent');
    // install and start Nginx
    ssmaUserData.addCommands('yum install -y nginx', 'chkconfig nginx on', 'service nginx start');

    // launch an EC2 instance in the private subnet
    // define the IAM role that will allow the EC2 instance to communicate with SSM 

    const instance = new ec2.CfnInstance(this, 'prisma-webserver', {
      imageId: new AmazonLinuxImage().getImage(this).imageId,
      instanceType: 't2.micro',
      networkInterfaces: [
        {
          deviceIndex: "0",
          subnetId: vpc.publicSubnets[0].subnetId
        }
      ]
    });
  }
}