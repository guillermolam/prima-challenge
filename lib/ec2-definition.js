"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ec2 = exports.Ec2InstanceProps = void 0;
const core_1 = require("@aws-cdk/core");
const ec2 = require("@aws-cdk/aws-ec2");
const aws_iam_1 = require("@aws-cdk/aws-iam");
class Ec2InstanceProps {
}
exports.Ec2InstanceProps = Ec2InstanceProps;
class Ec2 extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        if (props) {
            //create a profile to attch the role to the instance
            const profile = new aws_iam_1.CfnInstanceProfile(this, `${id}Profile`, {
                roles: [props.role.roleName]
            });
            // create the instance
            const instance = new ec2.CfnInstance(this, id, {
                imageId: props.image.getImage(this).imageId,
                instanceType: props.instanceType.toString(),
                networkInterfaces: [
                    {
                        deviceIndex: "0",
                        subnetId: props.subnet.subnetId
                    }
                ],
                userData: core_1.Fn.base64(props.userData.render()),
                iamInstanceProfile: profile.ref
            });
            // tag the instance
            core_1.Tags.of(instance).add('Name', `${id}`);
            core_1.Tags.of(instance).add('StackType', 'Dynamic');
        }
    }
}
exports.Ec2 = Ec2;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWMyLWRlZmluaXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlYzItZGVmaW5pdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx3Q0FBbUU7QUFDbkUsd0NBQXVDO0FBRXZDLDhDQUEyRDtBQUczRCxNQUFhLGdCQUFnQjtDQU01QjtBQU5ELDRDQU1DO0FBRUQsTUFBYSxHQUFJLFNBQVEsZUFBUTtJQUMvQixZQUFZLEtBQW9CLEVBQUUsRUFBVSxFQUFFLEtBQXdCO1FBQ3BFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsSUFBSSxLQUFLLEVBQUU7WUFFVCxvREFBb0Q7WUFDcEQsTUFBTSxPQUFPLEdBQUcsSUFBSSw0QkFBa0IsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRTtnQkFDM0QsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7YUFDN0IsQ0FBQyxDQUFDO1lBRUgsc0JBQXNCO1lBQ3RCLE1BQU0sUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFO2dCQUM3QyxPQUFPLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTztnQkFDM0MsWUFBWSxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFO2dCQUMzQyxpQkFBaUIsRUFBRTtvQkFDakI7d0JBQ0UsV0FBVyxFQUFFLEdBQUc7d0JBQ2hCLFFBQVEsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVE7cUJBQ2hDO2lCQUNGO2dCQUNDLFFBQVEsRUFBRSxTQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQzVDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxHQUFHO2FBQ2xDLENBQUMsQ0FBQztZQUVILG1CQUFtQjtZQUNuQixXQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZDLFdBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztTQUMvQztJQUNILENBQUM7Q0FDRjtBQTlCRCxrQkE4QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBGbiwgVGFnLCBSZXNvdXJjZSwgU2NvcGVkQXdzLCBUYWdzIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMidcbmltcG9ydCB7IFVzZXJEYXRhIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgeyBSb2xlLCBDZm5JbnN0YW5jZVByb2ZpbGUgfSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJ1xuaW1wb3J0IHsgRHluYW1pY1N0YWNrIH0gZnJvbSAnLi9keW5hbWljLXN0YWNrJztcblxuZXhwb3J0IGNsYXNzIEVjMkluc3RhbmNlUHJvcHMge1xuICByZWFkb25seSBpbWFnZTogZWMyLklNYWNoaW5lSW1hZ2U7XG4gIHJlYWRvbmx5IGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZTtcbiAgcmVhZG9ubHkgdXNlckRhdGE6IFVzZXJEYXRhO1xuICByZWFkb25seSBzdWJuZXQ6IGVjMi5JU3VibmV0O1xuICByZWFkb25seSByb2xlOiBSb2xlO1xufVxuXG5leHBvcnQgY2xhc3MgRWMyIGV4dGVuZHMgUmVzb3VyY2Uge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBFYzJJbnN0YW5jZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGlmIChwcm9wcykge1xuXG4gICAgICAvL2NyZWF0ZSBhIHByb2ZpbGUgdG8gYXR0Y2ggdGhlIHJvbGUgdG8gdGhlIGluc3RhbmNlXG4gICAgICBjb25zdCBwcm9maWxlID0gbmV3IENmbkluc3RhbmNlUHJvZmlsZSh0aGlzLCBgJHtpZH1Qcm9maWxlYCwge1xuICAgICAgICByb2xlczogW3Byb3BzLnJvbGUucm9sZU5hbWVdXG4gICAgICB9KTtcblxuICAgICAgLy8gY3JlYXRlIHRoZSBpbnN0YW5jZVxuICAgICAgY29uc3QgaW5zdGFuY2UgPSBuZXcgZWMyLkNmbkluc3RhbmNlKHRoaXMsIGlkLCB7XG4gICAgICAgIGltYWdlSWQ6IHByb3BzLmltYWdlLmdldEltYWdlKHRoaXMpLmltYWdlSWQsXG4gICAgICAgIGluc3RhbmNlVHlwZTogcHJvcHMuaW5zdGFuY2VUeXBlLnRvU3RyaW5nKCksXG4gICAgICAgIG5ldHdvcmtJbnRlcmZhY2VzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGV2aWNlSW5kZXg6IFwiMFwiLFxuICAgICAgICAgICAgc3VibmV0SWQ6IHByb3BzLnN1Ym5ldC5zdWJuZXRJZFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgICAsIHVzZXJEYXRhOiBGbi5iYXNlNjQocHJvcHMudXNlckRhdGEucmVuZGVyKCkpXG4gICAgICAgICwgaWFtSW5zdGFuY2VQcm9maWxlOiBwcm9maWxlLnJlZlxuICAgICAgfSk7XG5cbiAgICAgIC8vIHRhZyB0aGUgaW5zdGFuY2VcbiAgICAgIFRhZ3Mub2YoaW5zdGFuY2UpLmFkZCgnTmFtZScsIGAke2lkfWApO1xuICAgICAgVGFncy5vZihpbnN0YW5jZSkuYWRkKCdTdGFja1R5cGUnLCAnRHluYW1pYycpO1xuICAgIH1cbiAgfVxufSJdfQ==