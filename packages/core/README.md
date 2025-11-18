# @xiaoxiao6.0/flow-designer-core

> 流程设计器核心包 - 框架无关的流程编排引擎

## 安装

```bash
npm install @xiaoxiao6.0/flow-designer-core
```

或使用其他包管理器：

```bash
pnpm add @xiaoxiao6.0/flow-designer-core
yarn add @xiaoxiao6.0/flow-designer-core
```

## 特性

- 🎯 **框架无关**：纯 TypeScript 实现，可集成到任何框架
- 🔄 **流程编排**：支持复杂的审批流程设计
- 🎨 **灵活定制**：丰富的节点类型和配置选项
- 📦 **轻量级**：无额外依赖，包体积小
- 💪 **TypeScript**：完整的类型定义支持

## 快速开始

### 基础使用

```typescript
import { FlowDesigner, NodeType } from '@xiaoxiao6.0/flow-designer-core';

// 创建流程设计器实例
const designer = new FlowDesigner();

// 添加开始节点
designer.addNode({
  id: 'start-1',
  type: NodeType.START,
  data: {
    label: '发起申请'
  },
  position: { x: 100, y: 100 }
});

// 添加审批节点
designer.addNode({
  id: 'approval-1',
  type: NodeType.APPROVAL,
  data: {
    label: '部门经理审批',
    approvers: ['manager1']
  },
  position: { x: 100, y: 200 }
});

// 添加连线
designer.addEdge({
  id: 'edge-1',
  source: 'start-1',
  target: 'approval-1'
});

// 获取流程数据
const flowData = designer.toJSON();
console.log(flowData);
```

## API 文档

### FlowDesigner

流程设计器主类。

#### 构造函数

```typescript
new FlowDesigner(options?: FlowDesignerOptions)
```

#### 方法

##### addNode(node: Node): void

添加节点到画布。

```typescript
designer.addNode({
  id: 'node-1',
  type: NodeType.APPROVAL,
  data: { label: '审批节点' },
  position: { x: 0, y: 0 }
});
```

##### removeNode(nodeId: string): void

删除指定节点。

```typescript
designer.removeNode('node-1');
```

##### addEdge(edge: Edge): void

添加连线。

```typescript
designer.addEdge({
  id: 'edge-1',
  source: 'node-1',
  target: 'node-2'
});
```

##### removeEdge(edgeId: string): void

删除指定连线。

```typescript
designer.removeEdge('edge-1');
```

##### toJSON(): FlowData

导出流程数据。

```typescript
const data = designer.toJSON();
```

##### fromJSON(data: FlowData): void

从数据加载流程。

```typescript
designer.fromJSON(flowData);
```

### NodeType

节点类型枚举。

```typescript
enum NodeType {
  START = 'start',           // 开始节点
  END = 'end',              // 结束节点
  APPROVAL = 'approval',     // 审批节点
  CC = 'cc',                // 抄送节点
  CONDITION = 'condition',   // 条件节点
  PARALLEL = 'parallel',     // 并行节点
  INCLUSIVE = 'inclusive'    // 包容节点
}
```

### 类型定义

```typescript
interface Node {
  id: string;
  type: NodeType;
  data: Record<string, any>;
  position: { x: number; y: number };
}

interface Edge {
  id: string;
  source: string;
  target: string;
  data?: Record<string, any>;
}

interface FlowData {
  nodes: Node[];
  edges: Edge[];
}
```

## 使用场景

### 审批流程

```typescript
// 创建一个简单的请假审批流程
const designer = new FlowDesigner();

designer.addNode({
  id: 'start',
  type: NodeType.START,
  data: { label: '发起请假' },
  position: { x: 100, y: 50 }
});

designer.addNode({
  id: 'approval-manager',
  type: NodeType.APPROVAL,
  data: {
    label: '直属主管审批',
    approvers: ['manager']
  },
  position: { x: 100, y: 150 }
});

designer.addNode({
  id: 'approval-hr',
  type: NodeType.APPROVAL,
  data: {
    label: 'HR审批',
    approvers: ['hr']
  },
  position: { x: 100, y: 250 }
});

designer.addNode({
  id: 'end',
  type: NodeType.END,
  data: { label: '结束' },
  position: { x: 100, y: 350 }
});

// 连接节点
designer.addEdge({ id: 'e1', source: 'start', target: 'approval-manager' });
designer.addEdge({ id: 'e2', source: 'approval-manager', target: 'approval-hr' });
designer.addEdge({ id: 'e3', source: 'approval-hr', target: 'end' });
```

### 条件分支

```typescript
// 根据金额走不同审批流程
designer.addNode({
  id: 'condition-1',
  type: NodeType.CONDITION,
  data: {
    label: '金额判断',
    conditions: [
      { expression: 'amount < 1000', label: '小于1000' },
      { expression: 'amount >= 1000', label: '大于等于1000' }
    ]
  },
  position: { x: 100, y: 150 }
});
```

## 框架集成

这是一个框架无关的核心包，可以与任何前端框架集成：

- **React**：使用 `@xiaoxiao6.0/flow-designer-react`
- **Vue**：使用 `@xiaoxiao6.0/flow-designer-vue`
- **其他框架**：基于此核心包自行封装

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build
```

## License

MIT © xiaochenyang1

## 相关链接

- [GitHub 仓库](https://github.com/xiaochenyang1/my-awesome-package)
- [问题反馈](https://github.com/xiaochenyang1/my-awesome-package/issues)
