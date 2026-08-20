# Five Core Capabilities

The core phase ships five capabilities that form the body of the Agent OS runtime kernel. Like five gears, they compose into a wide range of real enterprise scenarios.

## Capability 1: LLM Integration

A Provider abstraction that lets Agents call any mainstream LLM — **without knowing which vendor they're calling**.

- Built on Spring AI Alibaba, reusing proven LLM connectors
- One Agent can use different models for different tasks: cheap models for simple jobs, strong models for complex ones
- Plug in on-premises inference (Ollama, vLLM) — data never leaves the enterprise
- Every call records token usage, provider, and model — cost transparency

## Capability 2: ReAct Loop

**The Agent brain.** The LLM reasons (Reason) whether to call a tool and which one; OryxOS executes (Act) it and refills the result; the LLM sees the result and decides the next step. The loop continues until the LLM gives a final response or the iteration cap is hit.

The ReAct loop is the most critical code in OryxOS — roughly dozens of lines of Java, self-implemented rather than borrowed from a framework's Agent abstraction, so implementers fully grasp the mechanism.

With it, an Agent decides autonomously when to call which tool (no hard-coded flows); multi-step tasks finish in one conversation (read a file → analyze → call an API → generate a report); and errors trigger retries or switching tools.

## Capability 3: Three-Layer Memory

Agents remember preferences, projects, decisions, and conversation history.

- **Session memory**: the full current-conversation history, persisted in SQLite, surviving restarts
- **Long-term memory**: preferences and project background in MEMORY.md, actively read and written by the Agent through the built-in `save_memory` / `recall_memory` tools
- **Episodic memory**: what was learned during tasks (extension phase)

The core experience: after some time, your Agent naturally remembers "we use Spring Boot, not Spring MVC" or "our project deploys on K8s" — the next conversation needs no re-explaining.

## Capability 4: Plugin Tool System

Agents manipulate systems through tools. Five built-in tools (file I/O, Shell, HTTP, memory read/write) ship out of the box; business teams extend via three approaches:

| Approach | Description | Best for |
|----------|-------------|----------|
| Zero-code SKILL.md + MCP | One markdown file describing intent, reusing community MCP servers | The fastest path to a new scenario |
| Light-code custom MCP server | Any language, exposed over MCP | Connecting internal systems (ERP, CRM, CMDB) |
| Heavy-code @Tool annotation | Java Spring Beans, called in-process | Deep integration: reuse existing Beans, Spring Security permissions |

Typical scenarios: Prometheus + Grafana + SSH for ops self-healing; GitHub + Jira for dev assistants; business-data APIs for info aggregation.

## Capability 5: Web Service

A REST API exposing all four capabilities — **any business system can use Agents with one HTTP call**. This is what separates OryxOS from personal-assistant projects.

- 10 endpoints in the core phase: session management, stateless Agent invocation, info queries, system status
- Any language that can send HTTP requests can integrate
- One OryxOS instance serves multiple business systems
- Monitoring alerts, webhooks, and scheduled jobs all call Agents through Web Service

## How the Five Relate

The five capabilities are not parallel modules:

```
Provider, Memory, and Tool feed the ReAct loop engine;
the engine's output reaches the world through the CLI and Web Service entrances.
```

- **ReAct loop** is the engine, driving "user message → LLM thinking → tool execution → result refill → continue"
- **Provider** gives the engine LLM calls — needed for every reasoning round
- **Memory** gives the engine context — session history and long-term memory are injected into every prompt
- **Tool** gives the engine execution — the LLM decides which tool, the engine runs it
- **Web Service** is the outward door for all internal capabilities — it doesn't participate in the loop; it's the trigger entrance and result exit
