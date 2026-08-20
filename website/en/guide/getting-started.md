# Getting Started

Run the shortest path — "configure an Agent → chat with it → let it call tools" — in minutes.

## Prerequisites

- **JDK 21+** (required by Spring Boot 3.x)
- **Maven 3.8+**
- An API key from any LLM provider (DeepSeek, Kimi, Qwen, etc.)

## Install

```bash
# Clone the repository
git clone https://github.com/wzl521/agentos.git
cd agentos

# Build (produces a fat JAR — single binary deployment)
mvn clean package -DskipTests

# Artifact: oryxos-boot/target/oryxos.jar
```

## Initialize the Workspace

```bash
java -jar oryxos-boot/target/oryxos.jar init
```

`init` creates a `.oryxos/` workspace in the current directory:

```
.oryxos/
├── profiles/          # Profile configs (one YAML per Agent)
├── memory/            # MEMORY.md long-term memory
├── skills/            # SKILL.md skill descriptions
├── sessions/          # Session history
├── logs/              # Structured logs
├── AGENTS.md          # Project-level agent instructions (Bootstrap)
├── SOUL.md            # Agent persona (Bootstrap)
├── USER.md            # User preferences (Bootstrap)
└── oryxos.db          # SQLite (sessions and audit data)
```

A default Profile is generated at `.oryxos/profiles/default.yaml`.

## Configure an LLM Provider

Edit `.oryxos/profiles/default.yaml`:

```yaml
provider:
  name: deepseek        # provider name
  model: deepseek-chat
  temperature: 0.7
```

API keys never live in Profiles — inject them via environment variables:

```bash
export DEEPSEEK_API_KEY=sk-your-key
```

## Your First Conversation

```bash
java -jar oryxos-boot/target/oryxos.jar chat
```

```text
oryxos> What should I wear in Beijing today?

The Agent calls an HTTP tool to fetch weather data, then suggests
an outfit based on temperature and conditions. The whole process
is automatic: LLM reasoning → tool call → result refill → continue.
```

## Start the HTTP API

```bash
java -jar oryxos-boot/target/oryxos.jar serve
# Default port 8080, Swagger UI at /swagger-ui
```

```bash
# Create a session
curl -X POST http://localhost:8080/api/v1/sessions \
  -H "Content-Type: application/json" \
  -d '{"profileName": "default"}'

# Send a message (use the session id from the response)
curl -X POST http://localhost:8080/api/v1/sessions/{id}/messages \
  -H "Content-Type: application/json" \
  -d '{"content": "Analyze last week's server logs"}'
```

## Next Steps

- Learn the [core concepts](./core-concepts) — Profile, Provider, ReAct, Memory, Tool
- Read the [configuration guide](./configuration) for all Profile YAML fields
- See the [API reference](./api-reference) for all REST endpoints
