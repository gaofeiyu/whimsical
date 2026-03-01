# @whimsical/editor-new

AI驱动的低代码编辑器核心引擎（重构版）。

## 核心目标

1. **AI Native**: 原生支持通过自然语言（Chatbot）直接驱动页面构建。所有底层数据模型（NodeTree）的变更通过 `executeCommand` 指令体系执行，便于直接对接大模型输出的 JSON。
2. **双向引擎 (Bidirectional)**:
   - **DSL 到 代码**: 将可视化的页面组装结构（DSL）结合组件库产出高质量的可维护代码。
   - **代码 到 DSL**: 通过 `data-w-id` 等标记机制，允许开发者对生成的代码进行二次修改后，能重新反向解析回 DSL 并更新至可视化画布。
3. **轻量与现代**: 使用 React 19, Vite, MobX 和原生的 HTML5 拖拽 API 构建，摒弃了沉重的三方拖拽依赖。

## 模块架构

- **DSL 模型 (`NodeTree`)**: 响应式的树形结构数据模型，基于 MobX，支持快速序列化和反序列化。
- **历史记录 (`HistoryManager`)**: 基于快照（Snapshot）和指令（Command）的撤销/重做机制，完美支持 AI 批量变更。
- **拖拽引擎**: 基于 HTML5 原生拖拽，提供精准的插入位置（前/后/内部）可视化反馈。

## 开发指南

```bash
# 启动开发服务器
npm run dev

# 构建产物
npm run build

# 类型检查
npm run type-check
```
