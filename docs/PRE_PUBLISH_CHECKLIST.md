# 发布前检查清单 ✅

在发布到 NPM 之前，请完成以下步骤：

---

## 🔧 必须完成的配置

### 1. 完善 package.json 的作者信息

需要在以下文件中添加 `author` 字段：

**文件位置**:
- `packages/core/package.json` (第 29 行)
- `packages/react/package.json` (第 29 行)

**修改方式**:

```json
{
  "author": "你的名字 <your.email@example.com>"
}
```

**示例**:
```json
{
  "author": "张三 <zhangsan@example.com>"
}
```

或者简单形式：
```json
{
  "author": "flow-designer-team"
}
```

---

### 2. 添加 repository 信息（强烈推荐）

如果你的项目已托管在 GitHub，建议添加 repository 字段。

**packages/core/package.json**:
```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/你的用户名/仓库名.git",
    "directory": "packages/core"
  },
  "bugs": {
    "url": "https://github.com/你的用户名/仓库名/issues"
  },
  "homepage": "https://github.com/你的用户名/仓库名#readme"
}
```

**packages/react/package.json**:
```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/你的用户名/仓库名.git",
    "directory": "packages/react"
  },
  "bugs": {
    "url": "https://github.com/你的用户名/仓库名/issues"
  },
  "homepage": "https://github.com/你的用户名/仓库名#readme"
}
```

**注意**: `directory` 字段用于 Monorepo，指明包在仓库中的位置。

---

## 📝 发布前验证步骤

### 1. 检查包名是否可用

在发布前，需要确认包名在 NPM 上是否可用：

```bash
# 检查 @flow-designer/core 是否已被占用
npm view @flow-designer/core

# 检查 @flow-designer/react 是否已被占用
npm view @flow-designer/react
```

**如果包名已被占用**:

方案 A: 修改 scope（组织名）
```json
{
  "name": "@你的用户名/flow-designer-core"
}
```

方案 B: 去掉 scope，使用唯一包名
```json
{
  "name": "my-unique-flow-designer-core"
}
```

方案 C: 创建 NPM 组织
- 访问 https://www.npmjs.com/org/create
- 创建名为 `flow-designer` 的组织
- 将自己添加为组织成员

---

### 2. 重新构建所有包

确保所有包都已正确构建：

```bash
# 清理旧的构建产物
pnpm clean

# 重新构建
pnpm build
```

**验证构建结果**:
```bash
# 检查构建产物
ls packages/core/dist
ls packages/react/dist

# 应该看到以下文件：
# - index.js (CommonJS)
# - index.d.ts (类型定义)
# - esm/index.js (ES Module)
```

---

### 3. 本地测试包（强烈推荐）

在发布前，建议先在本地测试包是否能正常使用：

**方法 1: 使用 npm pack**
```bash
# 在 core 包目录
cd packages/core
npm pack
# 生成 flow-designer-core-1.0.0.tgz

# 在 react 包目录
cd ../react
npm pack
# 生成 flow-designer-react-1.0.0.tgz

# 在测试项目中安装
cd /path/to/your/test-project
npm install /path/to/flow-designer-core-1.0.0.tgz
npm install /path/to/flow-designer-react-1.0.0.tgz
```

**方法 2: 使用 npm link**
```bash
# 在 core 包目录
cd packages/core
npm link

# 在 react 包目录
cd ../react
npm link @flow-designer/core
npm link

# 在测试项目中
cd /path/to/your/test-project
npm link @flow-designer/react
```

**方法 3: 使用本地示例项目**
```bash
# 运行现有的 React 示例
cd examples/react-example
pnpm dev

# 访问 http://localhost:5173 验证功能
```

---

### 4. 检查 NPM 账号

确保你已登录 NPM：

```bash
# 登录 NPM（如果还没登录）
npm login

# 验证登录状态
npm whoami

# 查看当前用户信息
npm profile get
```

**如果没有 NPM 账号**:
1. 访问 https://www.npmjs.com/signup
2. 注册账号
3. 验证邮箱（必须！）
4. 运行 `npm login` 登录

---

## 🚀 发布步骤

