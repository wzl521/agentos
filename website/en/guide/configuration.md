# Configuration

The central configuration abstraction in OryxOS is the **Profile** — the complete configuration of one Agent, expressed as one YAML file.

## Profile Structure

Profiles live in `.oryxos/profiles/`; the file name is the Profile name.

```yaml
name: default                     # Profile name, globally unique
description: Default Agent

identity:                          # Identity section
  agent_name: oryxos               # Agent name
  prompt: You are a helpful AI assistant.  # Persona prompt

provider:                          # LLM Provider section
  name: deepseek                   # provider name (see Provider config below)
  model: deepseek-chat             # model name
  temperature: 0.7                 # temperature

tools:                             # Tools available to this Agent
  - http_get
  - http_post
  - read_file
  - write_file
  - shell

skills:                            # Referenced Skills (SKILL.md)
  - daily-pr-digest

mcp_servers:                       # Referenced MCP servers
  - github-mcp
  - slack-mcp

channels:                          # Bound channels
  - cli

bootstrap:                         # Bootstrap files injected into the system prompt
  - AGENTS.md
  - SOUL.md
  - USER.md

settings:                          # Engine parameters
  max_iterations: 10               # ReAct iteration cap (default 10)
  max_history_turns: 20            # Conversation turns kept (default 20)
```

## Provider Configuration

Provider API keys and base URLs are configured in `application.yaml`, where Spring AI Alibaba creates the ChatModel beans. **Every provider declares a unique provider name**; Profiles reference providers by name.

## API Keys and Secrets

Sensitive configuration is **never hard-coded in Profile YAML** — inject it via environment variables:

```bash
export DEEPSEEK_API_KEY=sk-your-key
export KIMI_API_KEY=sk-your-key
```

Profiles may use `${ENV_VAR}` placeholders, resolved from environment variables at load time. Configuration is validated at startup — required fields and formats are checked, and missing or invalid values produce clear errors.

## MCP Server Configuration

External MCP servers are declared in `.oryxos/mcp_servers.yaml`:

```yaml
mcp_servers:
  - name: github-mcp
    transport: stdio          # stdio or sse
    command: npx
    args: [-y, @modelcontextprotocol/server-github]
    env:
      GITHUB_TOKEN: ${GITHUB_TOKEN}
```

At startup, OryxOS connects to every configured MCP server, calls tools/list to fetch tool lists, wraps each tool as an OryxTool, and registers them in the ToolRegistry. Profiles reference them via the `mcp_servers` field.

## SKILL.md Skill Files

Placed in `.oryxos/skills/`, markdown with frontmatter:

```markdown
---
name: daily-pr-digest
description: Summarize yesterday's GitHub PR review progress and push to Slack
trigger: every morning at 9am
required_tools:
  - github-mcp
  - slack-mcp
---

Task body: fetch all PRs from yesterday, group review progress by
repository, generate a digest, and post it to the #dev-daily channel.
```

OryxOS loads SKILL.md content into the system prompt; the LLM reads it, understands the task, and composes MCP tool calls itself. **Business teams ship new scenarios with zero code.**

## Sandbox Whitelists

Whitelist checks before tool execution, configured in `application.yaml`:

```yaml
oryxos:
  sandbox:
    file:
      allowed-paths:        # File operation path whitelist
        - .oryxos/
        - workspace/
    shell:
      allowed-commands:     # Shell command whitelist
        - ls
        - cat
        - grep
        - date
    http:
      allowed-domains:      # HTTP domain whitelist
        - api.github.com
        - wttr.in
```

Any failed check throws a SandboxViolationException and the tool execution aborts.

## Multiple Profiles Coexist

One OryxOS instance can hold multiple Profiles — multiple Agents living side by side. This is the minimal embodiment of "OS" in the core phase: an ops assistant, a support assistant, and an HR assistant each get a Profile and share one foundation.
