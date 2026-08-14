terraform {
  required_version = ">= 1.6.0"
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "cluster_name" {
  type    = string
  default = "clinica-connect-cluster"
}

# Esqueleto independente de provedor para demonstrar IaC.
# Em ambiente real, estes blocos seriam substituidos por modulos de rede, cluster Kubernetes e registry.
output "environment" {
  value = var.environment
}

output "cluster_name" {
  value = var.cluster_name
}
