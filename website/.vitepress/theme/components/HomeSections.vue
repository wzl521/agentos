<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()

// SVG 图标路径（no-emoji-icons 规则）
const ICONS = {
  layers: '/icons/layers.svg',
  shield: '/icons/shield.svg',
  java: '/icons/java.svg',
  audit: '/icons/audit.svg',
  plug: '/icons/plug.svg',
  brain: '/icons/brain.svg',
  memory: '/icons/memory.svg',
  tool: '/icons/tool.svg',
  api: '/icons/api.svg',
}

const t = computed(() => {
  const zh = {
    terminalTitle: 'oryxos — zsh',
    terminalCmds: [
      { type: 'cmd', text: 'oryxos init' },
      { type: 'out', text: '已初始化 .oryxos/ 工作区' },
      { type: 'cmd', text: 'oryxos chat' },
      { type: 'out', text: 'oryxos> 查一下北京今天的天气，告诉我穿什么合适' },
      { type: 'ai', text: 'Agent 调用 HTTP Tool 获取天气数据，' },
      { type: 'ai', text: 'ReAct 循环自动完成推理 → 调工具 → 回填 → 回答。' },
    ],
    valueKicker: '为什么选择 OryxOS',
    valueTitle: '为严监管企业设计的 Agent 底座',
    valueSub: '数据不出企业、全程可审计、技术栈对齐 Java 生态——这是企业把 Agent 跑上生产的四个前提。',
    values: [
      { icon: 'layers', title: '统一底座', desc: '渠道、模型、记忆、工具、沙箱等公共能力下沉到底座。上一个新 Agent 只需一份 Profile 配置，不重复造轮子。' },
      { icon: 'shield', title: '完全私有', desc: '部署在自有 K8s 或服务器上。模型可接外部 API，也可用本地 Ollama / vLLM，数据全部留在企业基础设施。' },
      { icon: 'java', title: 'Java 原生', desc: '基于 Spring Boot 3.x 标准工程结构，复用企业现有 Java 运维工具链（Nacos、Sentinel、SkyWalking），无需引入新技术栈。' },
      { icon: 'audit', title: '全程可审计', desc: 'LLM 调用与 Tool 调用从 day one 结构化落库，谁、何时、调了什么、结果如何，全程可追溯。' },
    ],
    capKicker: '五大核心能力',
    capTitle: '一个运行时内核，五个能力齿轮',
    capSub: '核心阶段交付 Agent OS 运行时内核，五个能力组合出企业真实场景。',
    caps: [
      { icon: 'plug', num: '01', title: '对接 LLM', desc: 'Provider 抽象层，基于 Spring AI Alibaba。Agent 不感知调的是哪家模型，运行时切换无 lock-in。' },
      { icon: 'brain', num: '02', title: 'ReAct 循环', desc: 'Agent 大脑。Reason + Act：LLM 思考是否调工具，看结果再决策，直到给出最终响应。' },
      { icon: 'memory', num: '03', title: '三层记忆', desc: '会话记忆 + 长期记忆（MEMORY.md）+ 情景记忆。跨对话记住偏好，换新对话无需重新解释。' },
      { icon: 'tool', num: '04', title: 'Plugin Tool', desc: '内置 5 个基础 Tool。业务方零代码写 SKILL.md 复用 MCP、轻代码自写 MCP Server、重代码 @Tool 注解。' },
      { icon: 'api', num: '05', title: 'Web Service', desc: 'REST API 对外暴露全部能力，核心阶段 10 个端点。任何语言的业务系统通过 HTTP 接入。' },
    ],
    archKicker: '架构',
    archTitle: '四层架构，单二进制部署',
    archSub: '接入层、引擎层、能力层、基础层收敛到一个 Spring Boot 单体应用。所有能力在一个进程内，装好就跑。',
    compareKicker: '定位',
    compareTitle: '守中间层，不抢上下游',
    compareSub: 'OryxOS 既不跟编排平台抢上层，也不跟框架抢底层，而是做让 Agent 常驻、可治理、可审计地跑起来的底座。',
    compare: {
      head: ['项目', '定位', '语言', '与 OryxOS 的关系'],
      rows: [
        ['OpenClaw', '个人 / 小团队 Agent OS', 'Node.js', '同类不同定位，经 SKILL.md 互通'],
        ['Hermes Agent', '个人 / 小团队 Agent OS', 'Python', '同类不同定位，经 SKILL.md 互通'],
        ['Dify / Coze', '可视化工作流编排', 'Python / TS', '互补，可跑在 OryxOS 之上'],
        ['Spring AI / LangChain4j', 'LLM 调用框架', 'Java', '被 OryxOS 复用做底层调用'],
      ],
    },
    roadmapKicker: '路线图',
    roadmapTitle: '核心阶段先行，社区接力演进',
    roadmapSub: '核心阶段 4 周交付可演示的运行时内核，治理层与生态由扩展阶段和社区共建补齐。',
    roadmap: [
      { phase: '核心阶段 · 4 周', title: '五大核心能力全部跑通', desc: 'LLM + ReAct、Memory + Tool、Web Service、多 Agent 并存。每周末有可演示成果，最终交付 OryxOS 1.0 运行时内核。' },
      { phase: '扩展阶段', title: '企业级治理层', desc: '多 Channel（企微 / 飞书 / 钉钉 / Slack）、Memory 语义检索、Tool Policy、SSO 多租户、完整审计、集群高可用。' },
      { phase: '社区共建', title: '生态与长尾', desc: 'Skills Marketplace、多语言 SDK、可视化 Profile 编辑器、K8s Operator、移动端管理台。' },
    ],
    ctaTitle: '开始构建你的第一个 Agent',
    ctaSub: '装好就跑。从一份 Profile 配置开始。',
    ctaPrimary: '快速开始',
    ctaSecondary: '阅读文档',
  }

  const en = {
    terminalTitle: 'oryxos — zsh',
    terminalCmds: [
      { type: 'cmd', text: 'oryxos init' },
      { type: 'out', text: 'Workspace .oryxos/ initialized' },
      { type: 'cmd', text: 'oryxos chat' },
      { type: 'out', text: 'oryxos> What should I wear in Beijing today?' },
      { type: 'ai', text: 'The Agent calls an HTTP tool for weather data. The ' },
      { type: 'ai', text: 'ReAct loop drives reason → act → refill → answer.' },
    ],
    valueKicker: 'Why OryxOS',
    valueTitle: 'An Agent foundation built for regulated enterprises',
    valueSub: 'Data stays on-premises, everything is auditable, and the stack aligns with your Java ecosystem — the four prerequisites for running Agents in production.',
    values: [
      { icon: 'layers', title: 'Unified Foundation', desc: 'Channels, models, memory, tools, and sandbox are baked into the base. Adding a new Agent is just one Profile config — no reinvented wheels.' },
      { icon: 'shield', title: 'Fully Private', desc: 'Deploy on your own K8s or servers. Bring external LLM APIs or run local Ollama / vLLM — data never leaves your infrastructure.' },
      { icon: 'java', title: 'Java Native', desc: 'Built on standard Spring Boot 3.x structure. Reuse your existing Java toolchain (Nacos, Sentinel, SkyWalking) — no new stack to learn.' },
      { icon: 'audit', title: 'Auditable by Design', desc: 'LLM calls and Tool invocations are persisted from day one. Who, when, what, and with what result — fully traceable.' },
    ],
    capKicker: 'Five Core Capabilities',
    capTitle: 'One runtime kernel, five gears',
    capSub: 'The core phase ships the Agent OS runtime kernel. Five capabilities compose into real enterprise scenarios.',
    caps: [
      { icon: 'plug', num: '01', title: 'LLM Integration', desc: 'A Provider abstraction on top of Spring AI Alibaba. Agents never know which model they call — zero lock-in at runtime.' },
      { icon: 'brain', num: '02', title: 'ReAct Loop', desc: 'The Agent brain. Reason + Act: the LLM decides whether to call tools, reads results, and decides again until the final answer.' },
      { icon: 'memory', num: '03', title: 'Three-Layer Memory', desc: 'Session memory + long-term memory (MEMORY.md) + episodic memory. Preferences persist across conversations.' },
      { icon: 'tool', num: '04', title: 'Plugin Tools', desc: 'Five built-in tools. Extend with zero-code SKILL.md + MCP, a custom MCP server, or @Tool-annotated Java beans.' },
      { icon: 'api', num: '05', title: 'Web Service', desc: 'A REST API exposing every capability — 10 endpoints in the core phase. Any language can integrate over HTTP.' },
    ],
    archKicker: 'Architecture',
    archTitle: 'Four layers, one binary',
    archSub: 'Access, engine, capability, and foundation layers converge into a single Spring Boot application. Everything in one process — install and run.',
    compareKicker: 'Positioning',
    compareTitle: 'The middle layer, not the layers above or below',
    compareSub: 'OryxOS doesn\'t compete with orchestration platforms or LLM frameworks — it is the base where Agents run permanently, governed and auditable.',
    compare: {
      head: ['Project', 'Positioning', 'Language', 'Relation to OryxOS'],
      rows: [
        ['OpenClaw', 'Agent OS for individuals / small teams', 'Node.js', 'Same category, different focus; SKILL.md compatible'],
        ['Hermes Agent', 'Agent OS for individuals / small teams', 'Python', 'Same category, different focus; SKILL.md compatible'],
        ['Dify / Coze', 'Visual workflow orchestration', 'Python / TS', 'Complementary — can run on top of OryxOS'],
        ['Spring AI / LangChain4j', 'LLM frameworks', 'Java', 'Reused by OryxOS for low-level LLM calls'],
      ],
    },
    roadmapKicker: 'Roadmap',
    roadmapTitle: 'Core phase first, community evolves the rest',
    roadmapSub: 'A 4-week core phase ships a demoable runtime kernel. Governance and the ecosystem follow via extension and community phases.',
    roadmap: [
      { phase: 'Core Phase · 4 Weeks', title: 'All five capabilities running', desc: 'LLM + ReAct, Memory + Tools, Web Service, multi-Agent. A demoable milestone each week, ending with the OryxOS 1.0 runtime kernel.' },
      { phase: 'Extension Phase', title: 'Enterprise governance layer', desc: 'IM channels (WeCom / Feishu / DingTalk / Slack), semantic memory, Tool Policy, SSO & multi-tenancy, full audit, HA clustering.' },
      { phase: 'Community', title: 'Ecosystem & long tail', desc: 'Skills Marketplace, multi-language SDKs, visual Profile editor, K8s Operator, mobile console.' },
    ],
    ctaTitle: 'Build your first Agent',
    ctaSub: 'Install and run. Start from one Profile config.',
    ctaPrimary: 'Get Started',
    ctaSecondary: 'Read the Docs',
  }

  return lang.value === 'en-US' || lang.value === 'en' ? en : zh
})
</script>

