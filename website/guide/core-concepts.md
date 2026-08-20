# 核心概念

理解 OryxOS，先理解这几个核心概念。这套术语对齐业界开源 Agent OS 的事实标准（OpenClaw、Hermes Agent 都用类似命名）。

## Agent 与 Profile

**Agent（智能体）**：一个具象的智能体，有具体的工种（运维、客服、HR 等）、人格设定、任务范围、可用工具、绑定渠道。

**Profile（配置）**：一个 Agent 的完整配置，一份 YAML 文件。包含系统提示词、绑定的 LLM Provider、可用 Tool 列表、绑定的 Channel、引用的 Skill。

> 一个 Profile 对应一个 Agent。Agent 是配置出来的，不是写代码写出来的。

## Provider

**Provider（供应商）**：LLM API 服务的抽象。OryxOS 通过 Spring AI Alibaba 的 connector 支持主流大模型（DeepSeek、通义、Kimi、智谱、混元、豆包、Anthropic、OpenAI 等）。

Agent 通过 provider 名引用模型，不感知具体调的是哪家。运行时切换模型无 lock-in——同一个 Agent 简单任务走便宜模型、复杂任务走强模型。

## ReAct 循环

**ReAct（Reason + Act）**：Agent 的核心工作机制，也是 OryxOS 最关键的一段代码。

```
接到用户消息
  → 组装 Prompt（system prompt + Memory + 对话历史 + Tool 列表）
  → 调用 LLM
  → 有 Tool 调用？执行 Tool，结果回填，回到组装 Prompt
  → 没有 Tool 调用？返回最终响应
```

循环有最大迭代次数限制（默认 10 次），防止 Agent 陷入死循环。

## Memory 三层记忆

| 层 | 内容 | 核心阶段 |
|----|------|---------|
| 会话记忆 | 当前对话的完整历史 | ✅ SQLite 持久化，重启可恢复 |
| 长期记忆 | 用户偏好、项目背景、关键事实，存在 MEMORY.md | ✅ Agent 通过 save_memory / recall_memory 读写 |
| 情景记忆 | 任务过程中学了什么、改了什么文件、做了什么决策 | 扩展阶段 |

Agent 用一段时间后，会自然记住你的偏好——下一次对话不需要重新解释。这是 Agent OS 区别于 chatbot 的核心体验。

## Tool 与 Plugin Tool

**Tool（工具）**：Agent 可以调用的外部能力。分两类：

- **内置 Tool**：OryxOS 自带——文件读写（read_file / write_file / list_dir）、Shell 执行、HTTP 请求（http_get / http_post），全部带白名单沙箱检查
- **Plugin Tool**：业务方扩展，三种方式按门槛从低到高：

| 方式 | 门槛 | 做法 |
|------|------|------|
| 零代码 | 最低 | 写一份 SKILL.md 描述意图，复用社区现成的 MCP server，LLM 自己理解并组合调用 |
| 轻代码 | 中 | 用任何语言写 MCP server，通过 MCP 协议接入企业自有系统 |
| 重代码 | 高 | 用 @Tool 注解写 Java Spring Bean，做深度集成 |

选择标准：**能用方式一就不用方式二，能用方式二就不用方式三。**

## Skill

**Skill（技能）**：可复用的指令模板，用 SKILL.md 文件描述，兼容 agentskills.io 开放标准。一个 Skill 通常是几个 Tool 的组合加上 prompt 增强。

SKILL.md 内容注入 system prompt，LLM 读到后自己理解任务、自己组合调用工具。OryxOS 不解析任务步骤、不做工作流引擎，所有逻辑交给 LLM。

## Session

**Session（会话）**：用户和 Agent 一次对话的上下文容器。由 Channel + 用户 + Profile 联合标识，包含对话历史、当前上下文、临时变量。持久化到 SQLite，重启不丢。

## Sandbox 与 Tool Policy

**Sandbox（沙箱）**：工具执行的隔离。核心阶段是应用层白名单校验——文件操作有路径白名单、Shell 有命令白名单、HTTP 有域名白名单。扩展阶段补 Docker 容器级隔离。

**Tool Policy（工具策略）**：Profile 级别的 Tool 允许/拒绝规则。核心阶段通过 Profile 的 tools 字段限定可用 Tool 子集，完整的 allow/deny 策略在扩展阶段补齐。

## Bootstrap 文件

**Bootstrap（引导文件）**：加载到 system prompt 的上下文文件，标准命名：

- `AGENTS.md`——项目级 agent 行为说明
- `SOUL.md`——agent 人格定义
- `USER.md`——用户偏好

Bootstrap 由用户手写、OryxOS 只读不写；MEMORY.md 由 Agent 写入、是 Agent 的「成长记录」。两者都进 system prompt，来源和生命周期不同。
