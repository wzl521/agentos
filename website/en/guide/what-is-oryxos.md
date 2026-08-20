# What is OryxOS

OryxOS is a **Java-based Agent OS (Agent Operating System) built for enterprise scenarios**.

Deploy it on your own K8s cluster or servers as a unified foundation. On top of it, run all your business Agents — ops assistant, customer service, HR, sales, knowledge management — sharing one set of channel integrations, model routing, tool invocation, memory, and sandbox execution.

**Your data never leaves your infrastructure, and you're never locked into any cloud ecosystem.**

## The Problem It Solves

The bottleneck of enterprise AI Agents today is not model capability — it's the engineering foundation. A single-Agent demo is easy; running Agents in production serving the whole company hits a wall of problems:

- **Where does data live** — core business data must stay on-premises
- **How to integrate with existing systems** — your ERP, CRM, and CMDB are Java
- **How to audit** — who asked which Agent to do what, and when
- **How to govern permissions** — a customer-service Agent must never hold a Shell tool that can `rm -rf`

OryxOS solves exactly this layer. It sinks channel integration, model routing, memory, tools, and sandbox into the foundation — **business teams only write Tools and configure Agents. No Agent backend code, no reinvented wheels.**

For regulated industries (finance, government, telecom, energy, healthcare) this need is rigid: data must stay inside, systems must be fully auditable, new components must pass existing compliance reviews, and the stack must align with the Java ecosystem. OryxOS is designed for exactly that.

## Core Ideas

### Business teams don't write Agent backend code

They do two things:

1. **Write a Tool** that implements a capability (in any language, exposed via MCP)
2. **Configure an Agent** to use it (one Profile YAML)

Agents are configured, not coded. Where messages come from, how LLMs are called, how context resumes, how audit trails are recorded — all handled by OryxOS.

### Core phase ships the runtime kernel

Delivery happens in two phases:

- **Core phase**: build the Agent OS runtime kernel in Java, aligned with the baseline of open-source Agent OS projects
- **Extension phase**: the true differentiators — multi-tenancy, SSO, full audit, Tool governance — land on top

The core phase is the foundation; enterprise governance is the endgame.

## Positioning Among Other Projects

| Project | What it is | Relation to OryxOS |
|---------|-----------|--------------------|
| OpenClaw (Node.js) | Agent OS for individuals / small teams | Same category, different focus; SKILL.md compatible |
| Hermes Agent (Python) | Team-leaning Agent OS | Same category, different focus; SKILL.md compatible |
| Dify, Coze | Visual workflow orchestration platforms | Complementary — can run on top of OryxOS as a client |
| Spring AI, LangChain4j | LLM frameworks | Reused by OryxOS for low-level LLM calls |

One-line positioning: **OryxOS doesn't compete for the orchestration layer above, nor the framework layer below — it owns the middle: the foundation where Agents run permanently, governed and auditable.**

## Four Words

**Unified. Private. Easy to adopt. Observable.**

- **Unified**: multiple business Agents share one foundation
- **Private**: data and deployment fully in your hands
- **Easy to adopt**: standard Spring Boot structure, direct integration with existing systems
- **Observable**: standard Prometheus metrics, structured logs, health checks

## Next Steps

- [Get started](./getting-started) and run your first conversation
- Learn the [core concepts](./core-concepts): Profile, Provider, ReAct, Memory, Tool
- Read the [architecture](./architecture) to understand the four layers and nine modules