<template>
  <div>
    <!-- 终端演示 -->
    <div class="home-terminal">
      <div class="home-terminal-bar">
        <i></i><i></i><i></i>
        <span>{{ t.terminalTitle }}</span>
      </div>
      <div class="home-terminal-body">
        <div v-for="(line, i) in t.terminalCmds" :key="i">
          <span v-if="line.type === 'cmd'"><span class="prompt">❯ </span><span class="cmd">{{ line.text }}</span></span>
          <span v-else-if="line.type === 'out'" class="out">{{ line.text }}</span>
          <span v-else class="ai">{{ line.text }}</span>
        </div>
      </div>
    </div>

    <!-- 价值主张 -->
    <section class="home-section">
      <div class="home-section-kicker">{{ t.valueKicker }}</div>
      <h2 class="home-section-title">{{ t.valueTitle }}</h2>
      <p class="home-section-sub">{{ t.valueSub }}</p>
      <div class="value-grid">
        <div v-for="v in t.values" :key="v.title" class="value-card">
          <div class="icon"><img :src="ICONS[v.icon]" alt="" width="21" height="21" loading="lazy" /></div>
          <h3>{{ v.title }}</h3>
          <p>{{ v.desc }}</p>
        </div>
      </div>
    </section>

    <!-- 五大能力 -->
    <section class="home-section">
      <div class="home-section-kicker">{{ t.capKicker }}</div>
      <h2 class="home-section-title">{{ t.capTitle }}</h2>
      <p class="home-section-sub">{{ t.capSub }}</p>
      <div class="cap-grid">
        <a v-for="c in t.caps" :key="c.num" class="cap-card"
           :href="lang === 'en-US' || lang === 'en' ? '/en/guide/capabilities' : '/guide/capabilities'">
          <div class="cap-icon"><img :src="ICONS[c.icon]" alt="" width="19" height="19" loading="lazy" /></div>
          <div class="num">{{ c.num }}</div>
          <h3>{{ c.title }}</h3>
          <p>{{ c.desc }}</p>
        </a>
      </div>
    </section>

    <!-- 架构图 -->
    <section class="home-section">
      <div class="home-section-kicker">{{ t.archKicker }}</div>
      <h2 class="home-section-title">{{ t.archTitle }}</h2>
      <p class="home-section-sub">{{ t.archSub }}</p>
      <div class="arch-block">
        <img src="/architecture.svg" alt="OryxOS Architecture" loading="lazy" />
      </div>
    </section>

    <!-- 定位对比 -->
    <section class="home-section">
      <div class="home-section-kicker">{{ t.compareKicker }}</div>
      <h2 class="home-section-title">{{ t.compareTitle }}</h2>
      <p class="home-section-sub">{{ t.compareSub }}</p>
      <table class="compare-table">
        <thead>
          <tr>
            <th v-for="h in t.compare.head" :key="h">{{ h }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in t.compare.rows" :key="row[0]" :class="{ 'oryxos-row': i === 3 }">
            <td v-for="cell in row" :key="cell">{{ cell }}</td>
          </tr>
          <tr class="oryxos-row">
            <td>OryxOS</td>
            <td>{{ lang === 'en-US' || lang === 'en' ? 'Enterprise Agent OS foundation' : '企业级 Agent OS 底座' }}</td>
            <td><strong>Java</strong></td>
            <td>—</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- 路线图 -->
    <section class="home-section">
      <div class="home-section-kicker">{{ t.roadmapKicker }}</div>
      <h2 class="home-section-title">{{ t.roadmapTitle }}</h2>
      <p class="home-section-sub">{{ t.roadmapSub }}</p>
      <div class="timeline">
        <div v-for="item in t.roadmap" :key="item.phase" class="timeline-item">
          <div class="phase">{{ item.phase }}</div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="home-section">
      <div class="home-cta">
        <h2>{{ t.ctaTitle }}</h2>
        <p>{{ t.ctaSub }}</p>
        <div class="buttons">
          <a class="VPButton brand"
             :href="lang === 'en-US' || lang === 'en' ? '/en/guide/getting-started' : '/guide/getting-started'">
            {{ t.ctaPrimary }}
          </a>
          <a class="VPButton alt"
             :href="lang === 'en-US' || lang === 'en' ? '/en/guide/what-is-oryxos' : '/guide/what-is-oryxos'">
            {{ t.ctaSecondary }}
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
