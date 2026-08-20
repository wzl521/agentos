# OryxOS

## 项目定位

OryxOS 是一个基于 Java 实现的面向企业场景的 Agent OS（智能体操作系统）。它装在企业自己的 K8s 或服务器上，作为统一底座跑各种业务 Agent（运维助手、客服助手、HR 助手等），共享一套渠道接入、模型路由、工具调用、记忆系统、沙箱执行能力。数据完全留在企业自己的基础设施，不锁任何云生态。

**核心阶段交付的是 Agent OS 的运行时内核**（能力对齐业界开源 Agent OS 基础层），真正的差异化治理层（多租户、SSO、完整审计、Tool 治理）在扩展阶段补齐。

## 技术栈

- JDK 21 + Spring Boot 3.x + Virtual Thread
- Spring AI Alibaba（LLM Provider 抽象，只用协议转换和 schema 生成，**禁用自动 tool 执行**）
- 自实现 ReAct Loop（Agent 核心循环，不用 Spring AI 的 Agent 抽象）
- SQLite + Spring Data JPA（Session、审计持久化）
- MEMORY.md 文件（长期记忆，关键词检索）
- Picocli（命令行工具）
- SnakeYAML（Profile 解析）
- MCP Java SDK（MCP Client 集成）
- Spring MVC（REST API，Web Service）
- Logback + SLF4J（结构化日志）

## 工程结构（9 个 Maven 模块）

| 模块 | 职责 |
|------|------|
| `oryxos-core` | 核心引擎：ReActLoop、PromptBuilder、ToolExecutor、ContextLoader、Session、Profile、OryxTool 接口。所有模块都依赖它 |
| `oryxos-provider` | 能力一：ProviderService、Function Calling 适配、provider name 显式映射 |
| `oryxos-memory` | 能力三：MemoryService（三层统一门面）、LongTermMemory、MemoryTools |
| `oryxos-tool` | 能力四：内置 Tool（File/Shell/Http）、MCP Client、ToolRegistry、SandboxChecker（三合一） |
| `oryxos-web` | 能力五：WebServer、六个 ApiController、GlobalExceptionHandler、OpenAPI 文档 |
| `oryxos-channel-cli` | CLI Channel 实现 |
| `oryxos-storage` | SQLite 存储层：sessions、tool_invocations、llm_calls 三张表 |
| `oryxos-cli` | Picocli 命令行入口（12 个子命令） |
| `oryxos-boot` | Spring Boot 启动模块，打 fat JAR |

## 五大核心能力

1. **对接 LLM**（Provider 抽象）：基于 Spring AI Alibaba，Agent 不感知具体调哪家模型
2. **ReAct 循环**（Agent 大脑）：自己实现，Reason + Act 循环，默认最大 10 次迭代
3. **Memory 三层记忆**：会话记忆（SQLite）+ 长期记忆（MEMORY.md）+ 情景记忆（扩展阶段）
4. **Plugin Tool 体系**：内置 5 个 Tool + 三种扩展方式（零代码 SKILL.md+MCP / 轻代码自写 MCP Server / 重代码 @Tool 注解）
5. **Web Service**：REST API，核心阶段 10 个端点

五大能力的关系：**Provider、Memory、Tool 三个能力供养 ReAct 循环这个引擎，引擎跑出的能力通过 CLI 和 Web Service 两个入口对外提供。**

## 项目宪法（Non-negotiable Principles）

这些原则在所有代码中必须遵守，不能违反：

1. **JDK 21 + Spring Boot 3.x 单体应用**，Maven 多模块（9 个），单二进制部署
2. **五大核心能力优先**，支撑模块次之；核心阶段交付运行时内核，企业级治理放扩展阶段
3. **自实现 ReAct Loop**，不直接用 Spring AI 的 Agent 抽象
4. **Spring AI 只用一半**：只用 Provider 抽象、协议转换和 @Tool 的 schema 生成，**禁用自动 tool 执行**。Tool 调度完全由 ReActLoop + ToolExecutor 控制。这是最容易写错的地方！
5. **Plugin Tool 三档接入**，主推 SKILL.md + MCP 零代码方式
6. **核心阶段 SQLite + MEMORY.md 文件存储**，向量检索放扩展阶段；审计相关的 tool_invocations 和 llm_calls 核心阶段就写入落库
7. **每个 user story 完成后有可演示 demo**，优先级是跑通而非完美

## 关键技术决策

