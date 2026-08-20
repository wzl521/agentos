# 路线图

OryxOS 按三个阶段演进：核心阶段（4 周）交付可演示的运行时内核，扩展阶段补齐企业级治理层，社区共建推进生态和长尾。

## 核心阶段（4 周）

| 周次 | 核心能力 | 可演示成果 |
|------|----------|-----------|
| 第一周 | LLM + ReAct 循环 | Agent 多轮对话，调 HTTP Tool 完成简单任务 |
| 第二周 | Memory + Tool 体系 | Agent 记住偏好，调用文件读写和外部 MCP 工具 |
| 第三周 | Web Service | 10 个 REST 端点完整调用链路 |
| 第四周 | 多 Agent + 工程化收尾 | 多 Agent 并存，Session 跨重启恢复，主页可访问 |

核心阶段结束后，**OryxOS 1.0 是一个可演示的最小完整 Agent OS 运行时内核**——五大核心能力全部跑通，具备配置 Agent、CLI 对话、多 Agent 并存、REST API 接入、MCP 工具生态对接的能力。

## 扩展阶段

### 渠道和模型层

- **多 Channel 接入**：企业微信、飞书、钉钉、Slack、邮件
- **Provider Fallback**：hedge racing、circuit breaker、故障自动切换
- **Adaptive Routing**：根据任务类型、历史质量、负载动态选模型

### 记忆和能力层

- **Memory 自动抽取**：对话结束时自动提取值得长期保留的事实
- **语义检索**：集成向量数据库，按语义相似度匹配
- **情景记忆**：记录任务过程中修改的文件、做出的决策
- **Skill 体系**：完整支持 SKILL.md，复用社区 skill

### 工具和安全层

- **MCP Server 暴露**：OryxOS 自己作为 MCP server
- **Tool Policy**：Profile 级 allow/deny 规则（扩展阶段优先做——不能让客服 Agent 拿到能 `rm -rf` 的 Shell Tool）
- **完整 Sandbox**：Docker、K8s pod、WebAssembly 隔离

### 治理和运维层（核心差异化）

- **SSO 和多租户**：SAML、OIDC，三级租户模型，RBAC 到 Agent/Tool/Skill 粒度
- **完整审计**：审计事件记录、trace ID 串联、SIEM 导出
- **Web 仪表板**：Profile 管理、Session 查看、审计日志查询
- **集群高可用**：多节点协同、故障自动迁移

### 企业集成层

- **企业 IT connector**：ERP（用友、金蝶、SAP）、CRM、CMDB、监控系统的现成 connector

## 社区共建

- **Skills Marketplace**：社区贡献的 Skill 共享平台，兼容 agentskills.io
- **多语言 SDK**：Java、Python、TypeScript、Go
- **可视化 Profile 编辑器**：让非工程师也能配置 Agent
- **Kubernetes Operator**：一键部署、GitOps 工作流
- **移动端管理台**：手机查集群状态、处理告警
- **Voice Channel**：语音唤醒和连续对话
- **RISC-V 和边缘部署**：Raspberry Pi、边缘网关
