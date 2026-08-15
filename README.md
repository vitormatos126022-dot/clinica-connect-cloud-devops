# Clinica Connect - Cloud DevOps MVP

MVP cloud-native para uma plataforma de agendamentos clinicos. O projeto demonstra microsservicos, Docker Compose, Kubernetes, CI/CD com lint e testes, observabilidade com metricas/logs e esqueleto de infraestrutura como codigo.

## Arquitetura

- API Gateway: entrada HTTP unica para clientes.
- Appointments Service: cria e lista agendamentos clinicos.
- Stock Service: lista e reserva insumos medicos.
- Notifications Service: simula envio de notificacoes para pacientes.
- PostgreSQL: banco transacional para consultas e estoque.
- Prometheus: coleta metricas expostas em `/metrics`.
- Jaeger/OpenTelemetry: tracing distribuido definido conceitualmente para evolucao.

## Como Executar Localmente

1. Instale as dependencias:

```bash
npm install
```

2. Suba os servicos:

```bash
docker compose down --remove-orphans
docker compose up --build
```

3. Acesse:

- API Gateway: `http://localhost:3100`
- Insumos: `http://localhost:3100/supplies`
- Agendamentos: `http://localhost:3100/appointments`
- Prometheus: `http://localhost:9190`
- Jaeger: `http://localhost:16687`

## Exemplo de Agendamento

Liste os insumos:

```bash
curl http://localhost:3100/supplies
```

Crie uma consulta usando um `supplyId` retornado:

```bash
curl -X POST http://localhost:3100/appointments \
  -H "Content-Type: application/json" \
  -d "{\"patientName\":\"Victor\",\"specialty\":\"Cardiologia\",\"scheduledAt\":\"2026-09-01T14:00:00Z\",\"supplyId\":\"COLE_AQUI_O_ID\",\"supplyQuantity\":1}"
```

## Scripts

```bash
npm run lint
npm test
npm run start:gateway
npm run start:appointments
npm run start:stock
npm run start:notifications
```

O script de testes usa `node tests/index.test.js`, sem `--test-isolation=none`, para manter compatibilidade com Node.js 20 no GitHub Actions.

## Kubernetes

Os manifests ficam em `k8s/`. Para validacao local sem cluster ativo, use `kubectl apply --dry-run=client --validate=false -f k8s/`; para deploy real, e necessario um cluster configurado:

```bash
kubectl apply -f k8s/
```

No pipeline, os manifests sao renderizados antes do deploy para substituir a tag base `1.0.0` pela tag do commit atual (`${GITHUB_SHA}`). Assim, os Deployments usam exatamente as imagens publicadas naquele build.

## CI/CD

O workflow `.github/workflows/ci-cd.yml` executa:

- instalacao com `npm ci`;
- lint com ESLint;
- testes automatizados em Node.js 20;
- validacao do Docker Compose;
- validacao client-side dos manifests Kubernetes sem exigir cluster ativo;
- validacao Terraform no GitHub Actions com `hashicorp/setup-terraform`;
- build e publicacao das imagens no GHCR com `${GITHUB_SHA}` e `latest`;
- deploy em Kubernetes apenas quando `ENABLE_K8S_DEPLOY=true` e `KUBE_CONFIG` estiver configurado.

## Case Oficial Comparado

O projeto usa como referencia o case Sock Shop (`microservices-demo/microservices-demo`), uma aplicacao de loja online em microsservicos usada para demonstrar tecnologias cloud-native. A Clinica Connect aplica a mesma ideia de servicos pequenos e independentes, mas em outro dominio: agendamentos clinicos, estoque de insumos e notificacoes.

## Terraform

O diretorio `terraform/` e validado no pipeline com `terraform init -backend=false` e `terraform validate`, portanto o CI nao depende de Terraform instalado no Windows local. Para validar manualmente no computador, instale o Terraform CLI antes de executar esses comandos.

## Observabilidade

Metricas Prometheus e logs JSON com `requestId` estao implementados no codigo. O tracing distribuido nao esta totalmente implementado: Jaeger/OpenTelemetry estao definidos como proposta conceitual de evolucao.

## Fontes Oficiais

- Kubernetes: https://kubernetes.io/docs/
- Docker: https://docs.docker.com/
- GitHub Actions: https://docs.github.com/actions
- Terraform: https://developer.hashicorp.com/terraform/docs
- OpenTelemetry: https://opentelemetry.io/docs/
- Sock Shop: https://github.com/microservices-demo/microservices-demo
- 12-Factor App: https://12factor.net/
