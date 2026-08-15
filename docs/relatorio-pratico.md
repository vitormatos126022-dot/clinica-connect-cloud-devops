# Relatorio Pratico - Clinica Connect

## 1. Visao geral do MVP

O MVP implementa uma plataforma de agendamentos clinicos baseada em microsservicos. A solucao inclui API Gateway, Appointments Service, Stock Service, Notifications Service, PostgreSQL, Prometheus, Jaeger, Docker Compose, Kubernetes, GitHub Actions, ESLint, testes automatizados e Terraform.

## 2. Ambiente local

O ambiente local usa Compose sem `container_name` fixo, reduzindo conflitos com containers antigos. Para limpar orfaos antes de subir:

```bash
docker compose down --remove-orphans
docker compose up --build
```

Portas principais:

- API Gateway: 3100.
- Appointments Service: 3101.
- Stock Service: 3102.
- Notifications Service: 3103.
- PostgreSQL: 5543.
- Prometheus: 9190.
- Jaeger: 16687.

## 3. Conteinerizacao

O Dockerfile usa multi-stage build. A etapa de dependencias instala apenas pacotes de producao com `npm ci --omit=dev`; a etapa final copia `node_modules`, `package*.json` e `src`. A imagem roda com usuario nao-root.

## 4. Kubernetes

Os manifests em `k8s/` declaram namespace, ConfigMap, Secret, PostgreSQL, Deployments, Services e HPA. Os servicos possuem readiness/liveness probes em `/health`, requests/limits e estrategia RollingUpdate.

No CD, os manifests sao renderizados para usar `${GITHUB_SHA}`, garantindo que o cluster receba as imagens criadas no commit atual.

## 5. CI/CD

O workflow possui tres jobs:

- `test`: instala dependencias, roda lint, testes, valida Compose, valida manifests Kubernetes em modo client-side e executa `terraform validate`.
- `publish`: publica imagens no GHCR com `${GITHUB_SHA}` e `latest`.
- `deploy`: roda apenas com `ENABLE_K8S_DEPLOY=true`; renderiza manifests e aplica no Kubernetes.

Esse desenho evita deploy sem verificacao, cobre Compose/Kubernetes/Terraform no CI e impede falha de producao quando nao ha cluster configurado no GitHub. A validacao Kubernetes usa `kubectl apply --dry-run=client --validate=false`, portanto nao depende de cluster ativo.

## 6. Terraform

O Terraform e validado no GitHub Actions com `hashicorp/setup-terraform`, `terraform init -backend=false` e `terraform validate`. Assim, a validacao nao depende de Terraform instalado no Windows local.

## 7. Observabilidade

Todos os servicos expoem `/health` e `/metrics`. Os logs sao JSON e incluem `service`, `requestId`, metodo, rota, status e duracao. Prometheus coleta metricas. Jaeger/OpenTelemetry ficam como desenho conceitual de tracing distribuido.

## 8. Case comparado: Sock Shop

Sock Shop e uma demonstracao de microsservicos para loja online, usada para testar tecnologias cloud-native. A Clinica Connect usa os mesmos fundamentos, mas em um contexto clinico. A comparacao mostra que a tecnica pode ser aplicada em dominios diferentes: varejo, saude, logistica ou educacao.

Fonte: https://github.com/microservices-demo/microservices-demo

## 9. Como demonstrar

1. Rodar `npm run lint`.
2. Rodar `npm test`.
3. Rodar `docker compose down --remove-orphans`.
4. Rodar `docker compose up --build`.
5. Abrir `http://localhost:3100`.
6. Listar insumos em `/supplies`.
7. Criar agendamento com `POST /appointments`.
8. Mostrar Prometheus em `http://localhost:9190`.
9. Explicar Kubernetes, CI/CD e Terraform.
