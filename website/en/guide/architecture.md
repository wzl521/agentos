# Architecture

OryxOS is a **Spring Boot 3.x monolith** running on JDK 21, with LLM calls via Spring AI Alibaba and a self-implemented ReAct loop as the Agent core. The whole system is one executable JAR — single binary deployment.

The stack in one line: **JDK 21 + Spring Boot 3.x + Spring AI Alibaba + self-implemented ReAct loop + SQLite + Picocli CLI.**

![OryxOS Architecture](/architecture.svg)

## Four Layers

Top to bottom:

| Layer | Contents | Responsibility |
|-------|----------|----------------|
| Access | CLI Channel, Web Service REST API | Messages in and out |
| Engine | ReActLoop, PromptBuilder, ToolExecutor | The Agent brain |
| Capability | Provider, Memory, Tool | LLM calls, context, execution |
| Foundation | Profile/Bootstrap/Skill loading, Session storage, SQLite, config & secrets | Engineering groundwork |

## Two Entrances

Only two entrances face the world; both converge on the same engine:

1. **CLI Channel** — local interaction and debugging (`oryxos chat`)
2. **Web Service** — business systems integrate via REST API (`oryxos serve`)

## Nine Maven Modules

| Module | Maps to | Responsibility |
|--------|---------|----------------|
| `oryxos-core` | Engine | ReActLoop, PromptBuilder, ToolExecutor, ContextLoader, OryxTool abstractions. Every module depends on it |
| `oryxos-provider` | Capability 1 | ProviderService, Function Calling adaptation, explicit provider-name mapping |
| `oryxos-memory` | Capability 3 | MemoryService (three-layer facade), LongTermMemory, MemoryTools |
| `oryxos-tool` | Capability 4 | Built-in tools (File/Shell/Http), MCP Client, ToolRegistry, SandboxChecker |
| `oryxos-web` | Capability 5 | WebServer, six ApiControllers, GlobalExceptionHandler, OpenAPI docs |
| `oryxos-channel-cli` | Support | CLI Channel implementation |
| `oryxos-storage` | Support | SQLite layer: sessions, tool_invocations, llm_calls |
| `oryxos-cli` | Support | Picocli entry (12 subcommands) |
| `oryxos-boot` | Support | Spring Boot startup module, fat JAR packaging |

Modules decouple through interfaces — adding a new Channel or Tool means a new module, never touching the core.

## Key Technical Decisions

### Self-implemented ReAct loop

Spring AI handles the low-level work — LLM calls, Function Calling protocol conversion, Provider abstraction. The ReAct loop is written by us, keeping the Agent core fully controllable.

### Spring AI, used halfway

The easiest place to plant a bug. Spring AI ships a complete automatic tool-execution mechanism. OryxOS **does not use it**. We take only two things from Spring AI:

1. Provider abstraction and protocol conversion to each LLM vendor
2. JSON Schema generation from @Tool annotations

Tool dispatch and execution are fully controlled by OryxOS's own ReActLoop + ToolExecutor. Otherwise tools would be invoked twice.

### Synchronous blocking + Virtual Threads

The core phase uses a synchronous blocking execution model, consistent with Spring MVC. One message flows through the ReAct loop, tool calls, and provider calls synchronously to the final response. Combined with Java 21 virtual threads, a single node handles high concurrency without reactive programming.

### Explicit provider-name mapping

With multiple providers, the Spring container holds several ChatModel beans of the same type — type scanning cannot tell DeepSeek from Kimi. OryxOS maintains an explicit provider-name → ChatModel mapping; Profiles reference providers by name.

### Path/Pattern whitelist sandbox

No Java SecurityManager (unavailable on JDK 21). File ops are restricted to allowed paths, Shell to allowed commands, HTTP to allowed domains — validated at the application layer.

## Data Persistence

| Data type | Storage | Notes |
|-----------|---------|-------|
| Sessions, audit data | SQLite (`.oryxos/oryxos.db`) | Three tables: sessions, tool_invocations, llm_calls |
| Profiles, Bootstrap, Memory, Skills | File system (`.oryxos/`) | User-editable, git-trackable |

The audit tables (tool_invocations, llm_calls) are written from the core phase onward — "auditable" is a differentiator, so the data foundation is laid on day one.

Long-term memory uses MEMORY.md with keyword search (the interface reserves an upgrade path to vector search); the core phase skips vector databases to keep single-binary deployment.
