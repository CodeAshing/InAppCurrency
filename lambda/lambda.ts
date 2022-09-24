import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import { Duration } from '@aws-cdk/core';

// Configure path to Dockerfile
const dockerfile = path.join(__dirname, '../Dockerfile');

// Create AWS Lambda function and push image to ECR
const myLambda = new lambda.DockerImageFunction(this, 'LambdaFunction', {
    code: lambda.DockerImageCode.fromImageAsset(dockerfile),
    timeout: Duration.minutes(15),
});
