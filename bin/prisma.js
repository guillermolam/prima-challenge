#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const cdk = require("@aws-cdk/core");
const static_stack_1 = require("../lib/static-stack");
const dynamic_stack_1 = require("../lib/dynamic-stack");
const app = new cdk.App();
/** STATIC **/
const staticSite = new static_stack_1.StaticStack(app, "PrismaCapacitycStaticSite", {
    env: {
        region: 'eu-west-3',
        account: '401280197872'
    },
    domain: {
        domainName: 'prismacapacity.com',
        siteSubDomain: 'guillermolam'
    }
});
/** DYNAMIC / VPC / EC2 **/
const dynamicSite = new dynamic_stack_1.DynamicStack(app, "PrismaCapacityDynamicSite", {
    role: 'PrismaAdminRole',
    env: {
        region: 'eu-west-3',
        account: '401280197872'
    },
    domain: {
        domainName: 'prismacapacity.com',
        siteSubDomain: 'guillermolam-dynamic'
    }
});
cdk.Tags.of(staticSite).add("Project", "Prisma Capaity Assignment for Guillermo Lam");
cdk.Tags.of(staticSite).add("Author", "Guillermo Lam");
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpc21hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicHJpc21hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHVDQUFxQztBQUNyQyxxQ0FBcUM7QUFDckMsc0RBQWtEO0FBQ2xELHdEQUFvRDtBQUVwRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtBQUV6QixjQUFjO0FBQ2QsTUFBTSxVQUFVLEdBQUcsSUFBSSwwQkFBVyxDQUFDLEdBQUcsRUFBRSwyQkFBMkIsRUFBRTtJQUNqRSxHQUFHLEVBQUU7UUFDRCxNQUFNLEVBQUUsV0FBVztRQUNuQixPQUFPLEVBQUUsY0FBYztLQUMxQjtJQUNELE1BQU0sRUFBRTtRQUNKLFVBQVUsRUFBRSxvQkFBb0I7UUFDaEMsYUFBYSxFQUFFLGNBQWM7S0FDaEM7Q0FDSixDQUFDLENBQUE7QUFFRiwyQkFBMkI7QUFDM0IsTUFBTSxXQUFXLEdBQUcsSUFBSSw0QkFBWSxDQUFDLEdBQUcsRUFBRSwyQkFBMkIsRUFBRTtJQUNuRSxJQUFJLEVBQUUsaUJBQWlCO0lBQ3ZCLEdBQUcsRUFBRTtRQUNELE1BQU0sRUFBRSxXQUFXO1FBQ25CLE9BQU8sRUFBRSxjQUFjO0tBQzFCO0lBQ0QsTUFBTSxFQUFFO1FBQ0osVUFBVSxFQUFFLG9CQUFvQjtRQUNoQyxhQUFhLEVBQUUsc0JBQXNCO0tBQ3hDO0NBQ0osQ0FBQyxDQUFBO0FBRUYsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSw2Q0FBNkMsQ0FBQyxDQUFBO0FBQ3JGLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLENBQUE7QUFFdEQsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0ICdzb3VyY2UtbWFwLXN1cHBvcnQvcmVnaXN0ZXInO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgU3RhdGljU3RhY2sgfSBmcm9tICcuLi9saWIvc3RhdGljLXN0YWNrJztcbmltcG9ydCB7IER5bmFtaWNTdGFjayB9IGZyb20gJy4uL2xpYi9keW5hbWljLXN0YWNrJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKVxuXG4vKiogU1RBVElDICoqL1xuY29uc3Qgc3RhdGljU2l0ZSA9IG5ldyBTdGF0aWNTdGFjayhhcHAsIFwiUHJpc21hQ2FwYWNpdHljU3RhdGljU2l0ZVwiLCB7XG4gICAgZW52OiB7XG4gICAgICAgIHJlZ2lvbjogJ2V1LXdlc3QtMycsXG4gICAgICAgIGFjY291bnQ6ICc0MDEyODAxOTc4NzInXG4gICAgfSxcbiAgICBkb21haW46IHtcbiAgICAgICAgZG9tYWluTmFtZTogJ3ByaXNtYWNhcGFjaXR5LmNvbScsXG4gICAgICAgIHNpdGVTdWJEb21haW46ICdndWlsbGVybW9sYW0nXG4gICAgfVxufSlcblxuLyoqIERZTkFNSUMgLyBWUEMgLyBFQzIgKiovXG5jb25zdCBkeW5hbWljU2l0ZSA9IG5ldyBEeW5hbWljU3RhY2soYXBwLCBcIlByaXNtYUNhcGFjaXR5RHluYW1pY1NpdGVcIiwge1xuICAgIHJvbGU6ICdQcmlzbWFBZG1pblJvbGUnLFxuICAgIGVudjoge1xuICAgICAgICByZWdpb246ICdldS13ZXN0LTMnLFxuICAgICAgICBhY2NvdW50OiAnNDAxMjgwMTk3ODcyJ1xuICAgIH0sXG4gICAgZG9tYWluOiB7XG4gICAgICAgIGRvbWFpbk5hbWU6ICdwcmlzbWFjYXBhY2l0eS5jb20nLFxuICAgICAgICBzaXRlU3ViRG9tYWluOiAnZ3VpbGxlcm1vbGFtLWR5bmFtaWMnXG4gICAgfVxufSlcblxuY2RrLlRhZ3Mub2Yoc3RhdGljU2l0ZSkuYWRkKFwiUHJvamVjdFwiLCBcIlByaXNtYSBDYXBhaXR5IEFzc2lnbm1lbnQgZm9yIEd1aWxsZXJtbyBMYW1cIilcbmNkay5UYWdzLm9mKHN0YXRpY1NpdGUpLmFkZChcIkF1dGhvclwiLCBcIkd1aWxsZXJtbyBMYW1cIilcblxuYXBwLnN5bnRoKClcbiJdfQ==