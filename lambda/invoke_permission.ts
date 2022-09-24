// give to apigateway permission to invoke the lambda
new lambda.CfnPermission(this, 'ApiGatewayPermission', {
  functionName: myLambda.functionArn,
  action: 'lambda:InvokeFunction',
  principal: 'apigateway.amazonaws.com',
});
