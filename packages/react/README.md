# @xiaoxiao6.0/flow-designer-react

> 流程设计器 React 适配器 - 基于 ReactFlow 的可视化流程编排组件

## 安装

```bash
npm install @xiaoxiao6.0/flow-designer-react
```

或使用其他包管理器：

```bash
pnpm add @xiaoxiao6.0/flow-designer-react
yarn add @xiaoxiao6.0/flow-designer-react
```

## 特性

- 🎨 **React 18+**：使用最新的 React Hooks
- 🚀 **开箱即用**：提供完整的流程设计器组件
- 🔄 **受控组件**：支持完全的状态控制
- 📦 **轻量级**：基于 ReactFlow，性能优秀
- 💪 **TypeScript**：完整的类型定义支持
- 🎯 **可视化**：拖拽式流程设计体验

## 快速开始

### 基础使用

```tsx
import { FlowDesigner } from '@xiaoxiao6.0/flow-designer-react';
import { useState } from 'react';
import type { FlowConfig } from '@xiaoxiao6.0/flow-designer-react';

function App() {
  const [flowConfig, setFlowConfig] = useState<FlowConfig>({
    id: 'flow-1',
    name: '请假审批流程',
    version: '1.0.0',
    nodes: [
      {
        id: 'start-1',
        type: 'start',
        title: '发起申请',
        config: {}
      },
      {
        id: 'approval-1',
        type: 'approval',
        title: '部门经理审批',
        config: {
          approvers: ['manager1']
        }
      },
      {
        id: 'end-1',
        type: 'end',
        title: '结束',
        config: {}
      }
    ],
    edges: [
      {
        id: 'edge-1',
        source: 'start-1',
        target: 'approval-1'
      },
      {
        id: 'edge-2',
        source: 'approval-1',
        target: 'end-1'
      }
    ],
    settings: {}
  });

  return (
    <FlowDesigner
      config={flowConfig}
      onChange={setFlowConfig}
      onNodeDoubleClick={(node) => {
        console.log('双击节点:', node);
      }}
    />
  );
}

export default App;
```

### 使用 Hook

使用 `useFlowDesigner` hook 进行更精细的控制：

```tsx
import { useFlowDesigner } from '@xiaoxiao6.0/flow-designer-react';
import { useState } from 'react';
import type { FlowConfig } from '@xiaoxiao6.0/flow-designer-react';

function App() {
  const [flowConfig, setFlowConfig] = useState<FlowConfig>({
    id: 'flow-1',
    name: '审批流程',
    version: '1.0.0',
    nodes: [],
    edges: [],
    settings: {}
  });

  const {
    config,
    nodes,
    edges,
    addNode,
    updateNode,
    removeNode,
    addEdge,
    validate
  } = useFlowDesigner({
    config: flowConfig,
    onChange: (newConfig) => {
      setFlowConfig(newConfig);
      console.log('配置已更新:', newConfig);
    }
  });

  // 添加审批节点
  const handleAddApprovalNode = () => {
    addNode({
      id: `approval-${Date.now()}`,
      type: 'approval',
      title: '审批节点',
      config: {
        approvers: ['user1']
      }
    });
  };

  // 验证流程
  const handleValidate = () => {
    const result = validate();
    if (result.valid) {
      console.log('流程验证通过');
    } else {
      console.error('验证失败:', result.errors);
    }
  };

  return (
    <div>
      <div>
        <button onClick={handleAddApprovalNode}>添加审批节点</button>
        <button onClick={handleValidate}>验证流程</button>
      </div>
      <div>节点数量: {nodes.length}</div>
      <div>连线数量: {edges.length}</div>
    </div>
  );
}
```

## API 文档

### FlowDesigner 组件

