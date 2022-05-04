# Hello EKS

Deploy a Hello World Node app to an AWS EKS cluster using Fargate compute.

## Setup

0. Make sure the common VPC and subnet stack in `infrastructure/common` has been deployed.
1. From this folder run `sam deploy`. This will create the EKS cluster and roles and profiles with the required permissions. Save the outputs for the database endpoint and port as these will be needed later.
2. Follow the instructions from AWS to [create a kubeconfig for EKS](https://docs.aws.amazon.com/eks/latest/userguide/create-kubeconfig.html)
3. Follow the instructions from AWS to [set up the AWS Load Balancer Controller](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html)
4. Create a Kubernetes secret for the database endpoint and port from step 1 by running `kubectl create secret generic hello-world-db --from-literal=endpoint='ENDPOINT' --from-literal=port='PORT' -n hello-world`.
5. Deploy the demo app by running `kubectl apply -f hello-world.yaml`
