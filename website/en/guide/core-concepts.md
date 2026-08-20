# Core Concepts

To understand OryxOS, start with these concepts. The terminology aligns with the de facto standards of the open-source Agent OS world (OpenClaw and Hermes Agent use similar naming).

## Agent and Profile

**Agent**: a concrete intelligent assistant with a job (ops, support, HR), a persona, a task scope, available tools, and bound channels.

**Profile**: the complete configuration of one Agent, expressed as a single YAML file. It contains the system prompt, the bound LLM Provider, the tool list, the bound channels, and referenced Skills.

> One Profile equals one Agent. Agents are configured, not coded.

## Provider

**Provider**: an abstraction over LLM API services. OryxOS supports mainstream models (DeepSeek, Qwen, Kimi, Zhipu, Hunyuan, Doubao, Anthropic, OpenAI) through Spring AI Alibaba connectors.

Agents reference models by provider name and never know which vendor they're calling. Switching models at runtime means zero lock-in — one Agent can use a cheap model for simple tasks and a strong model for complex ones.

## ReAct Loop

**ReAct (Reason + Act)**: the core working mechanism of an Agent — and the most critical piece of code in OryxOS.

```
Receive user message
  → assemble prompt (system prompt + memory + history + tool list)
  → call the LLM
  → tool calls? Execute them, refill results, assemble again
  → no tool calls? Return the final response
```

The loop is capped by a maximum iteration count (default 10) to prevent infinite tool-call loops.

## Three-Layer Memory

| Layer | Content | Core phase |
|-------|---------|------------|
| Session memory | The full history of the current conversation | ✅ SQLite persistence, survives restarts |
| Long-term memory | Preferences, project background, key facts — in MEMORY.md | ✅ Agent reads/writes via save_memory / recall_memory |
| Episodic memory | What was learned during tasks — files changed, decisions made | Extension phase |

After some time with OryxOS, your Agent remembers your preferences — the next conversation needs no re-explaining. This is the core experience that separates an Agent OS from a chatbot.

## Tools and Plugin Tools

**Tool**: an external capability an Agent can invoke. Two categories:

- **Built-in tools**: file I/O (read_file / write_file / list_dir), Shell execution, HTTP requests (http_get / http_post) — all gated by whitelist sandbox checks
- **Plugin tools**: business extensions, three approaches from lowest to highest barrier:

| Approach | Barrier | How |
|----------|---------|-----|
| Zero-code | Lowest | Write one SKILL.md describing intent, reuse community MCP servers; the LLM understands and composes calls itself |
| Light-code | Medium | Write an MCP server in any language to expose your internal systems via MCP |
| Heavy-code | High | Annotate Java methods with @Tool as Spring Beans for deep integration |

The rule: **prefer approach one over two, and two over three.**

## Skill

**Skill**: a reusable instruction template described by a SKILL.md file, compatible with the agentskills.io open standard. A Skill is typically a combination of several tools plus prompt enhancement.

SKILL.md content is injected into the system prompt; the LLM reads it, understands the task, and composes tool calls itself. OryxOS does not parse task steps or run a workflow engine — all logic is delegated to the LLM.

## Session

**Session**: the context container for one user-Agent conversation. Identified by channel + user + profile, holding conversation history, current context, and temporary variables. Persisted in SQLite, surviving restarts.

## Sandbox and Tool Policy

**Sandbox**: isolation for tool execution. The core phase enforces application-level whitelists — path whitelist for file ops, command whitelist for Shell, domain whitelist for HTTP. Docker-level isolation arrives in the extension phase.

**Tool Policy**: allow/deny rules over tools at the Profile level. The core phase already limits available tools via the Profile's `tools` field; full allow/deny policies land in the extension phase.

## Bootstrap Files

**Bootstrap**: context files loaded into the system prompt, with standard names:

- `AGENTS.md` — project-level agent behavior instructions
- `SOUL.md` — agent persona definition
- `USER.md` — user preferences

Bootstrap files are written by users and read-only for OryxOS; MEMORY.md is written by the Agent — its "growth record". Both enter the system prompt, but their sources and lifecycles differ.
