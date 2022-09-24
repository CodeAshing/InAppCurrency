import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';

const api = new apigateway.RestApi(this, 'API', {
  restApiName: 'Service',
  description: 'Description',
});

const resource = api.root.addResource('inference');

const lambdaIntegration = new apigateway.LambdaIntegration(myLambda);
resource.addMethod('POST', lambdaIntegration);
