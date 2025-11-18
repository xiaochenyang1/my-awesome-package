# NPM 发布和使用指南 📦

## 目录
- [发布前准备](#发布前准备)
- [发布到 NPM](#发布到-npm)
- [使用指南](#使用指南)
- [常见问题](#常见问题)

---

## 发布前准备 ✅

### 1. 完善 package.json 信息

需要在以下两个文件中添加作者和仓库信息：
- `packages/core/package.json`
- `packages/react/package.json`

添加以下字段：

```json
{
  "author": "你的名字 <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/flow-designer.git",
    "directory": "packages/core"  // core 包使用这个
  },
  "bugs": {
    "url": "https://github.com/your-username/flow-designer/issues"
  },
  "homepage": "https://github.com/your-username/flow-designer#readme"
}
```

### 2. 验证构建产物

```bash
# 清理并重新构建所有包
pnpm clean
pnpm build

# 验证构建产物是否正确
ls packages/core/dist
ls packages/react/dist
```

应该看到以下文件结构：
```
packages/core/dist/
├── index.js           # CommonJS 格式
├── index.d.ts         # TypeScript 类型定义
├── index.js.map       # Source Map
└── esm/
    ├── index.js       # ES Module 格式
    └── index.js.map
```

### 3. 本地测试包（推荐）

在发布前，建议先在本地测试包：

```bash
# 方法1: 使用 npm link
cd packages/core
npm link

cd ../react
npm link @flow-designer/core
npm link

# 在你的测试项目中
cd your-test-project
npm link @flow-designer/react

# 方法2: 使用 pnpm pack
cd packages/core
pnpm pack
# 会生成 flow-designer-core-1.0.0.tgz

cd ../react
pnpm pack
# 会生成 flow-designer-react-1.0.0.tgz

# 在测试项目中安装
npm install /path/to/flow-designer-core-1.0.0.tgz
npm install /path/to/flow-designer-react-1.0.0.tgz
```

---

## 发布到 NPM 🚀

### 前置条件

1. **注册 NPM 账号**
   - 访问 https://www.npmjs.com/signup
   - 注册账号并验证邮箱

2. **登录 NPM**
   ```bash
   npm login
   # 输入用户名、密码、邮箱
   ```

3. **配置组织（如果使用 @flow-designer scope）**
   - 访问 https://www.npmjs.com/org/create
   - 创建组织名为 `flow-designer`
   - 或者修改包名去掉 `@flow-designer/` 前缀

### 发布步骤

#### 方法1: 手动发布（推荐第一次使用）

```bash
# 1. 确保已经构建
pnpm build

# 2. 发布 core 包
cd packages/core
npm publish --access public

# 3. 发布 react 包（依赖 core，所以要后发布）
cd ../react
npm publish --access public
```

#### 方法2: 使用脚本批量发布

在根目录的 `package.json` 中添加发布脚本：

```json
{
  "scripts": {
    "publish:all": "pnpm -r publish --access public",
    "prepublish": "pnpm build"
  }
}
```

然后执行：
```bash
pnpm publish:all
```

### 版本管理

使用语义化版本（Semantic Versioning）：

```bash
# 补丁版本（bug 修复）: 1.0.0 -> 1.0.1
npm version patch

# 次版本（新功能）: 1.0.0 -> 1.1.0
npm version minor

# 主版本（破坏性变更）: 1.0.0 -> 2.0.0
npm version major
```

### 发布检查清单

- [ ] 所有测试通过
- [ ] 构建成功（`pnpm build`）
- [ ] README.md 完整
- [ ] LICENSE 文件存在
- [ ] package.json 信息完整（name, version, description, author, repository）
- [ ] 本地测试通过
- [ ] 登录到 NPM（`npm whoami`）

---

## 使用指南 📖

发布成功后，其他开发者可以这样使用你的包：

### 安装

```bash
# 使用 npm
npm install @flow-designer/react

# 使用 pnpm
pnpm add @flow-designer/react

# 使用 yarn
yarn add @flow-designer/react
```

**注意**: `@flow-designer/core` 会作为 `@flow-designer/react` 的依赖自动安装，无需手动安装。

### 基础使用示例

#### 1. React 项目中使用

```tsx
import React from 'react';
import { FlowDesigner } from '@flow-designer/react';
import 'reactflow/dist/style.css';

function App() {
  const config = {
    nodes: [
      {
        id: 'start',
        type: 'start',
        position: { x: 100, y: 100 },
        data: { label: '开始' }
      }
    ],
    edges: [],
    nodeTypes: {
      start: {
        label: '开始节点',
        color: '#4CAF50',
        icon: '🚀',
        fields: []
      }
    }
  };

  const handleSave = (flowData) => {
    console.log('保存流程数据:', flowData);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <FlowDesigner
        config={config}
        onSave={handleSave}
      />
    </div>
  );
}

export default App;
```

#### 2. 完整的审批流程示例

```tsx
import React, { useState } from 'react';
import { FlowDesigner } from '@flow-designer/react';

// 从 JSON 文件或 API 加载配置
import flowConfig from './flow-config.json';

function ApprovalFlow() {
  const [flowData, setFlowData] = useState(null);

  // 动态选项加载函数
  const optionLoaders = {
    async getDepartments() {
      const response = await fetch('/api/departments');
      const departments = await response.json();
      return departments.map(dept => ({
        label: dept.name,
        value: dept.id
      }));
    },
    async getUsers(deptId) {
      const response = await fetch(`/api/users?dept=${deptId}`);
      const users = await response.json();
      return users.map(user => ({
        label: user.name,
        value: user.id
      }));
    }
  };

  // 自定义验证器
  const validators = {
    minAmount: (value) => {
      if (value < 1000) {
        return '金额不能小于1000元';
      }
      return null;
    }
  };

  const handleSave = (data) => {
    console.log('流程配置已保存:', data);
    setFlowData(data);

    // 保存到后端
    fetch('/api/workflow/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <FlowDesigner
        config={flowConfig}
        optionLoaders={optionLoaders}
        validators={validators}
        onSave={handleSave}
      />
    </div>
  );
}

export default ApprovalFlow;
```

#### 3. 配置文件示例 (flow-config.json)

```json
{
  "nodes": [
    {
      "id": "start",
      "type": "start",
      "position": { "x": 100, "y": 100 },
      "data": { "label": "开始" }
    }
  ],
  "edges": [],
  "nodeTypes": {
    "approval": {
      "label": "审批节点",
      "color": "#2196F3",
      "icon": "✓",
      "fields": [
        {
          "name": "approver",
          "label": "审批人",
          "type": "select",
          "required": true,
          "options": [],
          "loadOptions": "getUsers"
        },
        {
          "name": "timeout",
          "label": "超时时间（小时）",
          "type": "number",
          "defaultValue": 24,
          "validation": "minAmount"
        }
      ]
    },
    "condition": {
      "label": "条件分支",
      "color": "#FF9800",
      "icon": "?",
      "fields": [
        {
          "name": "field",
          "label": "判断字段",
          "type": "select",
          "required": true,
          "options": [
            { "label": "金额", "value": "amount" },
            { "label": "部门", "value": "department" }
          ]
        },
        {
          "name": "operator",
          "label": "运算符",
          "type": "select",
          "required": true,
          "options": [
            { "label": "大于", "value": ">" },
            { "label": "小于", "value": "<" },
            { "label": "等于", "value": "==" }
          ]
        },
        {
          "name": "value",
          "label": "比较值",
          "type": "text",
          "required": true
        }
      ]
    }
  }
}
```

### TypeScript 支持

包已包含完整的 TypeScript 类型定义：

```typescript
import type {
  FlowConfig,
  NodeConfig,
  FieldConfig,
  FlowDesignerProps
} from '@flow-designer/react';

// 类型安全的配置
const config: FlowConfig = {
  nodes: [],
  edges: [],
  nodeTypes: {
    custom: {
      label: '自定义节点',
      color: '#FF5722',
      icon: '⚙️',
      fields: []
    }
  }
};
```

### API 文档

详细的 API 文档请参考：
- [完整 README](./README.md)
- [配置说明](./configs/README.md)
- [快速开始](./GETTING_STARTED.md)

---

## 包信息 📋

### @flow-designer/core

**核心包**，框架无关的流程设计器引擎。

- **npm**: `npm install @flow-designer/core`
- **包大小**: ~50KB (未压缩)
- **依赖**: 无外部依赖
- **支持**: CommonJS + ES Module
- **TypeScript**: ✅ 完整类型定义

**主要导出**:
```typescript
import {
  ConfigEngine,      // 配置引擎
  EventEngine,       // 事件引擎
  FlowModel,         // 流程模型
  utils              // 工具函数
} from '@flow-designer/core';
```

### @flow-designer/react

**React 适配器**，基于 ReactFlow 的 React 组件。

- **npm**: `npm install @flow-designer/react`
- **包大小**: ~120KB (未压缩)
- **依赖**:
  - @flow-designer/core (自动安装)
  - reactflow ^11.11.4 (自动安装)
- **peerDependencies**:
  - react ^18.0.0
  - react-dom ^18.0.0
- **支持**: CommonJS + ES Module
- **TypeScript**: ✅ 完整类型定义

**主要导出**:
```typescript
import {
  FlowDesigner,      // 主组件
  useFlowDesigner,   // 流程设计器 Hook
  useDynamicForm     // 动态表单 Hook
} from '@flow-designer/react';
```

---

## 常见问题 ❓

### 1. 发布时提示 "You do not have permission to publish"

**原因**: 包名已被占用或你没有权限发布到该 scope。

**解决方案**:
- 如果使用 scope（如 `@flow-designer/core`），确保你是组织成员
- 或者修改包名为唯一的名称
- 使用 `--access public` 发布公共包

### 2. 安装后提示找不到模块

**原因**: 包的入口文件配置错误。

**检查**:
```json
{
  "main": "dist/index.js",      // ✅ 正确
  "module": "dist/esm/index.js", // ✅ 正确
  "types": "dist/index.d.ts"     // ✅ 正确
}
```

确保 `dist` 目录已构建并包含在发布内容中。

### 3. TypeScript 类型定义不生效

**原因**: 类型定义文件未正确生成或导出。

**解决方案**:
1. 确保 `tsconfig.json` 中设置了 `"declaration": true`
2. 检查 `package.json` 中的 `types` 字段
3. 重新构建: `pnpm build`

### 4. workspace 依赖如何处理

**开发时**: 使用 `workspace:*` 引用本地包
```json
{
  "dependencies": {
    "@flow-designer/core": "workspace:*"
  }
}
```

**发布时**: pnpm 会自动替换为实际版本号
```json
{
  "dependencies": {
    "@flow-designer/core": "^1.0.0"
  }
}
```

### 5. 如何更新已发布的包

```bash
# 1. 修改代码
# 2. 更新版本号
npm version patch  # 或 minor, major

# 3. 重新构建
pnpm build

# 4. 发布
npm publish
```

### 6. 如何撤回已发布的版本

```bash
# 撤回指定版本（发布后24小时内）
npm unpublish @flow-designer/core@1.0.0

# 撤回整个包（谨慎使用）
npm unpublish @flow-designer/core --force
```

**注意**: NPM 政策限制，发布后 24 小时内可以撤回，之后只能废弃（deprecate）。

### 7. 如何标记版本为废弃

```bash
npm deprecate @flow-designer/core@1.0.0 "请升级到 1.0.1 版本"
```

---

## 发布后的维护 🔧

### 1. 版本管理策略

遵循语义化版本：
- **主版本号 (MAJOR)**: 不兼容的 API 变更
- **次版本号 (MINOR)**: 向后兼容的功能新增
- **修订号 (PATCH)**: 向后兼容的问题修复

### 2. CHANGELOG.md

建议维护 CHANGELOG.md 记录版本变更：

```markdown
# Changelog

## [1.0.1] - 2025-01-18
### Fixed
- 修复了表单验证的 bug

### Changed
- 优化了配置加载性能

## [1.0.0] - 2025-01-15
### Added
- 初始版本发布
- 完整的流程设计器功能
```

### 3. 持续集成（推荐）

配置 GitHub Actions 自动发布：

```yaml
# .github/workflows/publish.yml
name: Publish to NPM

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: pnpm install
      - run: pnpm build
      - run: pnpm -r publish --access public
        env:
          NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}
```

---

## 附录 📚

### 相关链接

- **NPM 官网**: https://www.npmjs.com/
- **NPM 文档**: https://docs.npmjs.com/
- **语义化版本**: https://semver.org/
- **ReactFlow 文档**: https://reactflow.dev/

### 示例项目

完整的使用示例请查看：
- [React 示例](./examples/react-example/)
- [配置模板](./configs/flow-config-template.json)

---

**祝你发布成功！** 🎉

如有问题，欢迎提 Issue 或 PR。
