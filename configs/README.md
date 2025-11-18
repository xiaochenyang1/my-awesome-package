# 配置文件说明 📋

## 设计原则

### ✅ 应该做的
- 所有配置从外部文件、API 或数据库加载
- 使用模板文件作为参考，填充实际数据
- 选项数据通过 `loaders.options` 动态加载
- 验证规则通过 `validators` 自定义

### ❌ 不应该做的
- 在组件代码中硬编码业务数据
- 在代码中写死用户列表、角色列表等
- 将配置逻辑耦合到组件中

---

## 配置文件模板

### 流程配置模板
文件：`flow-config-template.json`

这是流程配置的结构模板，包含所有可用字段的说明和示例。

**使用方法：**
1. 复制模板文件
2. 删除 `$comment` 和 `$schema` 字段（这些是说明性字段）
3. 填充实际业务数据
4. 保存为新的配置文件

---

## 数据加载方式

### 方式 1：从 JSON 文件加载（静态配置）

```typescript
// 适用于：静态流程、开发环境、演示
const response = await fetch('/configs/my-flow.json');
const config = await response.json();
```

**优点：**
- 简单直接
- 无需后端
- 适合快速原型

**缺点：**
- 数据固定，不能动态修改
- 不适合生产环境

---

### 方式 2：从 REST API 加载（动态配置）

```typescript
// 适用于：生产环境、需要动态修改的场景
const response = await fetch('/api/flows/123');
const config = await response.json();

// 保存配置
await fetch('/api/flows/123', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(config)
});
```

**优点：**
- 数据动态，可以随时修改
- 支持权限控制
- 适合生产环境

**缺点：**
- 需要后端支持

---

### 方式 3：从配置中心加载（推荐）

```typescript
// 适用于：大型项目、微服务架构
import { ConfigClient } from '@your-company/config-client';

const configClient = new ConfigClient();

// 加载配置
const config = await configClient.get('flow.leave-approval');

// 监听配置变化（热更新）
configClient.watch('flow.leave-approval', (newConfig) => {
  setConfig(newConfig);
});

// 保存配置
await configClient.set('flow.leave-approval', config);
```

**优点：**
- 集中管理
- 支持热更新
- 适合大型项目

**缺点：**
- 需要配置中心支持（如 Apollo Config、Nacos）

---

## 动态加载选项数据

### 场景：审批人列表、角色列表、部门列表

配置文件中不应该写死这些数据，而是通过 `loaders.options` 动态加载：

```typescript
<FlowDesigner
  config={config}
  loaders={{
    options: async (field) => {
      // 根据字段名加载不同的选项
      if (field.name === 'approvers') {
        // 从 API 加载用户列表
        const res = await fetch('/api/users');
        const users = await res.json();
        return users.map(u => ({
          label: u.name,
          value: u.id
        }));
      }

      if (field.name === 'roles') {
        // 从 API 加载角色列表
        const res = await fetch('/api/roles');
        const roles = await res.json();
        return roles.map(r => ({
          label: r.name,
          value: r.id
        }));
      }

      if (field.name === 'departments') {
        // 从 API 加载部门列表
        const res = await fetch('/api/departments');
        const depts = await res.json();
        return depts.map(d => ({
          label: d.name,
          value: d.id
        }));
      }

      // 默认返回配置中的选项
      return field.options || [];
    }
  }}
/>
```

---

## 自定义验证器

### 场景：验证邮箱是否已存在、金额是否合理

```typescript
<FlowDesigner
  config={config}
  validators={{
    // 验证邮箱唯一性
    uniqueEmail: async (value) => {
      const res = await fetch(`/api/check-email?email=${value}`);
      const data = await res.json();
      return data.exists === false;
    },

    // 验证金额范围
    validateAmount: async (value) => {
      return value > 0 && value < 100000;
    }
  }}
/>
```

在配置文件中引用：

```json
{
  "name": "email",
  "label": "邮箱",
  "type": "input",
  "validation": [
    {
      "type": "custom",
      "validator": "uniqueEmail",
      "message": "该邮箱已被使用"
    }
  ]
}
```

---

## 配置文件示例

### 请假审批流程
文件路径：`/configs/leave-approval.json`

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
            "required": true
          },
          {
            "name": "dateRange",
            "label": "请假时间",
            "type": "dateRange",
            "required": true
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
    { "id": "e1", "source": "start-1", "target": "approval-1" },
    { "id": "e2", "source": "approval-1", "target": "end-1" }
  ]
}
```

---

## 最佳实践

### 1. 配置文件组织

```
configs/
├── flows/                    # 流程配置
│   ├── leave-approval.json
│   ├── expense-approval.json
│   └── purchase-approval.json
├── node-types/               # 节点类型定义
│   └── custom-nodes.json
└── templates/                # 模板
    └── flow-config-template.json
```

### 2. 环境变量配置

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api

# .env.production
VITE_API_BASE_URL=https://api.example.com
```

### 3. 配置验证

在加载配置后，使用 `validate()` 方法验证配置是否有效：

```typescript
const { valid, errors } = flowModel.validate();
if (!valid) {
  console.error('配置验证失败:', errors);
}
```

---

## 常见问题

### Q1: 配置文件中的选项数据可以写死吗？

**A**: 可以，但不推荐。如果选项数据是固定的（如性别、状态等），可以在配置文件中写死。但如果是动态数据（如用户、角色、部门），应该通过 `loaders.options` 动态加载。

### Q2: 如何处理大量配置文件？

**A**:
1. 使用配置中心（如 Apollo Config、Nacos）
2. 使用数据库存储，通过 API 读写
3. 使用 Git 管理配置文件版本

### Q3: 配置文件支持版本控制吗？

**A**: 支持。可以在配置文件中添加 `version` 字段，并在应用中检查版本兼容性。

---

## 总结

### 核心原则

1. **零硬编码** - 所有数据从外部加载
2. **动态配置** - 支持运行时修改
3. **灵活扩展** - 支持自定义字段和验证器
4. **职责分离** - 组件只负责渲染，数据由用户控制
