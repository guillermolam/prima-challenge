# Challenge 3: Website Deployment

Welcome to Challenge 3.

This project was bootstrapped with [Create Next App](https://github.com/segmentio/create-next-app).

## Getting started
This will run typescript linter, next build and export and it'll build and push a docker image
I have Used Pulumi and I created another implementation in AWS CDK
- ```npm run build```

## Task 1 

Given this project deploy it to AWS in an automated and reproducible fashion. The website should be reachable from all over the world.

URL : http://guillermolam.prisma.capacity.com.s3-website.eu-west-3.amazonaws.com/
- ```npm run pulumi-deploy-static```
 
## Task 2 

Restrict access to the site by using mechanisms that can be adapted programmatically.
- Geolocation
- IP Whitelisting
- WAF and Cloudfront leveraging ```https://s3.amazonaws.com/cloudformation-examples/community/common-attacks.json```

## Task 3 

Deploy the site using at least 2 technology stacks. Make sure that both types of deployment can be reproduced in an automated fashion.
- ```npm run pulumi-deploy-dynamic```

## Task 4 

What issues can you identify in the given site? What types of improvements would you suggest?

1) HTTP requests are executed directly from the consumer/client-side in JS to the third-party API.
   This presents an opportunity for an exploit as it is modifiable by anyone. 
   There is no CORS or CSRF validation which may lead to man in the middle attacks.

2) Not component oriented React.component
3) No server side rendering 
4) Does not use AMP to optimize rendering
5) Doesn't use Typescript which is less error prone
6) Unit tests are non-existent 
7) Requests to "https://haveibeenpwned.com/api/v2/breaches" should handle all possible error scenarios
   proper error handling for downstream requests
8)  Stronger Cipher suites
9)  No DDos mitigation using AWS Shield (Not in free tier)
10) Monitoring
