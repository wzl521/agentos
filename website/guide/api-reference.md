# API 参考

OryxOS 通过 REST API 对外暴露所有能力。核心阶段 10 个端点，覆盖会话管理、Agent 调用、信息查询、系统状态。

**Base URL**：`http://localhost:8080/api/v1`

## 端点总览

| 端点 | 说明 | 分类 |
|------|------|------|
| `POST /sessions` | 创建会话 | 会话管理 |
| `POST /sessions/{id}/messages` | 发消息 | 会话管理 |
| `GET /sessions/{id}` | 查询会话历史 | 会话管理 |
| `DELETE /sessions/{id}` | 归档会话 | 会话管理 |
| `POST /agents/{name}/invoke` | Agent 无状态调用 | Agent 调用 |
| `GET /profiles` | 列出所有 Profile | 信息查询 |
| `GET /memory` | 查询长期记忆 | 信息查询 |
| `GET /tools` | 列出可用 Tool | 信息查询 |
| `GET /health` | 健康检查 | 系统状态 |
| `GET /info` | 系统信息 | 系统状态 |

## 会话管理

### 创建会话

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

响应返回 `sessionId`，后续发消息用。

### 发消息

```http
POST /api/v1/sessions/{id}/messages
Content-Type: application/json
```

```json
{
  "content": "帮我分析一下最近一周的服务器日志"
}
```

消息进入 ReAct 循环引擎：组装 Prompt → 调用 LLM → 按需执行 Tool → 返回最终响应。同步阻塞，最长 60 秒超时（超时返回 504）。

### 查询会话历史

```http
GET /api/v1/sessions/{id}
```

返回最近 100 条消息。

### 归档会话

```http
DELETE /api/v1/sessions/{id}
```

归档后 Session 状态变为 archived，历史保留可查。

## Agent 调用

### 无状态调用

```http
POST /api/v1/agents/{name}/invoke
Content-Type: application/json
```

```json
{
  "content": "查一下北京今天的天气",
  "context": {
    "user": "ops-team"
  }
}
```

不创建 Session，单次调用返回结果。适合 stateless 短任务。

## 信息查询

### 列出 Profile

```http
GET /api/v1/profiles
```

### 查询长期记忆

```http
GET /api/v1/memory
```

返回 MEMORY.md 内容。

### 列出可用 Tool

```http
GET /api/v1/tools
```

## 系统状态

### 健康检查

```http
GET /api/v1/health
```

```json
{
  "status": "UP",
  "timestamp": "2026-08-20T09:23:37Z"
}
```

### 系统信息

```http
GET /api/v1/info
```

返回版本、Provider 列表等系统信息。

## 错误码规范

标准 HTTP 状态码加内部错误码：

| HTTP 状态码 | 含义 |
|------------|------|
| 400 | 参数错误 |
| 404 | 资源不存在 |
| 500 | 内部错误 |
| 503 | Provider 故障 |
| 504 | Agent 调用超时 |

统一错误响应格式：

```json
{
  "errorCode": "ORYXOS_4001",
  "message": "profile not found: foo",
  "timestamp": "2026-08-20T09:23:37Z"
}
```

## 限制

- 单条消息最大 32KB
- Session 历史返回最多最近 100 条
- Agent 调用最长 60 秒
- 核心阶段无认证（假设内网部署），扩展阶段补 API Key + JWT
- 核心阶段同步阻塞返回，扩展阶段补 SSE 流式响应

## 扩展阶段补齐的端点

Profile 的 show / reload / create / update / delete；Memory 的 append / clear / search；Tool describe 和调用历史；LLM call 历史和 token 统计；Webhook 触发；SSE 流式响应；Prometheus metrics。
