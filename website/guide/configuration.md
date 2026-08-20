# 配置指南

OryxOS 的核心配置抽象是 **Profile**——一个 Agent 的完整配置，一份 YAML 文件。

## Profile 结构

Profile 文件放在 `.oryxos/profiles/`，文件名即 Profile 名。

```yaml
name: default                     # Profile 名，全局唯一
description: 默认 Agent

identity:                          # 身份段
  agent_name: oryxos               # Agent 名称
  prompt: 你是一个乐于助人的 AI 助手。  # 人格 prompt

provider:                          # LLM Provider 段
  name: deepseek                   # provider 名（见下方 Provider 配置）
  model: deepseek-chat             # 模型名
  temperature: 0.7                 # 温度参数

tools:                             # 该 Agent 可用的 Tool 列表
  - http_get
  - http_post
  - read_file
  - write_file
  - shell

skills:                            # 引用的 Skill（SKILL.md）
  - daily-pr-digest

mcp_servers:                       # 引用的 MCP server
  - github-mcp
  - slack-mcp

channels:                          # 绑定的 Channel
  - cli

bootstrap:                         # 注入 system prompt 的 Bootstrap 文件
  - AGENTS.md
  - SOUL.md
  - USER.md

settings:                          # 引擎参数
  max_iterations: 10               # ReAct 最大迭代次数（默认 10）
  max_history_turns: 20            # 保留的对话轮数（默认 20）
```

## Provider 配置

Provider 的 API key 和 base URL 在 `application.yaml` 配置，通过 Spring AI Alibaba 创建 ChatModel Bean。**每个 Provider 声明唯一的 provider name**，Profile 通过 name 引用。

## API Key 与密钥

敏感配置**不明文写死在 Profile YAML 里**，通过环境变量注入：

```bash
export DEEPSEEK_API_KEY=sk-your-key
export KIMI_API_KEY=sk-your-key
```

Profile 中可用 `${ENV_VAR}` 占位符，加载时从环境变量解析。配置加载时做必填项和格式校验，缺失或非法时给出清晰报错。

## MCP Server 配置

外部 MCP server 在 `.oryxos/mcp_servers.yaml` 声明：

```yaml
mcp_servers:
  - name: github-mcp
    transport: stdio          # stdio 或 sse
    command: npx
    args: [-y, @modelcontextprotocol/server-github]
    env:
      GITHUB_TOKEN: ${GITHUB_TOKEN}
```

OryxOS 启动时连接所有配置的 MCP server，调用 tools/list 拉取工具列表，包装成 OryxTool 注册到 ToolRegistry。Profile 通过 `mcp_servers` 字段引用。

## SKILL.md 技能文件

放在 `.oryxos/skills/`，带 frontmatter 的 markdown：

```markdown
---
name: daily-pr-digest
description: 汇总昨日 GitHub PR 评审进度并推送到 Slack
trigger: 每天早上 9 点
required_tools:
  - github-mcp
  - slack-mcp
---

任务说明正文：拉取昨日所有 PR，按仓库分组汇总评审进度，
生成简报推送到 #dev-daily 频道。
```

OryxOS 把 SKILL.md 内容加载进 system prompt，LLM 读到后自己理解任务、自己组合调用 MCP 工具。**业务方零代码上线新场景。**

## Sandbox 白名单

Tool 执行前的白名单校验，配置在 `application.yaml`：

```yaml
oryxos:
  sandbox:
    file:
      allowed-paths:        # 文件操作路径白名单
        - .oryxos/
        - workspace/
    shell:
      allowed-commands:     # Shell 命令白名单
        - ls
        - cat
        - grep
        - date
    http:
      allowed-domains:      # HTTP 域名白名单
        - api.github.com
        - wttr.in
```

任意校验失败抛 SandboxViolationException，Tool 执行终止。

## 多 Profile 并存

一个 OryxOS 实例上可以配置多个 Profile，多个 Agent 并存——这是「OS」在核心阶段的最小体现。业务方为每个工种配一份 Profile：运维助手、客服助手、HR 助手各一份，共享同一套底座。
