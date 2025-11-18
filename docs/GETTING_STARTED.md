# 快速开始指南 🚀

## 项目已搭建完成 ✅

恭喜！流程设计器项目已经按照完全数据驱动的架构搭建完成。

---

## 项目概览 📊

### 已完成的内容

#### ✅ 1. Monorepo 项目结构
- 使用 pnpm workspace 管理
- 多包架构，职责清晰

#### ✅ 2. Core 核心包 (`@flow-designer/core`)
- **完全框架无关**
- **零硬编码**
- 包含：
  - 类型定义（`types/`）
  - 配置引擎（`ConfigEngine`）
  - 事件引擎（`EventEngine`）
  - 流程模型（`FlowModel`）
  - 工具函数（`utils/`）

#### ✅ 3. React 适配器包 (`@flow-designer/react`)
- React 18 支持
- 包含：
  - `FlowDesigner` 主组件
  - `useFlowDesigner` Hook
  - `useDynamicForm` Hook

#### ✅ 4. React 示例项目
- 完整的使用示例
- 展示数据驱动的用法
- 展示动态加载选项

#### ✅ 5. 配置文件和文档
- 配置文件模板
- 完整的使用文档
- API 文档

---

## 下一步操作 🎯

### 1. 安装依赖

```bash
# 确保已安装 pnpm
npm install -g pnpm

# 在项目根目录安装依赖
pnpm install
```

### 2. 构建项目

```bash
# 构建所有包
pnpm build
```

### 3. 运行示例

```bash
# 进入示例项目
cd examples/react-example

# 运行开发服务器
pnpm dev

# 访问 http://localhost:3000
```

---

## 核心架构说明 🏗️

### 三层架构

```
┌─────────────────────────────────────────┐
│         应用层 (App Layer)               │
│    用户的 React/Vue 应用                 │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│       适配层 (Adapter Layer)             │
│   @flow-designer/react                   │
│   @flow-designer/vue (TODO)              │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│        核心层 (Core Layer)               │
│    @flow-designer/core                   │
│  - 数据模型                              │
│  - 配置引擎                              │
│  - 事件系统                              │
└─────────────────────────────────────────┘
```

### 数据流

```
用户操作 → 组件事件
         ↓
    FlowModel (状态管理)
         ↓
    EventEngine (事件发布)
         ↓
    onChange 回调
         ↓
    用户保存到外部 (API/数据库/配置中心)
```

---

## 核心设计原则 🎯

### 1. 零硬编码 ❌→✅

```typescript
// ❌ 错误示例：硬编码数据
const approvers = [
  { label: '张三', value: '1' },
  { label: '李四', value: '2' }
];

// ✅ 正确示例：动态加载
loaders={{
  options: async (field) => {
    const res = await fetch('/api/users');
    return res.json();
  }
}}
```

### 2. 数据外部化 📦

所有数据来源：
- ✅ JSON 配置文件
- ✅ REST API
- ✅ GraphQL
- ✅ 配置中心
- ✅ 数据库（通过 API）

### 3. 完全受控 🎮

```typescript
// 组件完全受控
<FlowDesigner
  config={config}              // 从外部传入
  onChange={setConfig}         // 状态由外部管理
/>
```

---

## 使用方式示例 📖

### 基础用法

```typescript
import { FlowDesigner } from '@flow-designer/react';
import { useState, useEffect } from 'react';

function App() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    // 从外部加载配置
    fetch('/configs/my-flow.json')
      .then(res => res.json())
      .then(setConfig);
  }, []);

  return (
    <FlowDesigner
      config={config}
      onChange={setConfig}
    />
  );
}
```

### 动态加载选项

```typescript
<FlowDesigner
  config={config}
  onChange={setConfig}
  loaders={{
    options: async (field) => {
      // 根据字段名加载不同的选项
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

### 自定义验证器

```typescript
<FlowDesigner
  config={config}
  validators={{
    uniqueEmail: async (value) => {
      const res = await fetch(`/api/check-email?email=${value}`);
      const { exists } = await res.json();
      return !exists;
    }
  }}
