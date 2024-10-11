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

using AWS SAM (serverless application model) so we can have all resourced used stored as code

### API

- AWS Lambda
- AWS api gateway

### Database

- AWS DynamoDB

## Hosting service

AWS

- Amplify (Pay as you go) (used to host the website)
- Cognito (free teir) (used to authenticate the users)
- API Gateway (free teir) (used to expose the lamda function via a http call)
- Lamda (free tier) (used to perform actions with teh DB)
- DynamoDB (free teir) (used to store the nessassary data for the website)

## Deployment

- Deployments are setup to auto deploy on merge into main

# Hand Over Notes:

to come

<!-- will need to make these once the application is built -->
