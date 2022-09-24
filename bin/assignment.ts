#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AssStack } from '../lib/assignment-stack';

const app = new cdk.App();
new AssStack(app, 'AssStack');