/>
```

---

## 目录结构说明 📂

```
flow-designer/
├── packages/
│   ├── core/                     # 核心包（框架无关）
│   │   ├── src/
│   │   │   ├── types/           # 类型定义（零硬编码）
│   │   │   ├── engine/          # 引擎（配置引擎、事件引擎）
│   │   │   ├── models/          # 模型（FlowModel）
│   │   │   └── utils/           # 工具函数
│   │   └── package.json
│   │
│   ├── react/                    # React 适配器
│   │   ├── src/
│   │   │   ├── components/      # 组件（FlowDesigner）
│   │   │   └── hooks/           # Hooks（useFlowDesigner, useDynamicForm）
│   │   └── package.json
│   │
│   └── vue/                      # Vue 适配器（TODO）
│
├── examples/
│   ├── react-example/            # React 示例（完整示例）
│   │   ├── src/
│   │   │   ├── App.tsx          # 主应用（展示用法）
│   │   │   └── main.tsx         # 入口文件
│   │   └── package.json
│   │
│   └── vue-example/              # Vue 示例（TODO）
│
├── configs/                      # 配置文件
│   ├── flow-config-template.json # 配置模板（仅结构）
│   └── README.md                # 配置说明
│
├── docs/                         # 文档
│   ├── 审批流程配置器设计文档.md
│   ├── 流程配置器架构设计-多框架版.md
│   └── 数据驱动架构设计文档.md
│
├── package.json                  # Root package.json
├── pnpm-workspace.yaml          # pnpm workspace 配置
├── README.md                    # 主文档
└── GETTING_STARTED.md           # 本文档
```

---

## 开发流程 🛠️

### 1. 开发核心包

```bash
cd packages/core

# 监听文件变化
pnpm dev

# 或手动构建
pnpm build
```

### 2. 开发 React 适配器

```bash
cd packages/react

# 监听文件变化
pnpm dev

# 或手动构建
pnpm build
```

### 3. 运行示例项目

```bash
cd examples/react-example

# 开发模式
pnpm dev

# 构建
pnpm build
```

---

## 扩展开发 🔧

### 添加新的节点类型

1. 在配置文件中定义：
```json
{
  "id": "custom-1",
  "type": "custom-approval",  // 自定义类型
  "title": "自定义审批",
  "config": { ... }
}
```

2. 注册自定义组件：
```typescript
<FlowDesigner
  config={config}
  nodeComponents={{
    'custom-approval': CustomApprovalNode  // 自定义组件
  }}
/>
```

### 添加新的表单字段类型

1. 在配置文件中定义：
```json
{
  "name": "customField",
  "label": "自定义字段",
  "type": "custom-input",  // 自定义类型
  "component": "MyCustomInput"
}
```

2. 注册自定义组件：
```typescript
<FlowDesigner
  config={config}
  formComponents={{
    'MyCustomInput': MyCustomInputComponent
  }}
/>
```

---

## 常见问题 ❓

### Q: 如何修改流程配置？

**A**: 有两种方式：

1. 直接修改配置文件（JSON）
2. 通过 API 动态修改

```typescript
// 方式 1: 修改配置文件
// 编辑 configs/my-flow.json

// 方式 2: 通过 API 修改
const newConfig = { ...config, name: '新流程名称' };
await fetch('/api/flows/123', {
  method: 'PUT',
  body: JSON.stringify(newConfig)
});
```

### Q: 如何添加新的审批人？

**A**: 不要在配置文件中硬编码审批人，而是通过 `loaders.options` 动态加载：

```typescript
loaders={{
  options: async (field) => {
    if (field.name === 'approvers') {
      const res = await fetch('/api/users');  // 从 API 加载
      return res.json();
    }
  }
}}
```

### Q: 如何保存配置？

**A**: 通过 `onChange` 回调，用户决定如何保存：

```typescript
onChange={async (newConfig) => {
  // 保存到 API
  await fetch('/api/flows/123', {
    method: 'PUT',
    body: JSON.stringify(newConfig)
  });

  // 或保存到本地存储
  localStorage.setItem('flow-config', JSON.stringify(newConfig));

  // 或保存到配置中心
  await configClient.set('flow.my-flow', newConfig);
}}
```

---

## 下一步计划 📅

### 短期（1-2 周）
- [ ] 完善 FlowDesigner 组件（集成 ReactFlow）
- [ ] 实现可视化拖拽功能
- [ ] 实现节点配置弹窗

### 中期（1 个月）
- [ ] 开发 Vue 适配器
- [ ] 添加更多示例
- [ ] 完善文档

### 长期（3 个月）
- [ ] 支持条件分支
- [ ] 支持并行节点
- [ ] 流程模板市场

---

## 资源链接 🔗

### 文档
- [主文档](./README.md)
- [配置文件说明](./configs/README.md)
- [架构设计文档](./docs/)

### 示例
- [React 示例](./examples/react-example/)

### 包
- [@flow-designer/core](./packages/core/)
- [@flow-designer/react](./packages/react/)

---

## 获取帮助 💬

遇到问题？
1. 查看文档
2. 查看示例代码
3. 提交 Issue

---

**祝开发愉快！** 🎉
