import { defineConfig } from 'vitepress'

const shared = {
  title: 'OryxOS',
  logo: '/logo.svg',
  socialLinks: [
    { icon: 'github', link: 'https://github.com/oryxos/oryxos' },
  ] as const,
}

export default defineConfig({
  lang: 'zh-CN',
  description: '企业能完全掌控的 Java Agent OS 底座',

  // DeepSeek 风格：默认亮色，深色文字高对比
  appearance: 'light',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
  ],

  locales: {
    root: {
      label: '中文',
      lang: 'zh-CN',
      title: 'OryxOS',
      description: '企业能完全掌控的 Java Agent OS 底座',
      themeConfig: {
        ...shared,
        siteTitle: 'OryxOS',
        nav: [
          { text: '首页', link: '/' },
          { text: '文档', link: '/guide/what-is-oryxos', activeMatch: '/guide/' },
          { text: 'API 参考', link: '/guide/api-reference' },
          { text: '路线图', link: '/guide/roadmap' },
          { text: 'GitHub', link: 'https://github.com/oryxos/oryxos' },
        ],
        sidebar: {
          '/guide/': [
            {
              text: '开始',
              items: [
                { text: 'OryxOS 是什么', link: '/guide/what-is-oryxos' },
                { text: '快速开始', link: '/guide/getting-started' },
                { text: '核心概念', link: '/guide/core-concepts' },
              ],
            },
            {
              text: '深入',
              items: [
                { text: '五大核心能力', link: '/guide/capabilities' },
                { text: '架构设计', link: '/guide/architecture' },
                { text: '配置指南', link: '/guide/configuration' },
              ],
            },
            {
              text: '参考',
              items: [
                { text: 'API 参考', link: '/guide/api-reference' },
                { text: '路线图', link: '/guide/roadmap' },
              ],
            },
          ],
        },
        footer: {
          message: '基于 Apache License 2.0 发布',
          copyright: 'Copyright © 2026 OryxOS',
        },
        outline: { level: [2, 3], label: '本页目录' },
        docFooter: { prev: '上一页', next: '下一页' },
        darkModeSwitchLabel: '外观',
        sidebarMenuLabel: '菜单',
        returnToTopLabel: '回到顶部',
        langMenuLabel: '切换语言',
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'OryxOS',
      description: 'The Java-native Agent OS your enterprise fully controls',
      themeConfig: {
        ...shared,
        siteTitle: 'OryxOS',
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Docs', link: '/en/guide/what-is-oryxos', activeMatch: '/en/guide/' },
          { text: 'API Reference', link: '/en/guide/api-reference' },
          { text: 'Roadmap', link: '/en/guide/roadmap' },
          { text: 'GitHub', link: 'https://github.com/oryxos/oryxos' },
        ],
        sidebar: {
          '/en/guide/': [
            {
              text: 'Getting Started',
              items: [
                { text: 'What is OryxOS', link: '/en/guide/what-is-oryxos' },
                { text: 'Getting Started', link: '/en/guide/getting-started' },
                { text: 'Core Concepts', link: '/en/guide/core-concepts' },
              ],
            },
            {
              text: 'Deep Dive',
              items: [
                { text: 'Five Core Capabilities', link: '/en/guide/capabilities' },
                { text: 'Architecture', link: '/en/guide/architecture' },
                { text: 'Configuration', link: '/en/guide/configuration' },
              ],
            },
            {
              text: 'Reference',
              items: [
                { text: 'API Reference', link: '/en/guide/api-reference' },
                { text: 'Roadmap', link: '/en/guide/roadmap' },
              ],
            },
          ],
        },
        footer: {
          message: 'Released under the Apache License 2.0',
          copyright: 'Copyright © 2026 OryxOS',
        },
        outline: { level: [2, 3], label: 'On this page' },
        docFooter: { prev: 'Previous page', next: 'Next page' },
        darkModeSwitchLabel: 'Appearance',
        sidebarMenuLabel: 'Menu',
        returnToTopLabel: 'Return to top',
        langMenuLabel: 'Change language',
      },
    },
  },
})
