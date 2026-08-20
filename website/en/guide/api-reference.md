# API Reference

OryxOS exposes all capabilities through a REST API. The core phase ships 10 endpoints covering session management, Agent invocation, info queries, and system status.

**Base URL**: `http://localhost:8080/api/v1`

## Endpoint Overview

| Endpoint | Description | Category |
|----------|-------------|----------|
| `POST /sessions` | Create a session | Sessions |
| `POST /sessions/{id}/messages` | Send a message | Sessions |
| `GET /sessions/{id}` | Get session history | Sessions |
| `DELETE /sessions/{id}` | Archive a session | Sessions |
| `POST /agents/{name}/invoke` | Stateless Agent invocation | Agent call |
| `GET /profiles` | List all Profiles | Info queries |
| `GET /memory` | Read long-term memory | Info queries |
| `GET /tools` | List available tools | Info queries |
| `GET /health` | Health check | System status |
| `GET /info` | System info | System status |

## Sessions

### Create a session

```http
POST /api/v1/sessions
Content-Type: application/json
```

```json
{
  "profileName": "default",
  "channel": "web",
  "userId": "user-001"
}
```

The response returns a `sessionId` for subsequent messages.

### Send a message

```http
POST /api/v1/sessions/{id}/messages
Content-Type: application/json
```

```json
{
  "content": "Analyze last week's server logs"
}
```

The message enters the ReAct loop engine: assemble prompt → call the LLM → execute tools as needed → return the final response. Synchronous and blocking, with a 60-second timeout (HTTP 504 on timeout).

### Get session history

```http
GET /api/v1/sessions/{id}
```

Returns up to the last 100 messages.

### Archive a session

```http
DELETE /api/v1/sessions/{id}
```

The session status becomes archived; history remains queryable.

## Agent Invocation

### Stateless invoke

```http
POST /api/v1/agents/{name}/invoke
Content-Type: application/json
```

```json
{
  "content": "What's the weather in Beijing today?",
  "context": {
    "user": "ops-team"
  }
}
```

No session is created — a single call returns the result. Best for stateless short tasks.

## Info Queries

### List Profiles

```http
GET /api/v1/profiles
```

### Read long-term memory

```http
GET /api/v1/memory
```

Returns the MEMORY.md content.

### List available tools

```http
GET /api/v1/tools
```

## System Status

### Health check

```http
GET /api/v1/health
```

```json
{
  "status": "UP",
  "timestamp": "2026-08-20T09:23:37Z"
}
```

### System info

```http
GET /api/v1/info
```

Returns the version, provider list, and other system information.

## Error Code Conventions

Standard HTTP status codes plus internal error codes:

| HTTP status | Meaning |
|-------------|---------|
| 400 | Bad parameters |
| 404 | Resource not found |
| 500 | Internal error |
| 503 | Provider failure |
| 504 | Agent call timeout |

Uniform error response format:

```json
{
  "errorCode": "ORYXOS_4001",
  "message": "profile not found: foo",
  "timestamp": "2026-08-20T09:23:37Z"
}
```

## Limits

- Single message max 32KB
- Session history returns up to the last 100 messages
- Agent calls time out at 60 seconds
- No authentication in the core phase (assumes an internal network); API Key + JWT land in the extension phase
- Synchronous blocking responses in the core phase; SSE streaming lands in the extension phase

## Endpoints Coming in the Extension Phase

Profile show / reload / create / update / delete; Memory append / clear / search; Tool describe and invocation history; LLM call history and token statistics; Webhook triggers; SSE streaming; Prometheus metrics.
