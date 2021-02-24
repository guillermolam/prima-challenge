import * as cdk from '@aws-cdk/core';
import { StaticStackProps } from './multi-stack-definition';
/** STATIC **/
export declare class StaticStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: StaticStackProps);
}
