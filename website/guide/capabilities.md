# 五大核心能力

OryxOS 核心阶段交付五大核心能力，对应 Agent OS 运行时内核的主体。五个能力像五个齿轮，组合起来解决企业大量真实场景。

## 能力一：对接 LLM

Provider 抽象层，让 Agent 能调任意主流大模型，**不感知具体调的是哪家**。

- 基于 Spring AI Alibaba，复用现成的主流 LLM connector
- 同一个 Agent 在不同任务用不同模型：简单任务走便宜模型、复杂任务走强模型
- 接入企业自有的本地推理服务（Ollama、vLLM），数据完全不出企业
- 每次调用记录 token 使用量、Provider、模型，成本透明

## 能力二：ReAct 循环

**Agent 大脑。** LLM 思考（Reason）是否要调用工具、调哪个工具；OryxOS 执行（Act）这个工具，把结果回填给 LLM；LLM 看到结果决定下一步动作。循环持续到 LLM 给出最终响应或达到最大迭代次数。

ReAct 循环是 OryxOS 最核心的一段代码，核心循环约数十行 Java，自实现而不依赖框架的 Agent 抽象——让实现者完整掌握 Agent 的工作机制。

基于这个能力：Agent 能自主决定何时调用哪个工具（不需要业务方写死流程）；多步骤任务一次对话内连续完成（先读文件、再分析、再调 API、再生成报告）；出错时能自己重试、换工具。

## 能力三：三层记忆

Agent 记得住用户的偏好、项目、决策、对话历史。

- **会话记忆**：当前对话完整历史，SQLite 持久化，重启可恢复
- **长期记忆**：用户偏好、项目背景，存在 MEMORY.md，Agent 通过 `save_memory` / `recall_memory` 两个内置 Tool 主动读写
- **情景记忆**：任务过程中学了什么（扩展阶段）

核心体验：用 OryxOS 一段时间后，Agent 自然记住「我一般用 Spring Boot 不用 Spring MVC」「我的项目部署在 K8s 上」，下一次对话不需要重新解释。

## 能力四：Plugin Tool 体系

Agent 能调用工具实际操作系统。内置 5 个基础 Tool（文件读写、Shell、HTTP、记忆读写），业务方通过三种方式扩展：

| 方式 | 说明 | 适合 |
|------|------|------|
| 零代码 SKILL.md + MCP | 写一份 markdown 描述意图，复用社区 MCP server | 上线新场景的最快路径 |
| 轻代码自写 MCP Server | 任何语言写，MCP 协议暴露工具 | 接入企业自有系统（ERP、CRM、CMDB） |
| 重代码 @Tool 注解 | Java Spring Bean，进程内直接调用 | 深度集成：复用现有 Bean、Spring Security 权限 |

典型场景：接 Prometheus、Grafana、SSH 做运维自愈；接 GitHub、Jira 做研发助手；接企查查、天气 API 做信息聚合。

## 能力五：Web Service

REST API 把前四个能力全部对外暴露，**业务系统用 HTTP 调一下就能用上 Agent**。这是 OryxOS 区别于个人助手项目的关键能力。

- 核心阶段 10 个端点：会话管理、Agent 无状态调用、信息查询、系统状态
- 任何能发 HTTP 请求的语言都能集成
- 一个 OryxOS 实例同时服务多个业务系统
- 监控告警、Webhook 触发、定时任务都通过 Web Service 调用 Agent

## 五个能力的关系

五个能力不是平行的功能模块：

```
Provider、Memory、Tool 三个能力供养 ReAct 循环这个引擎，
引擎跑出的能力通过 CLI 和 Web Service 两个入口对外提供。
```

- **ReAct 循环**是引擎，驱动「用户消息 → LLM 思考 → Tool 执行 → 结果回填 → 继续」
- **Provider** 给引擎提供 LLM 调用能力，每轮思考都要调一次
- **Memory** 给引擎提供上下文，每轮组装 prompt 时注入会话历史和长期记忆
- **Tool** 给引擎提供执行能力，LLM 决定调哪个 Tool 后由引擎负责执行
- **Web Service** 是这套内部能力的对外出口，不参与内部循环，是循环的触发入口和结果出口