流程设计器主组件。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| config | FlowConfig | 必填 | 流程配置对象 |
| onChange | (config: FlowConfig) => void | - | 配置变化回调 |
| loaders | DataLoaders | - | 数据加载器 |
| nodeComponents | Record<string, ComponentType> | - | 自定义节点组件 |
| formComponents | Record<string, ComponentType> | - | 自定义表单组件 |
| validators | Record<string, Function> | - | 自定义验证器 |
| theme | 'light' \| 'dark' | 'light' | 主题 |
| className | string | - | 自定义类名 |
| style | CSSProperties | - | 自定义样式 |
| showToolbar | boolean | true | 是否显示节点工具栏 |
| toolbarPosition | 'top' \| 'left' \| 'right' | 'top' | 工具栏位置 |
| availableNodeTypes | NodeTypeDefinition[] | 默认节点类型 | 可添加的节点类型 |

#### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onChange | (config: FlowConfig) | 配置变化时触发 |
| onNodeClick | (node: NodeConfig) | 节点单击时触发 |
| onNodeDoubleClick | (node: NodeConfig) | 节点双击时触发 |
| onNodeAdd | (parentId: string, type: string) | 添加节点时触发 |
| onNodeDelete | (nodeId: string) | 删除节点时触发 |
| onEdgeAdd | (source: string, target: string) | 添加连线时触发 |
| onEdgeDelete | (edgeId: string) | 删除连线时触发 |

#### 示例

```tsx
<FlowDesigner
  config={flowConfig}
  onChange={setFlowConfig}
  theme="light"
  showToolbar={true}
  toolbarPosition="top"
  onNodeDoubleClick={(node) => {
    console.log('配置节点:', node);
  }}
  onNodeAdd={(nodeId, type) => {
    console.log('添加节点:', nodeId, type);
  }}
/>
```

### useFlowDesigner Hook

流程设计器状态管理 hook。

#### 参数

```typescript
interface UseFlowDesignerOptions {
  config: FlowConfig;              // 流程配置
  onChange?: (config: FlowConfig) => void;  // 配置变化回调
  enableHistory?: boolean;         // 是否启用历史记录
}
```

#### 返回值

```typescript
interface UseFlowDesignerReturn {
  config: FlowConfig;              // 当前流程配置
  flowModel: FlowModel;            // 流程模型实例
  nodes: NodeConfig[];             // 所有节点
  edges: EdgeConfig[];             // 所有连线
  addNode: (node: NodeConfig) => void;
  updateNode: (nodeId: string, updates: Partial<NodeConfig>) => void;
  removeNode: (nodeId: string) => void;
  getNode: (nodeId: string) => NodeConfig | undefined;
  addEdge: (edge: EdgeConfig) => void;
  updateEdge: (edgeId: string, updates: Partial<EdgeConfig>) => void;
  removeEdge: (edgeId: string) => void;
  getEdge: (edgeId: string) => EdgeConfig | undefined;
  validate: () => { valid: boolean; errors: string[]; warnings?: string[] };
}
```

### 类型定义

```typescript
interface FlowConfig {
  id: string;
  name: string;
  version: string;
  nodes: NodeConfig[];
  edges: EdgeConfig[];
  settings: FlowSettings;
}

interface NodeConfig {
  id: string;
  type: string;
  title: string;
  config: Record<string, any>;
}

interface EdgeConfig {
  id: string;
  source: string;
  target: string;
  label?: string;
}

interface NodeTypeDefinition {
  type: string;
  label: string;
  icon: string;
  color: string;
  description?: string;
}
```

## 完整示例

### 请假审批流程

