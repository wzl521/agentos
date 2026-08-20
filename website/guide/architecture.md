# 架构设计

OryxOS 是一个 **Spring Boot 3.x 单体应用**，跑在 JDK 21 上，基于 Spring AI Alibaba 做 LLM 调用，自己实现 ReAct loop 作为 Agent 核心。整个 OryxOS 是一个可执行 JAR，单二进制部署。

技术栈一句话总结：**JDK 21 + Spring Boot 3.x + Spring AI Alibaba + 自实现 ReAct loop + SQLite + Picocli 命令行。**

![OryxOS 整体架构](/architecture.svg)

## 四层结构

从上到下分四层：

| 层 | 内容 | 职责 |
|----|------|------|
| 接入层 | CLI Channel、Web Service REST API | 消息进出 |
| 引擎层 | ReActLoop、PromptBuilder、ToolExecutor | Agent 大脑 |
| 能力层 | Provider、Memory、Tool | 提供 LLM 调用、上下文、执行能力 |
| 基础层 | Profile/Bootstrap/Skill 加载、Session 存储、SQLite、配置密钥 | 工程地基 |

## 两个入口

对外只有两个入口，消息最终都汇入同一个引擎：

1. **CLI Channel**：本地交互和调试（`oryxos chat`）
2. **Web Service**：业务系统通过 REST API 集成（`oryxos serve`）

## 9 个 Maven 模块

| 模块 | 对应 | 职责 |
|------|------|------|
| `oryxos-core` | 核心引擎 | ReActLoop、PromptBuilder、ToolExecutor、ContextLoader、OryxTool 等抽象。所有模块都依赖它 |
| `oryxos-provider` | 能力一 | ProviderService、Function Calling 适配、provider name 显式映射 |
| `oryxos-memory` | 能力三 | MemoryService（三层统一门面）、LongTermMemory、MemoryTools |
| `oryxos-tool` | 能力四 | 内置 Tool（File/Shell/Http）、MCP Client、ToolRegistry、SandboxChecker |
| `oryxos-web` | 能力五 | WebServer、六个 ApiController、GlobalExceptionHandler、OpenAPI 文档 |
| `oryxos-channel-cli` | 支撑 | CLI Channel 实现 |
| `oryxos-storage` | 支撑 | SQLite 存储层：sessions、tool_invocations、llm_calls 三张表 |
| `oryxos-cli` | 支撑 | Picocli 命令行入口（12 个子命令） |
| `oryxos-boot` | 支撑 | Spring Boot 启动模块，打 fat JAR |

模块之间通过接口解耦——加新 Channel 或新 Tool 只加新模块不改 core。

## 关键技术决策

### 自实现 ReAct loop

Spring AI 负责 LLM 调用、Function Calling 的协议格式转换、Provider 抽象这些底层工作，ReAct loop 自己写，保证 Agent 核心完全可控。

### Spring AI 只用一半

这是最容易埋 bug 的地方。Spring AI 自身带有一套完整的 tool calling 自动执行机制。OryxOS **不使用这套自动执行**，只用 Spring AI 的两件事：

1. Provider 抽象和向各家 LLM 的协议转换
2. @Tool 注解的 JSON Schema 生成

Tool 的实际调度和执行完全由 OryxOS 自己的 ReActLoop + ToolExecutor 控制。否则会出现 tool 被调两次的问题。

### 同步阻塞 + Virtual Thread

核心阶段采用同步阻塞执行模型，跟 Spring MVC 一致。一次消息从进来、ReAct loop 执行、Tool 调用到最终响应返回，全程同步。配合 Java 21 的 virtual thread，单节点支撑高并发不需要响应式编程。

### 显式 provider name 映射

多 Provider 并存时，Spring 容器里有多个 ChatModel Bean，类型相同无法靠类型扫描区分。OryxOS 维护一份显式的 provider name 到 ChatModel 的映射，Profile 通过 provider name 引用。

### Path/Pattern 白名单 Sandbox

不使用 Java SecurityManager（JDK 21 已不可用）。文件操作限制工作目录、Shell 命令白名单、HTTP 域名白名单，在应用层做校验。

## 数据持久化

| 数据类型 | 存储 | 说明 |
|---------|------|------|
| Session、审计数据 | SQLite（`.oryxos/oryxos.db`） | sessions、tool_invocations、llm_calls 三张表 |
| Profile、Bootstrap、Memory、Skill | 文件系统（`.oryxos/`） | 用户可直接编辑、git 跟踪 |

审计表（tool_invocations、llm_calls）在核心阶段就写入落库——「可审计」是 OryxOS 的差异化卖点，数据地基从 day one 立起来。

长期记忆用 MEMORY.md 文件加关键词检索（接口预留向量检索升级空间），核心阶段不引入向量数据库，保持单二进制部署。
