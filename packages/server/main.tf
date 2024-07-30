## WARNING: This configuration file is not yet completed. Use CloudFormation(SAM) Template instead.
## 경고: 이 설정 파일은 완성되지 않았습니다. 대신 CloudFormation(SAM) 설정 파일을 통해 배포하십시오.

terraform {
  required_version = "~> 1.9.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-northeast-2"
}

resource "aws_dynamodb_table" "locker_table" {
  name         = "LockerTable"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "type"
  range_key    = "id"

  attribute {
    name = "type"
    type = "S"
  }

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "lockerId"
    type = "S"
  }

  local_secondary_index {
    name            = "lockerIdIndex"
    projection_type = "INCLUDE"
    non_key_attributes = ["iA", "n", "d", "cU"]
    range_key       = "lockerId"
  }
}

data "aws_iam_policy_document" "front_cloudfront_policy_doc" {
  statement {
    sid    = "PublicReadForGetBucketObjects"
    effect = "Allow"
    principals {
      identifiers = ["*"]
      type = "*"
    }
    actions = ["s3:GetObject"]
    resources = [aws_s3_bucket.front_bucket.arn]
  }
}

resource "aws_s3_bucket" "front_bucket" {
  # Bucket to store client files
  bucket = "front-bucket"
}

resource "aws_s3_bucket_website_configuration" "front_website_configuration" {
  bucket = aws_s3_bucket.front_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_public_access_block" "front_public_access" {
  bucket              = aws_s3_bucket.front_bucket.id
  block_public_policy = false
}

resource "aws_s3_bucket_policy" "front_cloudfront_access" {
  bucket = aws_s3_bucket.front_bucket.id
  policy = data.aws_iam_policy_document.front_cloudfront_policy_doc.json
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

data "aws_iam_policy_document" "dynamodb_crud" {
  statement {
    effect = "Allow"
    resources = [
      aws_dynamodb_table.locker_table.arn,
      "${aws_dynamodb_table.locker_table.arn}/index/",
    ]
    actions = [
      "dynamodb:GetItem",
      "dynamodb:DeleteItem",
      "dynamodb:PutItem",
      "dynamodb:Scan",
      "dynamodb:Query",
      "dynamodb:UpdateItem",
      "dynamodb:BatchWriteItem",
      "dynamodb:BatchGetItem",
      "dynamodb:DescribeTable",
      "dynamodb:ConditionCheckItem"
    ]
  }
}

resource "aws_iam_role" "iam_for_lambda" {
  name               = "iam_for_lambda"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_role_policy" "lambda_dynamodb_crud" {
  name   = "dynamodb_crud"
  role   = aws_iam_role.iam_for_lambda.id
  policy = data.aws_iam_policy_document.dynamodb_crud.json
}

module "lambda_dependencies_layer" {
  source = "terraform-aws-modules/lambda/aws"

  create_layer = true

  layer_name  = "dependencies"
  description = "Node dependencies in lambda functions"
  compatible_runtimes = ["nodejs20.x"]

  source_path = "./dependencies/"
}

module "local_cors_function" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "local-cors-function"
  description   = "CORS Prefetch Function to resolve CORS Block in local environment"
  handler       = "common.localCorsHandler"
  runtime       = "nodejs20.x"
  publish       = true
  source_path   = "./dist"
}

module "auth_login_function" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "auth-login-function"
  description   = "Lambda function for /auth/login endpoint."
  handler       = "handler.auth.loginHandler"
  runtime       = "nodejs20.x"
  publish       = true
  source_path   = "./dist"

  layers = [
    module.lambda_dependencies_layer.lambda_layer_arn
  ]
}