```tsx
import React, { useState } from 'react';
import { FlowDesigner } from '@xiaoxiao6.0/flow-designer-react';
import type { FlowConfig, NodeConfig } from '@xiaoxiao6.0/flow-designer-react';

function LeaveApprovalFlow() {
  const [flowConfig, setFlowConfig] = useState<FlowConfig>({
    id: 'leave-approval',
    name: '请假审批流程',
    version: '1.0.0',
    nodes: [
      {
        id: 'start',
        type: 'start',
        title: '发起请假',
        config: {}
      },
      {
        id: 'approval-manager',
        type: 'approval',
        title: '直属主管审批',
        config: {
          approvers: ['manager']
        }
      },
      {
        id: 'approval-hr',
        type: 'approval',
        title: 'HR审批',
        config: {
          approvers: ['hr']
        }
      },
      {
        id: 'end',
        type: 'end',
        title: '结束',
        config: {}
      }
    ],
    edges: [
      { id: 'e1', source: 'start', target: 'approval-manager' },
      { id: 'e2', source: 'approval-manager', target: 'approval-hr' },
      { id: 'e3', source: 'approval-hr', target: 'end' }
    ],
    settings: {}
  });

  const handleFlowChange = (newConfig: FlowConfig) => {
    setFlowConfig(newConfig);
    console.log('流程配置已更新');
  };

  const handleNodeConfig = (node: NodeConfig) => {
    console.log('配置节点:', node);
    // 这里可以打开节点配置弹窗
  };

  const handleSave = async () => {
    try {
      // 保存到后端 API
      await fetch('/api/flows/leave-approval', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flowConfig)
      });
      alert('保存成功');
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>请假审批流程设计器</h1>

      <FlowDesigner
        config={flowConfig}
        onChange={handleFlowChange}
        onNodeDoubleClick={handleNodeConfig}
        showToolbar={true}
        toolbarPosition="top"
      />

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleSave}>保存流程</button>
      </div>
    </div>
  );
}

export default LeaveApprovalFlow;
```

### 动态加载数据

```tsx
import { FlowDesigner } from '@xiaoxiao6.0/flow-designer-react';

function App() {
  const [config, setConfig] = useState<FlowConfig | null>(null);

  useEffect(() => {
    // 从 API 加载流程配置
    fetch('/api/flows/my-flow')
      .then(res => res.json())
      .then(setConfig);
  }, []);

  if (!config) return <div>加载中...</div>;

  return (
    <FlowDesigner
      config={config}
      onChange={setConfig}
      loaders={{
        // 动态加载审批人列表
        options: async (field) => {
          if (field.name === 'approvers') {
            const res = await fetch('/api/users');
            const users = await res.json();
            return users.map(u => ({
              label: u.name,
              value: u.id
            }));
          }
          return field.options || [];
        }
      }}
    />
  );
}
```

## 自定义节点

你可以创建自定义节点组件：

```tsx
import { Handle, Position } from 'reactflow';

interface CustomNodeProps {
  data: {
    title: string;
    description?: string;
  };
}

function CustomNode({ data }: CustomNodeProps) {
  return (
    <div style={{
      padding: '16px',
      border: '2px solid #1890ff',
      borderRadius: '8px',
      background: 'white'
    }}>
      <Handle type="target" position={Position.Top} />
      <div>
        <h3>{data.title}</h3>
        {data.description && <p>{data.description}</p>}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

// 使用自定义节点
<FlowDesigner
  config={config}
  onChange={setConfig}
  nodeComponents={{
    custom: CustomNode
  }}
/>
```

## 样式定制

```tsx
import 'reactflow/dist/style.css';

<FlowDesigner
  config={config}
  onChange={setConfig}
  theme="light"
  style={{
    width: '100%',
    height: '800px',
    border: '1px solid #e8e8e8',
    borderRadius: '8px'
  }}
  className="my-flow-designer"
/>
```

## 注意事项

1. **必须导入 ReactFlow 样式**：
   ```tsx
   import 'reactflow/dist/style.css';
   ```

2. **React 版本要求**：需要 React 18.0.0 或更高版本

3. **受控组件**：FlowDesigner 是完全受控的组件，需要通过 `config` 和 `onChange` 管理状态

4. **节点工具栏**：默认显示，可通过 `showToolbar={false}` 隐藏

## 相关链接

- [GitHub 仓库](https://github.com/xiaochenyang1/my-awesome-package)
- [问题反馈](https://github.com/xiaochenyang1/my-awesome-package/issues)
- [核心包文档](https://www.npmjs.com/package/@xiaoxiao6.0/flow-designer-core)
- [Vue 版本](https://www.npmjs.com/package/@xiaoxiao6.0/flow-designer-vue)

## License

MIT © xiaochenyang1
