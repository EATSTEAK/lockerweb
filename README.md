# 숭실대학교 IT대학 사물함 시스템

숭실대학교 IT대학 사물함 시스템

## To-Dos and Done

- [X] Create monorepo containing backend(Lambda with SAM) and frontend(sveltekit)
- [X] Create simple validation and obtaining id from SSU SSO
- [X] Simple frontend with sso login PoC
- [X] Deploy Mocked Lambda functions to AWS with SAM
- [X] Local testing env w/ DynamoDB
- [X] Make Connection with DynamoDB and create session auth with it
- [X] Create S3 Bucket with SAM CloudFormation template
- [X] Deploy static svelte frontend to S3 Bucket
- [X] Create CloudFront with CloudFormation and connect route for it
- [X] Create Proxy with API Gateway with Lambda and S3 Bucket with frontend
- [X] Create reservation feature
- [ ] Create beautiful frontend with tailwindcss
- [ ] Make administration page
- [ ] Create Custom endpoint url for service
- [X] Organize Script for deployment/deletion

## Used Techs

* Many AWS Services, this service is deeply integrated with AWS.
    * SAM(Serverless Application Model)
    * Lambda
    * CloudFormation(IaaS, integrated with SAM)
    * DynamoDB
    * API Gateway
    * CloudFront
    * S3 Bucket
* Used PNPM for Monorepo package manager - It's fast!
* Svelte(sveltekit) for Frontend - Lightweight and new.

# How to run

```yaml
Prerequisites: aws-sam-cli, aws-cli, docker, node, pnpm
```

1. Run `pnpm i` in the root directory.
2. Run `pnpm dev` for testing.(No hot-reload for backend because of limitation of `sam local start-api`, You need to
   execute `pnpm build` in advance.)
3. Run `pnpm build` for production-ready build. (file generated to `ssu-it-locker-lambda/.aws-sam/build` for
   backend, `ssu-it-locker-frontend/.svelte-kit/build` for frontend)
4. Run `pnpm deploy` for deploy project to aws.
5. Run `pnpm delete` for delete service stack from AWS.