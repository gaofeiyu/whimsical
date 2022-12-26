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
          text: '编辑器',
          items: [
            {
              text: 'DSL约定',
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
          ]
        }
      ],
    },
    nav: [
      { text: '开始', link: '/guide/' },
      {
        text: '开发文档',
        items: [
          { text: '编辑器', link: '/editor/' },
          { text: '前端组件库', link: '/components/' }
        ]
      },
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
