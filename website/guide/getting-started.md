# 快速开始

用几分钟时间跑通「配置一个 Agent → 跟它对话 → 让它调用工具」的最短链路。

## 环境要求

- **JDK 21+**（Spring Boot 3.x 要求）
- **Maven 3.8+**
- 一个 LLM Provider 的 API Key（DeepSeek、Kimi、通义等均可）

## 安装

```bash
# 克隆仓库
git clone https://github.com/wzl521/agentos.git
cd agentos

# 编译打包（生成 fat JAR，单二进制部署）
mvn clean package -DskipTests

# 产物：oryxos-boot/target/oryxos.jar
```

## 初始化工作区

```bash
java -jar oryxos-boot/target/oryxos.jar init
```

`init` 在当前目录创建 `.oryxos/` 工作区：

```
.oryxos/
├── profiles/          # Profile 配置（每个 Agent 一份 YAML）
├── memory/            # MEMORY.md 长期记忆
├── skills/            # SKILL.md 技能描述
├── sessions/          # 会话历史
├── logs/              # 结构化日志
├── AGENTS.md          # 项目级 agent 行为说明（Bootstrap）
├── SOUL.md            # agent 人格定义（Bootstrap）
├── USER.md            # 用户偏好（Bootstrap）
└── oryxos.db          # SQLite（会话与审计数据）
```

同时生成一份默认 Profile：`.oryxos/profiles/default.yaml`。

## 配置 LLM Provider

编辑 `.oryxos/profiles/default.yaml`：

```yaml
provider:
  name: deepseek        # provider 名
  model: deepseek-chat
  temperature: 0.7
```

API Key 不写进 Profile，通过环境变量注入：

```bash
export DEEPSEEK_API_KEY=sk-your-key
```

## 第一次对话

```bash
java -jar oryxos-boot/target/oryxos.jar chat
```

```text
oryxos> 查一下北京今天的天气，告诉我穿什么合适

Agent 通过 ReAct 循环调用 HTTP Tool 获取天气数据，
根据温度和天气状况给出穿衣建议。
整个过程自动完成：LLM 推理 → Tool 调用 → 结果回填 → 继续推理。
```

## 启动 HTTP API 服务

```bash
java -jar oryxos-boot/target/oryxos.jar serve
# 默认端口 8080，Swagger UI 在 /swagger-ui
```

```bash
# 创建会话
curl -X POST http://localhost:8080/api/v1/sessions \
  -H "Content-Type: application/json" \
  -d '{"profileName": "default"}'

# 发消息（使用上一步返回的 session id）
curl -X POST http://localhost:8080/api/v1/sessions/{id}/messages \
  -H "Content-Type: application/json" \
  -d '{"content": "帮我分析一下最近一周的服务器日志"}'
```

## 下一步

- 了解[核心概念](./core-concepts)，理解 Profile、Provider、ReAct 这些术语
- 看[配置指南](./configuration)掌握 Profile YAML 的全部字段
- 看 [API 参考](./api-reference)了解全部 REST 端点
