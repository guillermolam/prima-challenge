"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicStack = void 0;
const cdk = require("@aws-cdk/core");
const ec2 = require("@aws-cdk/aws-ec2");
const aws_ec2_1 = require("@aws-cdk/aws-ec2");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const ec2_definition_1 = require("./ec2-definition");
/*** DYNAMIC ***/
class DynamicStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const siteDomain = props.domain.siteSubDomain + "." + props.domain.domainName;
        // create VPC w/ public and private subnets in 1 AZ
        // this also creates a NAT Gateway 
        // I am using 1 AZ because it's a demo.  In real life always use >=2
        const vpc = new ec2.Vpc(this, id, {
            maxAzs: 1
        });
        const privateSubnet0 = vpc.privateSubnets[0];
        // define the IAM role that will allow the EC2 instance to communicate with SSM 
        const role = new aws_iam_1.Role(this, props.role, {
            assumedBy: new aws_iam_1.ServicePrincipal(siteDomain)
        });
        // arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore
        role.addManagedPolicy(aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'));
        // define a user data script to install & launch our web server 
        const ssmaUserData = aws_ec2_1.UserData.forLinux();
        // make sure the latest SSM Agent is installed.
        const SSM_AGENT_RPM = 'https://s3.amazonaws.com/ec2-downloads-windows/SSMAgent/latest/linux_amd64/amazon-ssm-agent.rpm';
        ssmaUserData.addCommands(`sudo yum install -y ${SSM_AGENT_RPM}`, 'restart amazon-ssm-agent');
        // install and start Nginx
        ssmaUserData.addCommands('yum install -y nginx', 'chkconfig nginx on', 'service nginx start');
        // launch an EC2 instance in the private subnet
        const instance = new ec2_definition_1.Ec2(this, 'NewsBlogInstance', {
            image: new aws_ec2_1.AmazonLinuxImage(),
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
            subnet: privateSubnet0,
            role: role,
            userData: ssmaUserData
        });
    }
}
exports.DynamicStack = DynamicStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pYy1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImR5bmFtaWMtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXFDO0FBQ3JDLHdDQUF1QztBQUN2Qyw4Q0FBOEQ7QUFDOUQsOENBQXdFO0FBRXhFLHFEQUF1QztBQUVyQyxpQkFBaUI7QUFDakIsTUFBYSxZQUFhLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDekMsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUF5QjtRQUNyRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLFVBQVUsR0FBRyxLQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsR0FBRyxHQUFHLEdBQUcsS0FBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDbEYsbURBQW1EO1FBQ25ELG1DQUFtQztRQUNuQyxvRUFBb0U7UUFDcEUsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDaEMsTUFBTSxFQUFFLENBQUM7U0FDVixDQUFDLENBQUM7UUFDSCxNQUFNLGNBQWMsR0FBRyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTdDLGdGQUFnRjtRQUNoRixNQUFNLElBQUksR0FBRyxJQUFJLGNBQUksQ0FBQyxJQUFJLEVBQUUsS0FBTSxDQUFDLElBQUksRUFBRTtZQUN2QyxTQUFTLEVBQUUsSUFBSSwwQkFBZ0IsQ0FBQyxVQUFVLENBQUM7U0FDNUMsQ0FBQyxDQUFDO1FBQ0gsdURBQXVEO1FBQ3ZELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyx1QkFBYSxDQUFDLHdCQUF3QixDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQztRQUc5RixnRUFBZ0U7UUFDaEUsTUFBTSxZQUFZLEdBQUcsa0JBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN6QywrQ0FBK0M7UUFDL0MsTUFBTSxhQUFhLEdBQUcsaUdBQWlHLENBQUM7UUFDeEgsWUFBWSxDQUFDLFdBQVcsQ0FBQyx1QkFBdUIsYUFBYSxFQUFFLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztRQUM3RiwwQkFBMEI7UUFDMUIsWUFBWSxDQUFDLFdBQVcsQ0FBQyxzQkFBc0IsRUFBRSxvQkFBb0IsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1FBRTlGLCtDQUErQztRQUMvQyxNQUFNLFFBQVEsR0FBRyxJQUFJLG9CQUFHLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQ2pELEtBQUssRUFBRSxJQUFJLDBCQUFnQixFQUFFO1lBQzdCLFlBQVksRUFBRyxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQztZQUN4RixNQUFNLEVBQUcsY0FBYztZQUN2QixJQUFJLEVBQUUsSUFBSTtZQUNWLFFBQVEsRUFBRyxZQUFZO1NBQ3hCLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRjtBQXRDQyxvQ0FzQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMidcbmltcG9ydCB7IEFtYXpvbkxpbnV4SW1hZ2UsIFVzZXJEYXRhIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgeyBSb2xlLCBTZXJ2aWNlUHJpbmNpcGFsLCBNYW5hZ2VkUG9saWN5IH0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSdcbmltcG9ydCB7IER5bmFtaWNTdGFja1Byb3BzIH0gZnJvbSAnLi9tdWx0aS1zdGFjay1kZWZpbml0aW9uJztcbmltcG9ydCB7IEVjMiB9IGZyb20gJy4vZWMyLWRlZmluaXRpb24nO1xuXG4gIC8qKiogRFlOQU1JQyAqKiovXG4gIGV4cG9ydCBjbGFzcyBEeW5hbWljU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IER5bmFtaWNTdGFja1Byb3BzKSB7XG4gICAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgICAgY29uc3Qgc2l0ZURvbWFpbiA9IHByb3BzIS5kb21haW4uc2l0ZVN1YkRvbWFpbiArIFwiLlwiICsgcHJvcHMhLmRvbWFpbi5kb21haW5OYW1lO1xuICAgIC8vIGNyZWF0ZSBWUEMgdy8gcHVibGljIGFuZCBwcml2YXRlIHN1Ym5ldHMgaW4gMSBBWlxuICAgIC8vIHRoaXMgYWxzbyBjcmVhdGVzIGEgTkFUIEdhdGV3YXkgXG4gICAgLy8gSSBhbSB1c2luZyAxIEFaIGJlY2F1c2UgaXQncyBhIGRlbW8uICBJbiByZWFsIGxpZmUgYWx3YXlzIHVzZSA+PTJcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCBpZCwge1xuICAgICAgbWF4QXpzOiAxXG4gICAgfSk7XG4gICAgY29uc3QgcHJpdmF0ZVN1Ym5ldDAgPSB2cGMucHJpdmF0ZVN1Ym5ldHNbMF07XG5cbiAgICAvLyBkZWZpbmUgdGhlIElBTSByb2xlIHRoYXQgd2lsbCBhbGxvdyB0aGUgRUMyIGluc3RhbmNlIHRvIGNvbW11bmljYXRlIHdpdGggU1NNIFxuICAgIGNvbnN0IHJvbGUgPSBuZXcgUm9sZSh0aGlzLCBwcm9wcyEucm9sZSwge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbChzaXRlRG9tYWluKVxuICAgIH0pO1xuICAgIC8vIGFybjphd3M6aWFtOjphd3M6cG9saWN5L0FtYXpvblNTTU1hbmFnZWRJbnN0YW5jZUNvcmVcbiAgICByb2xlLmFkZE1hbmFnZWRQb2xpY3koTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ0FtYXpvblNTTU1hbmFnZWRJbnN0YW5jZUNvcmUnKSk7XG5cblxuICAgIC8vIGRlZmluZSBhIHVzZXIgZGF0YSBzY3JpcHQgdG8gaW5zdGFsbCAmIGxhdW5jaCBvdXIgd2ViIHNlcnZlciBcbiAgICBjb25zdCBzc21hVXNlckRhdGEgPSBVc2VyRGF0YS5mb3JMaW51eCgpO1xuICAgIC8vIG1ha2Ugc3VyZSB0aGUgbGF0ZXN0IFNTTSBBZ2VudCBpcyBpbnN0YWxsZWQuXG4gICAgY29uc3QgU1NNX0FHRU5UX1JQTSA9ICdodHRwczovL3MzLmFtYXpvbmF3cy5jb20vZWMyLWRvd25sb2Fkcy13aW5kb3dzL1NTTUFnZW50L2xhdGVzdC9saW51eF9hbWQ2NC9hbWF6b24tc3NtLWFnZW50LnJwbSc7XG4gICAgc3NtYVVzZXJEYXRhLmFkZENvbW1hbmRzKGBzdWRvIHl1bSBpbnN0YWxsIC15ICR7U1NNX0FHRU5UX1JQTX1gLCAncmVzdGFydCBhbWF6b24tc3NtLWFnZW50Jyk7XG4gICAgLy8gaW5zdGFsbCBhbmQgc3RhcnQgTmdpbnhcbiAgICBzc21hVXNlckRhdGEuYWRkQ29tbWFuZHMoJ3l1bSBpbnN0YWxsIC15IG5naW54JywgJ2Noa2NvbmZpZyBuZ2lueCBvbicsICdzZXJ2aWNlIG5naW54IHN0YXJ0Jyk7XG5cbiAgICAvLyBsYXVuY2ggYW4gRUMyIGluc3RhbmNlIGluIHRoZSBwcml2YXRlIHN1Ym5ldFxuICAgIGNvbnN0IGluc3RhbmNlID0gbmV3IEVjMih0aGlzLCAnTmV3c0Jsb2dJbnN0YW5jZScsIHtcbiAgICAgIGltYWdlOiBuZXcgQW1hem9uTGludXhJbWFnZSgpLFxuICAgICAgaW5zdGFuY2VUeXBlIDogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5CVVJTVEFCTEUzLCBlYzIuSW5zdGFuY2VTaXplLk1JQ1JPKSxcbiAgICAgIHN1Ym5ldCA6IHByaXZhdGVTdWJuZXQwLFxuICAgICAgcm9sZTogcm9sZSxcbiAgICAgIHVzZXJEYXRhIDogc3NtYVVzZXJEYXRhIFxuICAgIH0pXG4gIH1cbn0iXX0=