# Yorkshire 3 Peaks Website

This Mono-Repo will hold all the code related to the website

Additionally READMEs are in the sub directories on what they do and how to develop in them

## Frontend Technology

- language: javascript
- frontend framework: next
- package manager: npm
- node version: Node.js 20
- MaterialUI Web Components

## Backend Technology

Currently using AWS SAM to deploy our backend as IaC

### API

- AWS Lambda
- AWS api gateway

### Database

- AWS DynamoDB

## Hosting service

AWS technology stack

- Amplify
- Cognito
- API Gateway
- Lambda
- DynamoDB

## Deployment

Deployments are setup to auto deploy on merge into main

- Amplify is setup to trigger a build and deploy of the ui
- A github action job is setup to deploy the backend via AWS SAM CLI

### Github Action Runner

In order to make a runner you need follow the instruction for registering a runner for a project from github. We also need a few other prerequisite packages in order for the github job to work (assuming you are working in Ubuntu 24.04 or above):

- unzip
- libgtk2.0-0t64
- libgtk-3-0t64
- libgbm-dev
- libnotify-dev
- libnss3
- libxss1
- libasound2t64
- libxtst6
- xauth
- xvfb
- (might be others that i don't know about yet)

# Development

you will need a few thing in order to get this project running inside the devcontainer

- Docker
- AWS CLI

ask an existing developer for the .env file values

# Hand Over Notes:

to come

<!-- will need to make these once the application is built -->
