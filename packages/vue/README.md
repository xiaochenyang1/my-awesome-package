# @xiaoxiao6.0/flow-designer-vue

> 流程设计器 Vue 3 适配器 - 基于 Vue Flow 的可视化流程编排组件

## 安装

```bash
npm install @xiaoxiao6.0/flow-designer-vue
```

或使用其他包管理器：

```bash
pnpm add @xiaoxiao6.0/flow-designer-vue
yarn add @xiaoxiao6.0/flow-designer-vue
```

## 特性

- 🎨 **Vue 3 组合式 API**：完全使用 Vue 3 Composition API 开发
- 🚀 **开箱即用**：提供完整的流程设计器组件
- 🔄 **双向绑定**：支持 v-model 进行数据绑定
- 📦 **轻量级**：基于 @vue-flow/core，性能优秀
- 💪 **TypeScript**：完整的类型定义支持
- 🎯 **框架集成**：与 Vue 3 完美集成

## 快速开始

### 基础使用

```vue
<template>
  <div>
    <FlowDesigner
      :config="flowConfig"
      @change="handleFlowChange"
      @node-double-click="handleNodeDoubleClick"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FlowDesigner, type FlowConfig } from '@xiaoxiao6.0/flow-designer-vue';

// 定义流程配置
const flowConfig = ref<FlowConfig>({
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

// 处理流程变化
const handleFlowChange = (newConfig: FlowConfig) => {
  flowConfig.value = newConfig;
  console.log('流程配置已更新:', newConfig);
};

// 处理节点双击
const handleNodeDoubleClick = (node: any) => {
  console.log('双击节点:', node);
  // 这里可以打开节点配置弹窗
};
</script>
```

### 使用 Composable

使用 `useFlowDesigner` composable 进行更精细的控制：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useFlowDesigner, type FlowConfig } from '@xiaoxiao6.0/flow-designer-vue';

const flowConfig = ref<FlowConfig>({
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
    console.log('配置已更新:', newConfig);
  }
});

// 添加节点
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
  console.log('验证结果:', result);
};
</script>
```

## API 文档

### FlowDesigner 组件

流程设计器主组件。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| config | FlowConfig | 必填 | 流程配置对象 |
| theme | 'light' \| 'dark' | 'light' | 主题 |
| showToolbar | boolean | true | 是否显示节点工具栏 |
| toolbarPosition | 'top' \| 'left' \| 'right' | 'top' | 工具栏位置 |
| availableNodeTypes | NodeTypeDefinition[] | 默认节点类型 | 可添加的节点类型 |
| style | Record<string, any> | {} | 自定义样式 |

#### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| change | (config: FlowConfig) | 配置变化时触发 |
| node-click | (node: NodeConfig) | 节点单击时触发 |
| node-double-click | (node: NodeConfig) | 节点双击时触发 |
| node-add | (nodeId: string, type: string) | 添加节点时触发 |
| node-delete | (nodeId: string) | 删除节点时触发 |
| edge-add | (source: string, target: string) | 添加连线时触发 |
| edge-delete | (edgeId: string) | 删除连线时触发 |

#### 示例

```vue
<FlowDesigner
  :config="flowConfig"
  theme="light"
  :show-toolbar="true"
  toolbar-position="top"
  @change="handleChange"
  @node-double-click="handleNodeDoubleClick"
/>
```

### useFlowDesigner Composable

流程设计器状态管理 composable。

#### 参数

```typescript
interface UseFlowDesignerOptions {
  config: Ref<FlowConfig> | FlowConfig;
  onChange?: (config: FlowConfig) => void;
  enableHistory?: boolean;
}
```

#### 返回值

```typescript
interface UseFlowDesignerReturn {
  config: Ref<FlowConfig>;          // 当前流程配置
  flowModel: FlowModel;             // 流程模型实例
  nodes: Ref<NodeConfig[]>;         // 所有节点
  edges: Ref<EdgeConfig[]>;         // 所有连线
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

```vue
<template>
  <div class="app">
    <h1>请假审批流程设计器</h1>

    <FlowDesigner
      :config="flowConfig"
      :show-toolbar="true"
      toolbar-position="top"
      @change="handleFlowChange"
      @node-double-click="handleNodeConfig"
    />

    <div class="actions">
      <button @click="handleSave">保存流程</button>
      <button @click="handleValidate">验证流程</button>
      <button @click="handleExport">导出配置</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FlowDesigner, type FlowConfig, type NodeConfig } from '@xiaoxiao6.0/flow-designer-vue';

const flowConfig = ref<FlowConfig>({
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
  flowConfig.value = newConfig;
};

const handleNodeConfig = (node: NodeConfig) => {
  console.log('配置节点:', node);
  // 打开节点配置弹窗
};

const handleSave = () => {
  console.log('保存流程:', flowConfig.value);
  // 调用后端API保存
};

const handleValidate = () => {
  // 验证流程逻辑
  console.log('验证流程');
};

const handleExport = () => {
  const json = JSON.stringify(flowConfig.value, null, 2);
  console.log('导出配置:', json);
};
</script>

<style scoped>
.app {
  padding: 20px;
}

.actions {
  margin-top: 20px;
  display: flex;
  gap: 12px;
}

button {
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  background: white;
  cursor: pointer;
}

button:hover {
  border-color: #1890ff;
  color: #1890ff;
}
</style>
```

## 自定义节点

你可以创建自定义节点组件：

```vue
<!-- CustomNode.vue -->
<template>
  <div class="custom-node">
    <Handle type="target" :position="Position.Top" />
    <div class="node-content">
      <h3>{{ data.title }}</h3>
      <p>{{ data.description }}</p>
    </div>
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';

interface Props {
  data: {
    title: string;
    description?: string;
  };
}

defineProps<Props>();
</script>

<style scoped>
.custom-node {
  padding: 16px;
  border: 2px solid #1890ff;
  border-radius: 8px;
  background: white;
}
</style>
```

然后在 FlowDesigner 中使用自定义节点。

## 相关链接

- [GitHub 仓库](https://github.com/xiaochenyang1/my-awesome-package)
- [问题反馈](https://github.com/xiaochenyang1/my-awesome-package/issues)
- [核心包文档](https://www.npmjs.com/package/@xiaoxiao6.0/flow-designer-core)
- [React 版本](https://www.npmjs.com/package/@xiaoxiao6.0/flow-designer-react)

## License

MIT © xiaochenyang1