### 方案 A: 手动发布（推荐首次使用）

```bash
# 1. 发布 core 包
cd packages/core
npm publish --access public

# 2. 发布 react 包
cd ../react
npm publish --access public
```

**注意**: `--access public` 是必需的，因为 scoped packages（如 `@flow-designer/core`）默认是私有的。

### 方案 B: 使用 pnpm 批量发布

```bash
# 在项目根目录
pnpm -r publish --access public
```

---

## ✅ 发布后验证

### 1. 验证包已成功发布

```bash
# 查看包信息
npm view @flow-designer/core
npm view @flow-designer/react

# 查看包的所有版本
npm view @flow-designer/core versions
```

### 2. 在新项目中测试安装

```bash
# 创建测试项目
mkdir test-flow-designer
cd test-flow-designer
npm init -y

# 安装你发布的包
npm install @flow-designer/react

# 验证是否正确安装
ls node_modules/@flow-designer
```

### 3. 查看 NPM 官网

访问以下链接查看你的包：
- https://www.npmjs.com/package/@flow-designer/core
- https://www.npmjs.com/package/@flow-designer/react

---

## 📋 完整检查清单

在发布前，请确认以下所有项：

**必须项**:
- [ ] 已在 package.json 中填写 `author` 字段（或决定暂时留空）
- [ ] 已在 package.json 中填写 `repository` 字段（或决定暂时留空）
- [ ] 已检查包名在 NPM 上是否可用
- [ ] 已运行 `pnpm build` 并验证构建产物
- [ ] 已登录 NPM 账号（`npm whoami` 验证）
- [ ] 已验证 NPM 邮箱（必须！）

**推荐项**:
- [ ] 已在本地测试过包的功能
- [ ] 已阅读 [PUBLISH_GUIDE.md](./PUBLISH_GUIDE.md)
- [ ] 已准备好 CHANGELOG.md（记录版本变更）
- [ ] 已检查 README.md 的完整性
- [ ] 已确认 LICENSE 文件存在

**可选项**:
- [ ] 已配置 CI/CD 自动发布
- [ ] 已添加单元测试
- [ ] 已配置代码检查工具（ESLint, Prettier）

---

## 🎯 快速发布命令

如果以上所有检查都已完成，可以使用以下命令快速发布：

```bash
# 确保在项目根目录

# 1. 清理并重新构建
pnpm clean && pnpm build

# 2. 登录 NPM（如果还没登录）
npm login

# 3. 发布所有包
cd packages/core && npm publish --access public
cd ../react && npm publish --access public

# 或者使用 pnpm 批量发布
# pnpm -r publish --access public
```

---

## ❓ 常见问题

### 1. 发布时提示 "You do not have permission to publish"

**可能原因**:
- 包名已被其他人占用
- 你不是组织成员（对于 scoped packages）
- 邮箱未验证

**解决方案**:
- 修改包名
- 创建 NPM 组织并添加自己为成员
- 验证 NPM 邮箱

### 2. 发布时提示 "You must verify your email"

访问 NPM 官网，进入设置页面，验证你的邮箱。

### 3. 包名冲突怎么办？

使用以下方法之一：
1. 修改 scope（如 `@你的用户名/包名`）
2. 修改包名（如 `my-flow-designer-core`）
3. 创建 NPM 组织（如果 `@flow-designer` 可用）

### 4. 如何更新已发布的包？

```bash
# 1. 更新版本号
npm version patch  # 或 minor, major

# 2. 重新构建
pnpm build

# 3. 重新发布
npm publish
```

---

## 📚 相关文档

- [完整发布指南](./PUBLISH_GUIDE.md) - 详细的发布和使用说明
- [README.md](./README.md) - 项目使用文档
- [GETTING_STARTED.md](./GETTING_STARTED.md) - 快速开始指南
- [NPM 官方文档](https://docs.npmjs.com/cli/v10/commands/npm-publish)

---

**祝你发布顺利！** 🎉

如有问题，欢迎查阅 [PUBLISH_GUIDE.md](./PUBLISH_GUIDE.md) 获取更详细的帮助。
