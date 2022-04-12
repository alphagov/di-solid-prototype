# Fargate demo

Deploy a Hello World Node app as a container on ECS / Fargate.

## Getting AWS credentials

Make sure you have at least version 5.22.0 of `gds-cli`. 

```bash
gds-cli --version
```

If not, `brew upgrade gds-cli` will fetch it. 

You can then prefix AWS CLI commands with `gds aws di-solid-prototype --` to fetch and inject credentials. Eg.

```bash
gds aws di-solid-prototype -- aws s3 ls
```

## Deploy

This stack depends on a common stack in the same region that defines and exports a VPC and two subnets in different 
availability zones. You must deploy the stack at `infrastructure/common` before trying to deploy this one.

```bash
gds aws di-solid-prototype -- sam deploy
```

## Teardown

```bash
gds aws di-solid-prototype -- sam delete
```
