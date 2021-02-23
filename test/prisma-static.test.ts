import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { DynamicStack } from '../lib/dynamic-stack';
import { StaticStack } from '../lib/static-stack';


test('S3 Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new StaticStack(app, 'StaticStack');
    // THEN
    expectCDK(stack).to(haveResource("AWS::S3",{ }));
});

test('VPC Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new DynamicStack(app, 'DynamicStack');
  // THEN
  expectCDK(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
    Scheme: "internet-facing"
  }));
});
