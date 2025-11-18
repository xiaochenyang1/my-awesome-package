# 流程设计器 - Flow Designer 🚀

> 可拖拽的流程编排组件 - 完全数据驱动，零硬编码，支持 React 和 Vue

## 核心设计理念 🎯

### 零硬编码 Zero Hard-Coded Data
- ❌ 组件内部不包含任何业务数据
- ✅ 所有数据从外部传入（JSON/API/数据库/配置中心）
- ✅ 完全可配置，完全可扩展

### 数据驱动 Data-Driven
- 流程配置：从外部加载
- 选项数据：动态加载
- 验证规则：自定义
- 业务逻辑：通过回调传入

### 框架无关 Framework-Agnostic
- 核心逻辑：纯 TypeScript，不依赖任何框架
- React 适配器：`@xiaoxiao6.0/flow-designer-react` ✅
- Vue 适配器：`@xiaoxiao6.0/flow-designer-vue` ✅

---

## 项目结构 📂

```
flow-designer/
├── packages/
│   ├── core/                      # 核心包（框架无关）
│   │   ├── src/
│   │   │   ├── types/             # 类型定义
│   │   │   ├── engine/            # 配置引擎、事件引擎
│   │   │   ├── models/            # 流程模型
│   │   │   └── utils/             # 工具函数
│   │   └── package.json
│   │
│   ├── react/                     # React 适配器
│   │   ├── src/
│   │   │   ├── components/        # React 组件
│   │   │   └── hooks/             # React Hooks
│   │   └── package.json
│   │
│   └── vue/                       # Vue 3 适配器
│   │   ├── src/
│   │   │   ├── components/        # Vue 组件
│   │   │   └── composables/       # Composables
│   │   └── package.json
│
├── examples/
│   └── react-example/             # React 示例项目
│
├── configs/                       # 配置文件和模板
├── docs/                          # 文档
└── README.md
```

---

## 快速开始 🚀

### NPM 包安装

```bash
# React 项目
npm install @xiaoxiao6.0/flow-designer-react

# Vue 3 项目
npm install @xiaoxiao6.0/flow-designer-vue

# 仅使用核心包（框架无关）
npm install @xiaoxiao6.0/flow-designer-core
```

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/xiaochenyang1/my-awesome-package.git

# 安装依赖
pnpm install

# 运行 React 示例
cd examples/react-example
pnpm dev
```

---

## 使用方式 📖

### React 使用示例

#### 1. 从 JSON 文件加载配置

```tsx
import { FlowDesigner } from '@xiaoxiao6.0/flow-designer-react';
import { useState, useEffect } from 'react';

