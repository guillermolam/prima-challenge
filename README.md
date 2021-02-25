# Challenge 3: Website Deployment

Welcome to Challenge 3.

This project was bootstrapped with [Create Next App](https://github.com/segmentio/create-next-app).

## Task 1 

Given this project deploy it to AWS in an automated and reproducible fashion. The website should be reachable from all over the world.

URL : http://guillermolam.prisma.capacity.com.s3-website.eu-west-3.amazonaws.com/
- ```cd``` inside of the folder and run ```pulumi_config.sh```
- ```npm run pulumi-deploy-static```
- 
 
## Task 2 

Restrict access to the site by using mechanisms that can be adapted programmatically.

## Task 3 

Deploy the site using at least 2 technology stacks. Make sure that both types of deployment can be reproduced in an automated fashion.

## Task 4 

What issues can you identify in the given site? What types of improvements would you suggest?

1) Not component oriented React.component
2) No server side rendering 
3) Does not use AMP to optimize rendering
4) Doesn't use Typescript which is less error prone
5) 
6) Requests to "https://haveibeenpwned.com/api/v2/breaches" should handle all possible error scenarios
7) CloudFront distribution Origin Access Identity leveraging origin access restriction to the bucket and allowing only access through the CDN
   For this you'd need a custom origin with a custom domain (Route53 and ARN Certificate, etc.)
8) Signed URL and Signed Cookies
9)  proper error handling for downstream requests
10) Stronger Cipher suites
11) Encrypt data at rest
12) No DDos mitigation using AWS Shield
13) Monitoring 
14) Add authenticationLogin page with Cognito utilizing 
