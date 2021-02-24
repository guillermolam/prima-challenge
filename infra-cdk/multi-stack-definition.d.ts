import * as cdk from '@aws-cdk/core';
export interface StaticStackProps extends cdk.StackProps {
    env: {
        region: string;
        account: string;
    };
    domain: {
        domainName: string;
        siteSubDomain: string;
    };
}
export interface DynamicStackProps extends cdk.StackProps {
    role: string;
    env: {
        region: string;
        account: string;
    };
    domain: {
        domainName: string;
        siteSubDomain: string;
    };
}
