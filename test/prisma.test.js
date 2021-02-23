"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const dynamic_stack_1 = require("../lib/dynamic-stack");
const static_stack_1 = require("../lib/static-stack");
test('SQS Queue Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new static_stack_1.StaticStack(app, 'MyTestStack');
    // THEN
    //expectCDK(stack).to(haveResource("AWS::SQS::Queue",{
    //  VisibilityTimeout: 300
    //}));
});
test('SNS Topic Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new dynamic_stack_1.DynamicStack(app, 'MyTestStack');
    // THEN
    // expectCDK(stack).to(haveResource("AWS::SNS::Topic"));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpc21hLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcmlzbWEudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHFDQUFxQztBQUNyQyx3REFBb0Q7QUFDcEQsc0RBQWtEO0FBR2xELElBQUksQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7SUFDM0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDMUIsT0FBTztJQUNQLE1BQU0sS0FBSyxHQUFHLElBQUksMEJBQVcsQ0FBQyxHQUFHLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDbEQsT0FBTztJQUNQLHNEQUFzRDtJQUN0RCwwQkFBMEI7SUFDMUIsTUFBTTtBQUNWLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtJQUM3QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUMxQixPQUFPO0lBQ1AsTUFBTSxLQUFLLEdBQUcsSUFBSSw0QkFBWSxDQUFDLEdBQUcsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNuRCxPQUFPO0lBQ1Isd0RBQXdEO0FBQ3pELENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXhwZWN0IGFzIGV4cGVjdENESywgaGF2ZVJlc291cmNlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0JztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IER5bmFtaWNTdGFjayB9IGZyb20gJy4uL2xpYi9keW5hbWljLXN0YWNrJztcbmltcG9ydCB7IFN0YXRpY1N0YWNrIH0gZnJvbSAnLi4vbGliL3N0YXRpYy1zdGFjayc7XG5cblxudGVzdCgnU1FTIFF1ZXVlIENyZWF0ZWQnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhdGljU3RhY2soYXBwLCAnTXlUZXN0U3RhY2snKTtcbiAgICAvLyBUSEVOXG4gICAgLy9leHBlY3RDREsoc3RhY2spLnRvKGhhdmVSZXNvdXJjZShcIkFXUzo6U1FTOjpRdWV1ZVwiLHtcbiAgICAvLyAgVmlzaWJpbGl0eVRpbWVvdXQ6IDMwMFxuICAgIC8vfSkpO1xufSk7XG5cbnRlc3QoJ1NOUyBUb3BpYyBDcmVhdGVkJywgKCkgPT4ge1xuICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAvLyBXSEVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IER5bmFtaWNTdGFjayhhcHAsICdNeVRlc3RTdGFjaycpO1xuICAvLyBUSEVOXG4gLy8gZXhwZWN0Q0RLKHN0YWNrKS50byhoYXZlUmVzb3VyY2UoXCJBV1M6OlNOUzo6VG9waWNcIikpO1xufSk7XG4iXX0=