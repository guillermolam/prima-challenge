# Challenge 3: Website Deployment

Welcome to Challenge 3.

This project was bootstrapped with [Create Next App](https://github.com/segmentio/create-next-app).

## Getting started
This will run typescript linter, next build and export and it'll build and push a docker image
- ```npm run build```

## Task 1 

Given this project deploy it to AWS in an automated and reproducible fashion. The website should be reachable from all over the world.

URL : http://guillermolam.prisma.capacity.com.s3-website.eu-west-3.amazonaws.com/
- ```npm run pulumi-deploy-static```
 
## Task 2 

Restrict access to the site by using mechanisms that can be adapted programmatically.
- Geolocation
- IP Whitelisting
- WAF and Cloudfront
- 

## Task 3 

Deploy the site using at least 2 technology stacks. Make sure that both types of deployment can be reproduced in an automated fashion.
- ```npm run pulumi-deploy-dynamic```

## Task 4 

What issues can you identify in the given site? What types of improvements would you suggest?

1) Not component oriented React.component
2) No server side rendering 
3) Does not use AMP to optimize rendering
4) Doesn't use Typescript which is less error prone
5) Unit tests are non-existent 
6) Not using Gzip rendering
7) Requests to "https://haveibeenpwned.com/api/v2/breaches" should handle all possible error scenarios
8) CloudFront distribution Origin Access Identity leveraging origin access restriction to the bucket and allowing only access through the CDN
   For this you'd need a custom origin with a custom domain (Route53 and ARN Certificate, etc.)
9) Signed URL and Signed Cookies
10) proper error handling for downstream requests
11) Stronger Cipher suites
12) Encrypt data at rest
13) No DDos mitigation using AWS Shield
14) Monitoring 
15) Add authenticationLogin page with Cognito utilizing 
