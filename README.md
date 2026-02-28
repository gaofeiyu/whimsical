# whimsical
A low code editor across technology stacks

- Why name called "whimsical"?
  - [http://www.gaofeiyu.com/blog/982.html](http://www.gaofeiyu.com/blog/982.html)

## 简介
这是一个向 **AI Native 演进的低代码引擎**项目，关注该项目您将会见证一个从零开始的、对接大模型的低代码项目的成长。

除了核心的通过 DSL 描述页面并绑定组件库实现跨栈渲染外，当前的核心愿景是：**实现一个可以通过自然语言与 AI 对话，直接绘制和修改页面的低代码编辑器，并支持 DSL 与代码的双向生成和还原机制。**

## 目标功能

- 基本的编辑器界面
- DSL设计
- 组件库接入能力
- 流式布局的画布
- 可跨技术栈的编辑能力
- 所见即所得的拖拽体验
- 配置拖拽元素属性的能力
- 操作的历史回溯能力
- 表达式支持
- 数据绑定及编辑能力
  - 循环数据绑定及编辑的能力
- 拖拽产物的结构树展示
  - 结构树和画布联动的拖拽能力
  - 结构树多功能接口
- 逻辑能力的支持
- DSL直接编辑的能力
- **Chatbot 接入能力（AI Copilot）**
  - 支持通过自然语言对话生成页面
  - 支持通过指令修改和调整 DSL 视图
- **代码生成与反向还原机制**
  - 基于指定的组件库将 DSL 转换为可二次开发的源码
  - 通过代码标记机制将二次开发后的源码反向解析回 DSL

## 想尝试开发？

为了承载全新的 AI 对话和指令式修改机制，项目正处于重构阶段。当前仓库提供以下主要包：

1. **`editor-new` (Active)**：全新的轻量级 Vite + React 18 核心编辑器。采用了 MobX 驱动的纯数据 `NodeTree` 模型，并内置了 Command 模式 (`executeCommand`)，原生支持 AI Chatbot 发送的节点修改指令。
2. `whimsical` (Legacy)：早期的低代码引擎 playground。
3. `whimsical-react-engine` (Legacy)：基于 react 的组件库及渲染引擎示例。
4. `whimsical-shared` (Legacy)：早期的工具包和 DSL 类型定义。

## 交流

本项目当前还比较粗糙，暂不开放共建，但欢迎感兴趣的同学互相交流。
有问题或是想交流可以提issue，也可以私信我feiyu.gao@gmail.com。
