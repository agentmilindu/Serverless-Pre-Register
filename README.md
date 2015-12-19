#Serverless Pre-Register

A simple, ready to deploy Pre-registration page for your product. We are using the serverless architecture, that is AWS Lambda as the backend with DynamoDB as the database server, AWS API Gateway to manage the API. Deploy your Lambdas to the cloud with couple of simple commands using  Serverless( formerly JAWS, http://www.serverless.com ) application framework.

We are serverless and are not running any servers on EC2, this way, you don't have to pay for anything unless you get someone get registered! Know more about [AWS Lambda](https://aws.amazon.com/documentation/lambda/) and AWS Lambda [pricing]( https://aws.amazon.com/lambda/pricing/)

##Prerequisites
1. Create an AWS account and and create an IAM user with nessasary privilages.
2. Generate an access key and have it in hand.
3. Install [Serverless](http://www.serverless.com) npm package. 

##How to use

1. Fork the repo and clone to your local environment. 
2. Change directory into `Serverless-Pre-Register`.
3. Issue the command `$ serverless stage create`, this will create an stage in AWS for our API. ( You might me promt for access keys)
4. Issue command `$ serverless function deploy`, this will deploy the functions to AWS Lambda.
5. Issue commands `$ serverless endpoint deploy`, this will deploy the API on AWS API Gateway, and it will pormpt you the API endpoint, copy that URL.
5. Edit the configs.json file on `front` folder and set the copied URL as "endpointURL".
6. Upload the files in `front` folder to S3 bucket.
