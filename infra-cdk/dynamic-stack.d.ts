import * as cdk from '@aws-cdk/core';
import { DynamicStackProps } from './multi-stack-definition';
/*** DYNAMIC ***/
export declare class DynamicStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: DynamicStackProps);
}
