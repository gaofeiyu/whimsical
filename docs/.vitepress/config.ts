export default {
  title: 'Whimsical',
  description: '跨技术栈低代码编辑器引擎',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
  ],
  themeConfig: {
    logo: '/logo.svg',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/gaofeiyu/whimsical' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            {
              text: '简介',
              link: '/guide/'
            },
            {
              text: '快速开始',
              link: '/guide/start'
            }
          ]
        },
        {
          text: '组件库封装',
          items: [
            {
              text: '简介',
              link: '/component/'
            },
            {
              text: '渲染引擎',
              link: '/component/engine'
            },
            {
              text: '表达式',
              link: '/component/expression'
            },
            {
              text: 'action(行为)',
              link: '/component/action'
            },
            {
              text: '继承已封装的组件库',
              link: '/component/api'
            }
          ]
        },
        {
          text: '编辑器开发',
          items: [
            {
              text: '简介',
              link: '/editor/'
            },
          ]
        },
        {
          text: '相关概念',
          items: [
            {
              text: 'DSL',
              link: '/guide/dsl/'
            },
            {
              text: '渲染引擎',
              link: '/guide/render-engine'
            },
            {
              text: '事件',
              link: '/guide/event'
            },
          ]
        },
        {
          text: 'DSL规范',
          items: [
            {
              text: '节点',
              link: '/guide/dsl/node'
            },
            {
              text: '表达式',
              link: '/guide/dsl/expression'
            },
            {
              text: '数据',
              link: '/guide/dsl/state'
            },
          ]
        }
      ],
    },
    nav: [
      { text: '指南', link: '/guide/' },
      {
        text: '组件库资源',
        items: [
          { text: '基础工具包', link: 'https://github.com/gaofeiyu/whimsical/tree/master/packages/shared' },
          { text: 'react源生渲染引擎', link: 'https://github.com/gaofeiyu/whimsical/tree/master/packages/react' },
        ]
      }
    ]
  },
};
