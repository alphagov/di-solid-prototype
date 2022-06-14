# Steps to create a new cluster

1. Deploy cloud formation
2. Whoever applied the CF has to run `kubectl edit -n kube-system configmap/aws-auth` and add the other peoples' roles to `system:masters`
3. Follow the steps in [[1]] to set up the load balancer controller
4. Follow the steps in [[3]] to set up the cluster's OIDC provider
5. Update the pod execution role in cloudformation with the reference to the cluster's OIDC provider and re deploy
4. Follow the steps in [[2]] to set up external DNS
5. Follow the steps in [[4]] to set up logging to CloudWatch


[1]: https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html
[2]: https://aws.amazon.com/premiumsupport/knowledge-center/eks-set-up-externaldns/
[3]: https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html 
[4]: https://docs.aws.amazon.com/eks/latest/userguide/fargate-logging.html

## Updating the k8s version of an existing cluster

Follow the instructions in [Amazon's documentation](https://docs.aws.amazon.com/eks/latest/userguide/update-cluster.html) 
to update the Kubernetes version on the control plane. 

There's a warning *"Make sure that the kubelet on your managed and Fargate nodes are at the same Kubernetes version as your control plane before you update"*.
I think this is fine - all our nodes are on Fargate so they'll have the correct version of `kubelet`.

Then, restart all the deployments to force the creation of new nodes.

```
ks rollout restart deployment hello-world-deployment --namespace hello-world
ks rollout restart deployment aws-load-balancer-controller --namespace kube-system
ks rollout restart deployment coredns --namespace kube-system
ks rollout restart deployment nginx --namespace ess
ks rollout restart deployment external-dns --namespace ess
```
