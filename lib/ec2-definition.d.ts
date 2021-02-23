import * as cdk from '@aws-cdk/core';
import { Resource } from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { UserData } from '@aws-cdk/aws-ec2';
import { Role } from '@aws-cdk/aws-iam';
export declare class Ec2InstanceProps {
    readonly image: ec2.IMachineImage;
    readonly instanceType: ec2.InstanceType;
    readonly userData: UserData;
    readonly subnet: ec2.ISubnet;
    readonly role: Role;
}
export declare class Ec2 extends Resource {
    constructor(scope: cdk.Construct, id: string, props?: Ec2InstanceProps);
}
