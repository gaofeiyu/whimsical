# 01 - DSL 数据模型设计

## 核心设计理念

为了支持 AI 生成、自然语言交互以及双向代码转换，我们需要一个极其规范且轻量的 DSL 模型。
当前系统的 DSL 由 `INode` 接口定义，它抛弃了旧版复杂的业务绑定，回归纯粹的树状 JSON 结构。

## 数据结构定义

```typescript
export interface INode {
  id: string;             // 节点的唯一标识符 (必需，用于双向绑定标记 data-w-id)
  type: string;           // 组件类型 (例如: 'Button', 'Container', 'Page')
  props?: Record<string, any>; // 节点的属性集合，包括 style, 文本内容等
  children?: INode[];     // 子节点数组，用于描述嵌套的 UI 层级
}
```

### 节点分类

1. **容器节点**:
   - 比如 `Page`, `Container`, `FlexBox`。
   - 这类节点专门用于控制布局和排版，允许包含 `children` 子节点。
   - AI 在生成布局时，应优先使用这些节点来控制元素的流式排列（基于弹性布局）。
2. **内容节点**:
   - 比如 `Button`, `Text`, `Input`。
   - 这类节点负责具体的 UI 展现和交互，通常不包含（或不需要包含）子节点。

## 代码双向绑定机制

为了支持生成的 React 代码被二次开发后仍能还原为 DSL，所有的节点在渲染成真实 DOM 或 React 组件时，**必须**携带 `id` 属性，通常表现为 `data-w-id={node.id}`。
当解析修改后的 AST 时，引擎将通过这个 `data-w-id` 将变更准确映射回 `NodeTree` 中的具体节点。
