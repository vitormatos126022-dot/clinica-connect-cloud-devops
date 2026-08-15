# Roteiro do Video Pitch - ate 4 minutos

## 0:00 - 0:30 | Problema

Apresentar uma clinica que sofre com agenda manual, controle fraco de insumos e baixa rastreabilidade operacional.

## 0:30 - 1:15 | Solucao

Mostrar a Clinica Connect e explicar os servicos:

- API Gateway.
- Appointments Service.
- Stock Service.
- Notifications Service.
- PostgreSQL.
- Prometheus e Jaeger/OpenTelemetry conceitual.

## 1:15 - 2:00 | Demonstracao local

Rodar:

```bash
docker compose up --build
```

Abrir:

- `http://localhost:3100`
- `http://localhost:3100/supplies`

Criar uma consulta via curl ou Postman.

## 2:00 - 2:45 | Containers e Kubernetes

Mostrar Dockerfile, Compose e manifests Kubernetes. Explicar probes, RollingUpdate, Secrets, ConfigMap e HPA.

## 2:45 - 3:20 | CI/CD

Mostrar o workflow com lint, testes, Compose config, build/push no GHCR e renderizacao com `${GITHUB_SHA}`.

## 3:20 - 3:50 | Observabilidade

Mostrar `/metrics` e logs JSON. Explicar que tracing distribuido esta planejado conceitualmente com Jaeger/OpenTelemetry.

## 3:50 - 4:00 | Fechamento

Concluir que o MVP padroniza ambiente, automatiza validacao, prepara deploy Kubernetes e melhora visibilidade operacional.