function App() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    // 从 JSON 文件加载
    fetch('/configs/my-flow.json')
      .then(res => res.json())
      .then(setConfig);
  }, []);

  if (!config) return <div>加载中...</div>;

  return (
    <FlowDesigner
      config={config}
      onChange={setConfig}
    />
  );
}
```

#### 2. 从 API 动态加载配置

```tsx
function App() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    // 从 API 加载
    fetch('/api/flows/leave-approval')
      .then(res => res.json())
      .then(setConfig);
  }, []);

  const handleSave = async (newConfig) => {
    // 保存到 API
    await fetch('/api/flows/leave-approval', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newConfig)
    });
    setConfig(newConfig);
  };

  return (
    <FlowDesigner
      config={config}
      onChange={handleSave}
    />
  );
}
```

#### 3. 动态加载选项数据

```tsx
<FlowDesigner
  config={config}
  onChange={setConfig}
  loaders={{
    // 动态加载选项（如：审批人列表）
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
```

#### 4. 自定义验证器

```tsx
<FlowDesigner
  config={config}
  validators={{
    // 验证邮箱唯一性
    uniqueEmail: async (value) => {
      const res = await fetch(`/api/check-email?email=${value}`);
      const { exists } = await res.json();
      return !exists;
    }
  }}
/>
```

### Vue 使用示例

#### 1. 基础使用

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
    }
  ],
  edges: [],
  settings: {}
});

const handleFlowChange = (newConfig: FlowConfig) => {
  flowConfig.value = newConfig;
  console.log('流程配置已更新:', newConfig);
};

const handleNodeDoubleClick = (node: any) => {
  console.log('双击节点:', node);
};
</script>
```

#### 2. 使用 Composable

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
  nodes,
  edges,
  addNode,
  updateNode,
  validate
} = useFlowDesigner({
  config: flowConfig,
  onChange: (newConfig) => {
    console.log('配置已更新:', newConfig);
  }
});

// 添加节点
const handleAddNode = () => {
  addNode({
    id: `approval-${Date.now()}`,
    type: 'approval',
    title: '审批节点',
    config: {}
  });
};
</script>
```

---

## API 文档 📚

### FlowDesigner Props

```typescript
interface FlowDesignerProps {
  // ========== 数据（必须从外部传入） ==========

  /** 流程配置（从 JSON/API/数据库加载） */
  config: FlowConfig;

  /** 配置变化回调 */
  onChange?: (config: FlowConfig) => void;

  // ========== 数据加载器（可选） ==========

  /** 数据加载器 */
  loaders?: {
    /** 动态加载选项数据 */
    options?: (field: FormFieldSchema) => Promise<OptionSchema[]>;

    /** 动态加载初始值 */
    initialValues?: (nodeId: string) => Promise<Record<string, any>>;
  };

  // ========== 组件注册（可选） ==========

  /** 自定义节点组件 */
  nodeComponents?: Record<string, React.ComponentType<any>>;

  /** 自定义表单组件 */
  formComponents?: Record<string, React.ComponentType<any>>;

  /** 自定义验证器 */
  validators?: Record<string, (value: any) => boolean | Promise<boolean>>;

  // ========== 事件回调 ==========

  onNodeClick?: (node: NodeConfig) => void;
  onNodeDoubleClick?: (node: NodeConfig) => void;
  onNodeAdd?: (parentId: string, type: string) => void;
  onNodeDelete?: (nodeId: string) => void;
}
```

### 配置文件结构

```typescript
interface FlowConfig {
  id: string;                    // 流程 ID
  name: string;                  // 流程名称
  version: string;               // 版本号
  description?: string;          // 描述
  nodes: NodeConfig[];           // 节点列表
  edges: EdgeConfig[];           // 连线列表
  settings?: FlowSettings;       // 流程设置
}

interface NodeConfig {
  id: string;                    // 节点 ID
  type: string;                  // 节点类型（用户自定义）
  title: string;                 // 节点标题
  config: {
    formSchema?: FormFieldSchema[];  // 表单字段配置
    formValues?: Record<string, any>; // 表单值
    [key: string]: any;               // 自定义配置
  };
  children?: string[];           // 子节点 ID
}
```

---

## 配置示例 📋

### 请假审批流程

```json
{
  "id": "leave-approval",
  "name": "请假审批流程",
  "version": "1.0.0",
  "nodes": [
    {
      "id": "start-1",
      "type": "start",
      "title": "发起请假",
      "config": {
        "formSchema": [
          {
            "name": "reason",
            "label": "请假原因",
            "type": "textarea",
            "required": true,
            "validation": [
              {
                "type": "min",
                "value": 10,
                "message": "请假原因至少 10 个字"
              }
            ]
          },
          {
            "name": "dateRange",
            "label": "请假时间",
            "type": "dateRange",
            "required": true
          },
          {
            "name": "type",
            "label": "请假类型",
            "type": "radio",
            "options": [
              { "label": "事假", "value": "personal" },
              { "label": "病假", "value": "sick" }
            ]
          }
        ]
      },
      "children": ["approval-1"]
    },
    {
      "id": "approval-1",
      "type": "approval",
      "title": "部门审批",
      "config": {
        "formSchema": [
          {
            "name": "approver",
            "label": "审批人",
            "type": "select",
            "required": true
          }
        ]
      },
      "children": ["end-1"]
    },
    {
      "id": "end-1",
      "type": "end",
      "title": "完成",
      "config": {}
    }
  ],
  "edges": [
    { "id": "e1", "source": "start-1", "target": "approval-1", "label": "提交" },
    { "id": "e2", "source": "approval-1", "target": "end-1", "label": "通过" }
  ]
}
```

更多配置示例请查看 `configs/` 目录。

---

## 核心特性 ✨

### 1. 完全数据驱动
- 所有配置从外部加载
- 支持 JSON 文件、REST API、GraphQL、配置中心等多种数据源
- 运行时可动态修改

### 2. 零硬编码
- 组件内部不包含任何业务数据
- 审批人列表、角色列表等通过 `loaders.options` 动态加载
- 验证规则通过 `validators` 自定义

### 3. 动态表单
- 支持 15+ 种表单类型（input、textarea、select、radio、checkbox、date、dateRange 等）
- 支持条件显示（`visible` 表达式）
- 支持条件禁用（`disabled` 表达式）
- 支持自定义组件

### 4. 框架无关
- 核心逻辑完全独立（`@xiaoxiao6.0/flow-designer-core`）
- 可适配任何前端框架
- 当前支持：React、Vue 3
- 计划支持：Angular、Svelte

### 5. TypeScript 类型安全
- 完整的类型定义
- IDE 智能提示
- 编译时错误检查

---

## 开发指南 🛠️

### 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install
```

### 构建

```bash
# 构建所有包
pnpm build

# 构建 core 包
cd packages/core && pnpm build

# 构建 react 包
cd packages/react && pnpm build
```

### 开发模式

```bash
# 监听文件变化，自动重新构建
pnpm dev
```

---

## 设计原则 🎯

### 1. 零硬编码
- ❌ 组件内部不应包含任何业务数据
- ❌ 不应在代码中写死用户列表、角色列表等
- ✅ 所有数据从外部传入
- ✅ 所有配置都是动态的

### 2. 职责分离
- **组件职责**：渲染 UI + 处理交互
- **用户职责**：提供数据 + 保存数据
- **配置引擎**：解析配置 + 验证数据

### 3. 完全可控
- 组件完全受控
- 数据流单向
- 状态由用户管理

### 4. 高度可扩展
- 节点类型可扩展
- 表单组件可扩展
- 验证器可扩展
- 渲染引擎可替换

---

## 最佳实践 💡

### 1. 数据来源

```typescript
// ✅ 推荐：从 API 加载
const config = await fetch('/api/flows/123').then(r => r.json());

// ✅ 推荐：从配置中心加载
const config = await configClient.get('flow.leave-approval');

// ⚠️ 可以：从 JSON 文件加载（仅用于开发/演示）
import config from './flow-config.json';

// ❌ 不推荐：在代码中硬编码
const config = { id: '123', name: '流程', ... };
```

### 2. 选项数据加载

```typescript
// ✅ 推荐：通过 loaders.options 动态加载
loaders={{
  options: async (field) => {
    const res = await fetch(`/api/options/${field.name}`);
    return res.json();
  }
}}

// ❌ 不推荐：在配置文件中硬编码大量选项
{
  "options": [
    { "label": "用户1", "value": "1" },
    { "label": "用户2", "value": "2" },
    // ... 100 个用户
  ]
}
```

### 3. 配置保存

```typescript
// ✅ 推荐：保存到 API
onChange={async (newConfig) => {
  await fetch('/api/flows/123', {
    method: 'PUT',
    body: JSON.stringify(newConfig)
  });
}}

// ✅ 推荐：保存到配置中心
onChange={async (newConfig) => {
  await configClient.set('flow.leave-approval', newConfig);
}}

// ⚠️ 可以：保存到本地存储（仅用于开发）
onChange={(newConfig) => {
  localStorage.setItem('flow-config', JSON.stringify(newConfig));
}}
```

---

## 路线图 🗺️

### v1.0（当前版本）✅
- [x] 核心包（`@xiaoxiao6.0/flow-designer-core`）
- [x] React 适配器（`@xiaoxiao6.0/flow-designer-react`）
- [x] Vue 3 适配器（`@xiaoxiao6.0/flow-designer-vue`）
- [x] 完整的拖拽功能（基于 ReactFlow / VueFlow）
- [x] 可视化画布
- [x] 动态表单支持
- [x] 配置引擎
- [x] 事件系统
- [x] 节点工具栏
- [x] 示例项目
- [x] 完整文档

### v1.1（计划中）
- [ ] 节点配置弹窗（动态表单）
- [ ] 完整的表单字段验证
- [ ] 数据加载器（loaders）集成

### v1.2（计划中）
- [ ] 条件分支支持
- [ ] 并行节点支持
- [ ] 撤销/重做
- [ ] 小地图
- [ ] 导出为图片

### v2.0（远期）
- [ ] Angular 适配器
- [ ] Svelte 适配器
- [ ] 低代码平台集成
- [ ] 流程模板市场

---

## 常见问题 ❓

### Q1: 为什么要零硬编码？
**A**: 硬编码会导致代码难以维护和扩展。通过数据驱动，用户可以自由控制数据来源和保存方式，组件只负责渲染，职责清晰。

### Q2: 配置文件可以包含业务数据吗？
**A**: 可以，但不推荐。固定的选项（如性别、状态）可以写在配置文件中，但动态数据（如用户、角色）应该通过 `loaders.options` 动态加载。

### Q3: 如何扩展自定义节点类型？
**A**: 通过 `nodeComponents` 传入自定义组件，配置文件中使用对应的 `type` 即可。

### Q4: 支持哪些前端框架？
**A**: 当前支持 React 和 Vue 3。核心包（`@xiaoxiao6.0/flow-designer-core`）是框架无关的，可以适配任何框架。Angular 和 Svelte 版本计划中。

---

## 贡献指南 🤝

欢迎贡献代码、报告问题、提出建议！

### 开发流程
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 提交 Pull Request

---

## 许可证 📄

MIT © [Your Name]

---

## 文档资源 📚

查看更多详细文档，请访问 [docs 目录](./docs/)：

### 📖 入门指南
- [快速开始指南](./docs/GETTING_STARTED.md) - 项目搭建完成后的使用指南
- [调试指南](./docs/调试指南.md) - 开发调试和问题排查

### 📦 发布指南
- [NPM 包封装指南](./docs/NPM包封装指南.md) - NPM 包封装完整教程
- [发布前检查清单](./docs/PRE_PUBLISH_CHECKLIST.md) - 发布前必须完成的检查项
- [NPM 发布和使用指南](./docs/PUBLISH_GUIDE.md) - 详细的发布和使用说明

### 🏗️ 架构设计
- [数据驱动架构设计](./docs/数据驱动架构设计文档.md) - 核心设计理念
- [多框架架构设计](./docs/流程配置器架构设计-多框架版.md) - 多框架适配架构
- [审批流程设计](./docs/审批流程配置器设计文档.md) - 审批流程设计细节
- [流程编排组件设计](./docs/流程编排组件设计文档.md) - 流程编排组件设计

---

## 鸣谢 🙏

感谢所有贡献者！
