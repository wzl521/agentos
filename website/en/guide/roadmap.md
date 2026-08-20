# Roadmap

OryxOS evolves in three phases: a 4-week core phase ships a demoable runtime kernel, the extension phase completes the enterprise governance layer, and community contributions drive the ecosystem and long tail.

## Core Phase (4 Weeks)

| Week | Capabilities | Demoable outcome |
|------|--------------|------------------|
| Week 1 | LLM + ReAct loop | Multi-turn chat; the Agent calls an HTTP tool to finish a simple task |
| Week 2 | Memory + Tool system | The Agent remembers preferences; file I/O and external MCP tools |
| Week 3 | Web Service | Complete call chain through 10 REST endpoints |
| Week 4 | Multi-Agent + polish | Multiple Agents coexist; sessions survive restarts; website live |

At the end of the core phase, **OryxOS 1.0 is a demoable, minimal-yet-complete Agent OS runtime kernel** — all five capabilities running, with Agent configuration, CLI chat, multi-Agent coexistence, REST API integration, and MCP tool ecosystem connectivity.

## Extension Phase

### Channels and models

- **Multi-channel**: WeCom, Feishu, DingTalk, Slack, email
- **Provider fallback**: hedge racing, circuit breakers, automatic failover
- **Adaptive routing**: dynamic model selection by task type, historical quality, and current load

### Memory and capability

- **Automatic memory extraction**: extract durable facts at conversation end
- **Semantic search**: vector database integration, similarity-based recall
- **Episodic memory**: files changed, decisions made during tasks
- **Full Skill system**: complete SKILL.md support, community skill reuse

### Tools and security

- **MCP Server exposure**: OryxOS itself as an MCP server
- **Tool Policy**: Profile-level allow/deny rules (a priority — a customer-service Agent must never hold a Shell tool that can `rm -rf`)
- **Complete sandbox**: Docker, K8s pod, WebAssembly isolation

### Governance and operations (the core differentiator)

- **SSO and multi-tenancy**: SAML, OIDC, three-tier tenant model, RBAC down to Agent/Tool/Skill granularity
- **Full audit**: audit events, trace-ID correlation, SIEM export
- **Web dashboard**: Profile management, session inspection, audit log queries
- **HA clustering**: multi-node coordination, automatic failover

### Enterprise integration

- **Enterprise IT connectors**: ready-made connectors for ERP (Yonyou, Kingdee, SAP), CRM, CMDB, and monitoring systems

## Community

- **Skills Marketplace**: a community-contributed Skill sharing platform, agentskills.io compatible
- **Multi-language SDKs**: Java, Python, TypeScript, Go
- **Visual Profile editor**: configure Agents without engineering
- **Kubernetes Operator**: one-click deployment, GitOps workflows
- **Mobile console**: check cluster status and handle alerts from your phone
- **Voice Channel**: wake word and continuous voice conversation
- **RISC-V and edge deployment**: Raspberry Pi, edge gateways
