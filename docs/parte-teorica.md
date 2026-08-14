# Parte Teorica - Clinica Connect

## 1. Microservicos e contexto DevOps

A Clinica Connect foi desenhada como um MVP de agendamentos clinicos baseado em microsservicos. A solucao separa entrada HTTP, agendamentos, estoque de insumos e notificacoes. Essa divisao reduz acoplamento e permite evoluir cada capacidade de negocio de forma independente.

DevOps e importante porque sistemas distribuidos exigem padronizacao de ambiente, automacao de testes, build reproduzivel, publicacao de imagens e observabilidade. O projeto usa Docker Compose para ambiente local, Kubernetes para orquestracao, GitHub Actions para CI/CD e Prometheus/logs JSON para diagnostico operacional. Tracing fica planejado conceitualmente com Jaeger/OpenTelemetry.

## 2. Containers e Kubernetes

Docker empacota a aplicacao com runtime e dependencias. Isso evita diferencas entre a maquina do desenvolvedor e o pipeline. Docker Compose sobe API Gateway, servicos internos, PostgreSQL, Prometheus e Jaeger em uma rede local unica.

Kubernetes representa a etapa de producao minima. Os manifests declaram Deployments, Services, ConfigMap, Secret, probes e HPA. Readiness probe evita trafego em pods ainda indisponiveis, enquanto liveness probe ajuda a reiniciar containers travados.

## 3. CI/CD

O pipeline instala dependencias com `npm ci`, roda ESLint, executa testes, valida Docker Compose, constroi imagens e publica no GitHub Container Registry. As imagens recebem a tag `${GITHUB_SHA}` para rastrear exatamente qual commit gerou cada artefato.

O deploy Kubernetes e condicional. Ele roda apenas quando `ENABLE_K8S_DEPLOY=true` e `KUBE_CONFIG` esta configurado. Antes do `kubectl apply`, o workflow renderiza os manifests e troca a tag `1.0.0` pela tag `${GITHUB_SHA}`.

## 4. Observabilidade

Metricas indicam volume de requisicoes e erros por servico. Logs estruturados permitem correlacionar chamadas pelo `requestId`. Esses dois itens estao implementados no codigo. O tracing distribuido nao esta completo no MVP; Jaeger e OpenTelemetry aparecem como caminho conceitual para evolucao futura.

## 5. Case oficial: Sock Shop

O case `microservices-demo/microservices-demo`, conhecido como Sock Shop, e uma aplicacao de loja online criada para demonstrar e testar tecnologias de microsservicos e cloud-native. Ela possui servicos como catalogo, carrinho, pedidos, pagamento, usuario e front-end, empacotados em containers.

A Clinica Connect segue o mesmo principio arquitetural, mas troca o e-commerce por fluxo clinico. Em vez de catalogo/carrinho/pagamento, usa agendamentos/estoque/notificacoes. Essa mudanca torna o trabalho diferente em dominio e narrativa, mantendo os mesmos fundamentos de DevOps.

## 6. Decisoes arquiteturais

O API Gateway centraliza a entrada e simplifica o consumo externo. O Appointments Service coordena o fluxo principal: cria consulta, reserva insumo quando necessario e aciona notificacao. O Stock Service protege o estoque por transacao no PostgreSQL. O Notifications Service e um mock stateless, adequado para MVP.

PostgreSQL foi escolhido por dados transacionais. RollingUpdate reduz risco de deploy. HPA foi aplicado nos servicos HTTP principais. Terraform aparece como esqueleto para demonstrar como rede, cluster e registry seriam reproduzidos em um provedor real.

## Fontes

- Kubernetes: https://kubernetes.io/docs/
- Docker: https://docs.docker.com/
- GitHub Actions: https://docs.github.com/actions
- Publicacao de imagens Docker: https://docs.github.com/en/actions/tutorials/publish-packages/publish-docker-images
- Sock Shop: https://github.com/microservices-demo/microservices-demo
- Terraform: https://developer.hashicorp.com/terraform/language
- OpenTelemetry: https://opentelemetry.io/docs/
- 12-Factor App: https://12factor.net/
