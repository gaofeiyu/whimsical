# 02 - Action History Engine (Command Pattern)

## 背景与目的

在 AI Native 的低代码引擎中，传统的直接修改对象属性（如 `node.children.push(...)`）不仅难以追踪历史记录，更致命的是，它无法与 AI Chatbot 顺畅对接。AI 更擅长输出“意图”和“指令”。

因此，我们引入了基于 Command 模式的变异（Mutation）引擎，配合快照机制实现历史记录的回退与重放。

## 核心机制

### 1. 指令集 (EditorAction)
在 `NodeTree` 中，一切状态的改变都必须通过 `executeCommand` 方法触发。目前支持的基础指令包括：
- `append`: 向目标容器末尾追加节点。
- `insertBefore`: 在目标节点上方/左方插入节点（流式布局核心）。
- `insertAfter`: 在目标节点下方/右方插入节点。
- `remove`: 删除指定节点。
- `updateProps`: 更新指定节点的属性。
- `move`: 在树中移动现有节点的位置。

### 2. HistoryManager 设计
为了支持 Undo/Redo，我们在 `editor-new/src/store/HistoryManager.ts` 中实现了一个轻量级的基于栈的管理器。

- **触发时机**：每次调用 `executeCommand` 成功修改节点后，都会触发一次 `NodeTree.serialize()`，将当前完整的 DSL 树转为 JSON 字符串，存入历史栈。
- **快照机制 (Snapshots)**：对于大粒度的重构（比如 Chatbot 批量生成了一整个页面的代码），系统提供手动创建快照的接口，便于用户在不同的 AI 生成版本间进行对比和回滚。
- **状态恢复**：当调用 `undo()` 或 `redo()` 时，HistoryManager 会取出对应的 JSON 字符串，反序列化后重新赋值给根节点，MobX 会自动驱动 React 视图完成全量更新。
