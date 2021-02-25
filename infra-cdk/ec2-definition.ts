import * as cdk from '@aws-cdk/core';
import { Fn, Tag, Resource, ScopedAws, Tags } from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2'
import { UserData } from '@aws-cdk/aws-ec2';
import { Role, CfnInstanceProfile } from '@aws-cdk/aws-iam'
import { DynamicStack } from './dynamic-stack';

export class Ec2InstanceProps {
  readonly image: ec2.IMachineImage;
  readonly instanceType: ec2.InstanceType;
  readonly userData: UserData;
  readonly subnet: ec2.ISubnet;
}

export class Ec2 extends Resource {
  constructor(scope: cdk.Construct, id: string, props?: Ec2InstanceProps) {
    super(scope, id);

    if (props) {

      // create the instance
      const instance = new ec2.CfnInstance(this, id, {
        imageId: props.image.getImage(this).imageId,
        instanceType: props.instanceType.toString(),
        networkInterfaces: [
          {
            deviceIndex: "0",
            subnetId: props.subnet.subnetId
          }
        ]
        , userData: Fn.base64(props.userData.render())
      });

      // tag the instance
      Tags.of(instance).add('Name', `${id}`);
      Tags.of(instance).add('StackType', 'Dynamic');
    }
  }
}