import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { DynamicStack } from '../infra-cdk/dynamic-stack';
import { StaticStack } from '../infra-cdk/static-stack';


test('S3 Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new StaticStack(app, 'StaticStack');
    // THEN
    expectCDK(stack).to(haveResource("AWS::S3",{ }));
});

});
