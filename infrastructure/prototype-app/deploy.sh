#!/bin/bash
set -euxo pipefail

tag=$(git rev-parse --short HEAD)

ecr_registry=626456592666.dkr.ecr.eu-west-2.amazonaws.com
ecr_repository=solid-prototype-app

docker build -t $ecr_registry/$ecr_repository:$tag ../../
aws ecr get-login-password --region eu-west-2 | docker login --username AWS --password-stdin $ecr_registry
docker push $ecr_registry/$ecr_repository:$tag
sam deploy --parameter-overrides ParameterKey=ImageTag,ParameterValue=$tag --confirm-changeset
