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
    const vpc = new ec2.Vpc(this, 'vpc-59a45931', {
      maxAzs: 1,
      enableDnsHostnames: true,
      cidr: '10.0.0.0/16',
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'ingress',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'application',
          subnetType: ec2.SubnetType.PRIVATE,
        },
        {
          cidrMask: 28,
          name: 'rds',
          subnetType: ec2.SubnetType.ISOLATED,
        }
      ]
    });

    const mySG = new ec2.SecurityGroup(this, 'ssh-and-internet-access', {
      vpc: vpc,
      allowAllOutbound: true,
      description: 'SSH, HTTP and HTTPS access'
    });

    mySG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'SSH from anywhere');
    mySG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'HTTP Ingress');
    mySG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'HTTPS Ingress');

    // define the IAM role that will allow the EC2 instance to communicate with SSM 
    const role = new Role(this, props!.role, {
      assumedBy: new ServicePrincipal(siteDomain)
    });
    // arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore
    role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'));


    // define a user data script to install & launch our web server 
    const ssmaUserData = UserData.forLinux();
    // make sure the latest SSM Agent is installed.
    const SSM_AGENT_RPM = 'https://s3.amazonaws.com/ec2-downloads-windows/SSMAgent/latest/linux_amd64/amazon-ssm-agent.rpm';
    ssmaUserData.addCommands(`sudo yum install -y ${SSM_AGENT_RPM}`, 'restart amazon-ssm-agent');
    // install and start Nginx
    ssmaUserData.addCommands('yum install -y nginx', 'chkconfig nginx on', 'service nginx start');

    // launch an EC2 instance in the private subnet
    const instance = new Ec2(this, 'NewsBlogInstance', {
      image: new AmazonLinuxImage(),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
      subnet: privateSubnet0,
      role: role,
      userData: ssmaUserData
    })
  }
}