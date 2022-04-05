# Fargate demo

Deploy a Hello World Node app as a container on ECS / Fargate.

## Getting AWS credentials

At time of writing our new AWS account isn't in gds-cli yet so we have to do a bit of fiddling to get CLI credentials.

```bash
aws-vault exec gds-users -- aws sts assume-role --role-arn arn:aws:iam::626456592666:role/FIRST_NAME.LAST_NAME-admin --role-session-name test --region eu-west-2 --serial-number arn:aws:iam::622626885786:mfa/FIRST_NAME.LAST_NAME@digital.cabinet-office.gov.uk --token-code YOUR_MFA_CODE_HERE
```

will print out the credentials (replacing `FIRST_NAME` and `LAST_NAME` with your details).

```bash
export $(printf "AWS_ACCESS_KEY_ID=%s AWS_SECRET_ACCESS_KEY=%s AWS_SESSION_TOKEN=%s" \
$(aws-vault exec gds-users -- aws sts assume-role \
--role-arn arn:aws:iam::626456592666:role/FIRST_NAME.LAST_NAME-admin \
--role-session-name test \
--region eu-west-2 \
--serial-number arn:aws:iam::622626885786:mfa/FIRST_NAME.LAST_NAME@digital.cabinet-office.gov.uk \
--token-code YOUR_MFA_CODE_HERE \
--query "Credentials.[AccessKeyId,SecretAccessKey,SessionToken]" \
--output text))
```

Sets these as environment variables for the shell session so you can then run commands with no prefixes eg. `aws s3 ls`
From https://stackoverflow.com/questions/63241009/aws-sts-assume-role-in-one-command

## Deploy

```bash
sam deploy
```

## Teardown

```bash
sam delete
```
