#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { StaticStack } from '../lib/static-stack';
import { DynamicStack } from '../lib/dynamic-stack';

const app = new cdk.App()

/** STATIC **/
const staticSite = new StaticStack(app, "PrismaCapacitycStaticSite", {
    env: {
        region: 'eu-west-3',
        account: '401280197872'
    },
    domain: {
        domainName: 'prismacapacity.com',
        siteSubDomain: 'guillermolam'
    }
})

/** DYNAMIC / VPC / EC2 **/
const dynamicSite = new DynamicStack(app, "PrismaCapacityDynamicSite", {
    role: 'PrismaAdminRole',
    env: {
        region: 'eu-west-3',
        account: '401280197872'
    },
    domain: {
        domainName: 'prismacapacity.com',
        siteSubDomain: 'guillermolam-dynamic'
    }
})

cdk.Tags.of(staticSite).add("Project", "Prisma Capaity Assignment for Guillermo Lam")
cdk.Tags.of(staticSite).add("Author", "Guillermo Lam")

app.synth()
