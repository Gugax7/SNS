# SNS

Resumo do Projeto: Clone SNS
Duração: 3 semanas

Stack: Node.js + Express

Foco: Backend (sem interface)

# 🗓️ SEMANA 1: Fundamentos e Arquitetura Base
Sessão 1 (2h30min) | Objetivo: Setup e implementação do core do sistema

Setup do Projeto (30min)
[x] Inicializar projeto Node.js

[x] Instalar dependências: express, uuid, dotenv

[x] Estruturar pastas: /src/models, /src/services, /src/routes, /src/utils

[!] Configurar ESLint/Prettier (opcional)

Implementar Topics (60min)
[x] Criar modelo de Topic (nome, ARN, atributos)

[x] Implementar serviço createTopic(name, attributes)

[x] Implementar serviço deleteTopic(topicArn)

[x] Implementar serviço listTopics()

[x] Implementar serviço getTopicAttributes(topicArn)

[x] Criar endpoints REST para topics

Implementar Subscriptions Básicas (60min)
[!] Criar modelo de Subscription (protocol, endpoint, topicArn)

[x] Implementar serviço subscribe(topicArn, clientInfo)

[x] Implementar serviço unsubscribe(topicArn, clientUrl)

[x] Implementar serviço listSubscriptions(topicArn)

[x] Suportar protocolos: http, https, console (para debug)

Entregável: API REST básica com CRUD de Topics e Subscriptions

# 🗓️ SEMANA 2: Publish e Subscription Filters
Sessão 2 (2h30min) | Objetivo: Sistema de publicação e filtros

Sistema de Publish (60min)
[x] Implementar publish(topicArn, message, attributes)

[x] Criar sistema de entrega de mensagens

[x] Implementar retry logic básico

[x] Adicionar logging de mensagens

Subscription Filters (60min)
[x] Implementar FilterPolicy (JSON-based)

[x] Validador de filtros: Exact matching

[x] Validador de filtros: Anything-but matching

[x] Validador de filtros: Numeric matching (greater than, less than, between)

[x] Validador de filtros: Prefix matching

[x] Aplicar filtros antes de entregar mensagens

Scripts de Cliente (30min)
[x] Criar script subscriber-http.js (servidor HTTP simples)

[x] Criar script subscriber-console.js (loga no console)

[x] Criar script publisher.js (publica mensagens)

Entregável: Sistema completo de publish/subscribe com filtros funcionando

# 🗓️ SEMANA 3: Melhorias e Testes
Sessão 3 (2h30min) | Objetivo: Refinamento e funcionalidades avançadas

Dead Letter Queue (DLQ) Simulado (45min)
[x] Implementar armazenamento de mensagens com falha

[x] Criar Endpoint para consultar DLQ

[x] Configurar max retries por subscription

Message Attributes e Deduplication (45min)
[x] Suportar Message Attributes no publish

[ ] Implementar deduplicação básica (MessageDeduplicationId)

[ ] Adicionar MessageGroupId para FIFO (simulado)






Testes e Cenários Práticos (60min)
[ ] Criar cenário: Múltiplos subscribers no mesmo topic

[ ] Criar cenário: Filtros diferentes por subscriber

[ ] Criar cenário: Simulação de falhas de entrega

[ ] Testar com 3 ou mais terminais simultâneos

[ ] Documentar exemplos de uso

Entregável: Sistema robusto e testado com cenários reais