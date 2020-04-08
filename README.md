# Serverless Chaos Engineering Demo

This demo site uses Gunnar Grosch's failure-lambda NPM package (https://github.com/gunnargrosch/failure-lambda) to perform chaos engineering experiments on a serverless environment. More information on installation, configuration and usage at https://github.com/gunnargrosch/serverless-chaos-demo.

## Description

The demo application consists of a simple serverless app containing three different functions behind an API Gateway and a static webpage showing the result of these functions. The functions fetch an url for an image at random from a DynamoDB table. An example can be seen at (https://demo.serverlesschaos.com/). By using the failure-labda NPM package you are able to inject failure to each function and see on the page what happens.

![Serverless Chaos Demo Architecture](client/dist/images/serverless-chaos-demo-architecture.png?raw=true "Serverless Chaos Demo Architecture")

## Videos showing demos

* https://www.youtube.com/watch?v=vKurdrGMFpg
* https://www.youtube.com/watch?v=Cw-JmAJHG-g
* https://www.youtube.com/watch?v=xxogwzUMg7c

## How to install

This is prepared to be installed using the Serverless Framework (https://serverless.com) and the Finch plugin. Make sure to have the Failure Injection Layer installed in your account (https://github.com/adhorn/FailureInjectionLayer) and an S3 bucket dedicated for the static webpage (the plugin will remove all contents before uploading).

1. Clone the repository.
2. Install Serverless Framework (if you don't already have it installed).
```bash
npm install -g serverless
```
3. Deploy the serverless application using Serverless Framework.
```bash
sls deploy --region YOUR_PREFERRED_REGION --stage YOUR_PREFERRED_STAGE
```
4. Create an env.js file in the folder ./client/dist/assets/js/ based on the env.js.template contents (located in the same folder) with the endpoints from sls deploy output.
```bash
//Enter your API Gateway endpoints for each function here
var function1 = "<function1 api gateway endpoint>";
var function2 = "<function2 api gateway endpoint>";
var function3 = "<function3 api gateway endpoint>";
```
5. Deploy the static webpage using Serverless Framework and the Finch plugin.
```bash
sls client deploy --region YOUR_PREFERRED_REGION --stage YOUR_PREFERRED_STAGE
```
6. Create an dynamodb.json file in the root folder based on the dynamodb.json.template contents. Replace YOUR_DYNAMODB_TABLE_NAME with your DynamoDB table name.
```bash
{
    "YOUR_DYNAMODB_TABLE_NAME": [
        {
```
7. Populate the DynamoDB table with data using AWS CLI and the created json file.
```bash
aws dynamodb batch-write-item --request-items file://dynamodb.json
```
8. Try it out!

## Notes

This is still a really early version of the app. Features will be added on a regular basis.

## Changelog

### 2020-02-21 v0.3

* Version for failure-lambda and NodeJS

### 2019-07-16 v0.2

* New UI with more visibility
* AWS X-Ray enabled by default

### 2019-07-10 v0.15

* Variables moved to env.yml (Thanks to Adrian Hornsby)
* Support for the new version of the Failure Injection Layer (Thanks to Adrian Hornsby)

### 2019-07-09 v0.1

* Initial release

## Authors

**Gunnar Grosch** - [GitHub](https://github.com/gunnargrosch) | [Twitter](https://twitter.com/gunnargrosch) | [LinkedIn](https://www.linkedin.com/in/gunnargrosch/)