| 决策 | 选择 | 理由 |
|------|------|------|
| ReAct 循环 | 自己实现，不用 Spring AI Agent 抽象 | Agent 核心完全可控 |
| Spring AI 边界 | 只用协议转换和 schema 生成，禁用自动 tool 执行 | 否则 tool 被调两次 |
| 执行模型 | 同步阻塞 + Virtual Thread | 代码直观又能扛并发 |
| Tool 注册 | @Tool 注解 + OryxTool 抽象层 | ReAct 不感知 Tool 来源 |
| HTTP 层 | Spring MVC + Virtual Thread | 单机撑几千并发 |
| Sandbox | Path/Pattern 白名单，不用 SecurityManager | SecurityManager 在 JDK 21 已不可用 |
| 持久化 | SQLite + MEMORY.md，审计表 day one 落库 | 可审计地基从一开始立起来 |
| Provider 映射 | 显式 provider name 到 ChatModel 映射，不靠类型扫描 | 多 Provider 并存时 Bean 类型相同会有歧义 |

## 最容易被写错的地方

1. **Spring AI 自动 tool 执行没禁用** → 导致 tool 被调两次。必须在 ReActLoop 中禁用，tool 调度完全由 ToolExecutor 控制
2. **Provider 用类型扫描** → 多 Provider 时 Bean 类型相同无法区分。必须维护显式 provider name 到 ChatModel 映射
3. **Tool 被拆成多模块** → 应该是合并的 oryxos-tool 一个模块（内置 Tool + MCP Client + ToolRegistry + SandboxChecker 都在里面）
4. **SkillLoader 当成 Tool** → SKILL.md 是 prompt 输入源，归 ContextLoader（core 模块），不归 Tool 模块
5. **Memory 跟 Session 合并** → 应该是 MemoryService 三层统一门面，内部再分会话记忆和长期记忆
6. **审计表没落库** → tool_invocations 和 llm_calls 核心阶段就必须写入 SQLite，不能只放日志

## 核心阶段 10 个 REST 端点

| 端点 | 说明 | 分类 |
|------|------|------|
| POST /api/v1/sessions | 创建会话 | 会话管理 |
| POST /api/v1/sessions/{id}/messages | 发消息 | 会话管理 |
| GET /api/v1/sessions/{id} | 查询会话历史 | 会话管理 |
| DELETE /api/v1/sessions/{id} | 归档会话 | 会话管理 |
| POST /api/v1/agents/{name}/invoke | Agent 无状态调用 | Agent 调用 |
| GET /api/v1/profiles | 列 Profile | 信息查询 |
| GET /api/v1/memory | 查长期记忆 | 信息查询 |
| GET /api/v1/tools | 列可用 Tool | 信息查询 |
| GET /api/v1/health | 健康检查 | 系统状态 |
| GET /api/v1/info | 系统信息 | 系统状态 |

## 实施节奏（4 周，合计 12 小时）

| 周次 | 核心能力 | 周末可演示 |
|------|----------|-----------|
| 第一周 | LLM + ReAct（能力一+二） | oryxos chat 多轮对话，Agent 调 HTTP Tool 完成简单任务 |
| 第二周 | Memory + Tool（能力三+四） | Agent 记住偏好、调文件读写、调外部 MCP 工具 |
| 第三周 | Web Service（能力五） | 外部系统通过 10 个 REST 端点调用 OryxOS |
| 第四周 | 多 Agent + 工程化收尾 | 多 Agent 并存、CLI 完整、Session 跨重启恢复、主页可访问 |

## 5 个 User Story 依赖关系

```
US-1（对接 LLM）→ US-2（ReAct 循环）→ US-3（Memory）∥ US-4（Tool 体系）→ US-5（Web Service）
```

## 验证 Demo

| Demo | 验证能力 | 内容 |
|------|---------|------|
| Demo 一 | LLM + ReAct | "查天气穿衣"，Agent 调天气 API、用文件 Tool 写日报 |
| Demo 二 | Memory | 第一次对话记偏好，重启后第二次对话能引用记忆 |
| Demo 三 | Plugin Tool + MCP | 零代码 SKILL.md + MCP server 完成跨工具任务 |
| Demo 四 | Web Service 同步调用 | 外部系统创建 Session、发消息、获取响应、归档 |
| Demo 五 | Web Service 多端点联动 | 5 个端点协同完成一次业务流程 |

## 相关文档

- [业界调研](docs/IndustryResearch.md) — Why：为什么 Java 生态需要 Agent OS
- [需求文档](docs/DemandAnalysis.md) — What：功能需求和非功能需求
- [技术方案](docs/TechnicalSolution.md) — How：架构设计、模块划分、技术决策
- [AI 编程指引](docs/AiProgrammingGuide.md) — How to build：Spec-Kit + Claude Code 实施方法