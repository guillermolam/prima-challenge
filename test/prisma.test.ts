import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { DynamicStack } from '../lib/dynamic-stack';
import { StaticStack } from '../lib/static-stack';


test('SQS Queue Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new StaticStack(app, 'MyTestStack');
    // THEN
    //expectCDK(stack).to(haveResource("AWS::SQS::Queue",{
    //  VisibilityTimeout: 300
    //}));
});

test('SNS Topic Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new DynamicStack(app, 'MyTestStack');
  // THEN
 // expectCDK(stack).to(haveResource("AWS::SNS::Topic"));
});
