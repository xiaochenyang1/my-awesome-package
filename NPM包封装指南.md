# NPM 包封装完整指南 📦

## 目录
- [1. 项目初始化](#1-项目初始化)
- [2. 项目结构设计](#2-项目结构设计)
- [3. 核心代码编写](#3-核心代码编写)
- [4. 配置文件详解](#4-配置文件详解)
- [5. 构建与打包](#5-构建与打包)
- [6. 测试](#6-测试)
- [7. 文档编写](#7-文档编写)
- [8. 发布到 NPM](#8-发布到-npm)
- [9. 版本管理](#9-版本管理)
- [10. 最佳实践](#10-最佳实践)

---

## 1. 项目初始化

### 1.1 创建项目目录
```bash
mkdir my-awesome-package
cd my-awesome-package
```

### 1.2 初始化 package.json
```bash
npm init -y
```

### 1.3 初始化 Git（可选但推荐）
```bash
git init
echo "node_modules" > .gitignore
echo "dist" >> .gitignore
```

---

## 2. 项目结构设计

### 2.1 推荐的目录结构

```
my-awesome-package/
├── src/                    # 源代码目录
│   ├── index.js           # 主入口文件
│   ├── utils/             # 工具函数
│   └── core/              # 核心功能模块
├── dist/                  # 构建输出目录
├── test/                  # 测试文件目录
│   └── index.test.js
├── examples/              # 使用示例
│   └── demo.js
├── .gitignore            # Git 忽略配置
├── .npmignore            # NPM 发布忽略配置
├── package.json          # 包配置文件
├── README.md             # 使用文档
├── LICENSE               # 开源协议
└── CHANGELOG.md          # 版本更新日志
```

### 2.2 创建基础结构
```bash
mkdir src dist test examples
```

---

## 3. 核心代码编写

### 3.1 代码规范建议

#### JavaScript 项目
```javascript
// src/index.js

/**
 * 你的工具库主入口
 * @author 你的名字
 * @version 1.0.0
 */

// 导入子模块
import { formatDate } from './utils/date.js';
import { request } from './core/http.js';

// 导出主功能
export { formatDate, request };

// 默认导出
export default {
  formatDate,
  request
};
```

#### TypeScript 项目（推荐）
```typescript
// src/index.ts

/**
 * 格式化日期
 * @param date 日期对象
 * @param format 格式字符串
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date, format: string): string {
  // 实现代码
  return '';
}

// 类型定义
export interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
}

export default {
  formatDate
};
```

### 3.2 编写原则
- ✅ 功能单一，职责明确
- ✅ 提供清晰的类型定义（TypeScript）
- ✅ 完善的注释和文档
- ✅ 错误处理和边界检查
- ✅ 避免依赖过多第三方库

---

## 4. 配置文件详解

### 4.1 package.json 关键配置

```json
{
  "name": "my-awesome-package",
  "version": "1.0.0",
  "description": "一个简短清晰的描述",
  "main": "dist/index.js",                    // CommonJS 入口
  "module": "dist/index.esm.js",              // ESM 入口
  "types": "dist/index.d.ts",                 // TypeScript 类型定义
  "files": [                                  // 发布时包含的文件
    "dist",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "rollup -c",                     // 构建命令
    "test": "jest",                           // 测试命令
    "prepublishOnly": "npm run build"         // 发布前自动构建
  },
  "keywords": [                               // 搜索关键词
    "utility",
    "tools",
    "helper"
  ],
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/username/my-awesome-package"
  },
  "bugs": {
    "url": "https://github.com/username/my-awesome-package/issues"
  },
  "homepage": "https://github.com/username/my-awesome-package#readme",
  "devDependencies": {
    // 开发依赖
  },
  "dependencies": {
    // 生产依赖（尽量少）
  }
}
```

### 4.2 .npmignore 配置

```
# 源代码（只发布构建后的代码）
src/
test/
examples/

# 配置文件
.gitignore
.eslintrc
.prettierrc
tsconfig.json
rollup.config.js

# 其他
*.log
.DS_Store
coverage/
```

---

## 5. 构建与打包

### 5.1 使用 Rollup（推荐）

#### 安装依赖
```bash
npm install --save-dev rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs @rollup/plugin-typescript
```

#### 配置文件 rollup.config.js
```javascript
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',        // CommonJS 格式
      exports: 'auto'
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm'         // ES Module 格式
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',        // UMD 格式（浏览器）
      name: 'MyPackage'
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' })
  ],
  external: ['lodash']  // 外部依赖，不打包进去
};
```

### 5.2 TypeScript 配置 tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2015",
    "module": "ESNext",
    "declaration": true,
    "declarationDir": "./dist",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "test"]
}
```

---

## 6. 测试

### 6.1 安装 Jest
```bash
npm install --save-dev jest @types/jest
```

### 6.2 编写测试用例
```javascript
// test/index.test.js

import { formatDate } from '../src/index';

describe('formatDate', () => {
  test('应该正确格式化日期', () => {
    const date = new Date('2024-01-01');
    const result = formatDate(date, 'YYYY-MM-DD');
    expect(result).toBe('2024-01-01');
  });

  test('应该处理无效输入', () => {
    expect(() => formatDate(null, 'YYYY')).toThrow();
  });
});
```

### 6.3 配置测试命令
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## 7. 文档编写

### 7.1 README.md 模板

```markdown
# My Awesome Package

> 简洁明了的一句话描述

## 特性

- ✨ 特性 1
- 🚀 特性 2
- 📦 特性 3

## 安装

\`\`\`bash
npm install my-awesome-package
# 或
yarn add my-awesome-package
\`\`\`

## 快速开始

\`\`\`javascript
import { formatDate } from 'my-awesome-package';

const result = formatDate(new Date(), 'YYYY-MM-DD');
console.log(result); // 2024-01-01
\`\`\`

## API 文档

### formatDate(date, format)

格式化日期对象

**参数：**
- `date` (Date): 要格式化的日期对象
- `format` (string): 格式字符串

**返回：**
- (string): 格式化后的日期字符串

**示例：**
\`\`\`javascript
formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss');
\`\`\`

## 许可证

MIT © [Your Name]
\`\`\`

---

## 8. 发布到 NPM

### 8.1 注册 NPM 账号
访问 https://www.npmjs.com/ 注册账号

### 8.2 登录 NPM
```bash
npm login
```
输入用户名、密码和邮箱

### 8.3 检查包名是否可用
```bash
npm search my-awesome-package
```

### 8.4 发布前检查清单
- ✅ 确保 package.json 配置正确
- ✅ 运行测试确保通过
- ✅ 构建生成 dist 文件
- ✅ README.md 文档完善
- ✅ 版本号符合语义化版本规范

### 8.5 发布
```bash
npm publish
```

### 8.6 发布私有包（可选）
```bash
npm publish --access public
```

### 8.7 验证发布
访问 https://www.npmjs.com/package/my-awesome-package

---

## 9. 版本管理

### 9.1 语义化版本（Semantic Versioning）

格式：`主版本号.次版本号.修订号` (MAJOR.MINOR.PATCH)

- **MAJOR**: 不兼容的 API 修改
- **MINOR**: 向下兼容的功能新增
- **PATCH**: 向下兼容的问题修正

### 9.2 更新版本
```bash
# 修订号 +1 (1.0.0 -> 1.0.1)
npm version patch

# 次版本号 +1 (1.0.1 -> 1.1.0)
npm version minor

# 主版本号 +1 (1.1.0 -> 2.0.0)
npm version major
```

### 9.3 发布新版本
```bash
npm version patch
npm publish
```

### 9.4 维护 CHANGELOG.md
```markdown
# Changelog

## [1.1.0] - 2024-01-15
### Added
- 新增 XX 功能

### Fixed
- 修复 XX 问题

## [1.0.0] - 2024-01-01
### Added
- 初始版本发布
```

---

## 10. 最佳实践

### 10.1 代码质量
- ✅ 使用 ESLint 进行代码检查
- ✅ 使用 Prettier 统一代码格式
- ✅ 编写单元测试，保持高覆盖率（>80%）
- ✅ 使用 TypeScript 提供类型安全

### 10.2 性能优化
- ✅ Tree-shaking 友好（使用 ES Module）
- ✅ 减少依赖体积
- ✅ 按需加载（支持部分导入）
- ✅ 提供压缩版本

### 10.3 文档完善
- ✅ 详细的 README.md
- ✅ API 文档
- ✅ 使用示例
- ✅ 常见问题解答

### 10.4 持续集成
- ✅ 使用 GitHub Actions 自动化测试
- ✅ 自动发布到 NPM
- ✅ 代码质量检查

### 10.5 安全性
- ✅ 定期更新依赖
- ✅ 使用 `npm audit` 检查漏洞
- ✅ 不要在代码中包含敏感信息

### 10.6 兼容性
- ✅ 明确支持的 Node.js 版本
- ✅ 提供多种模块格式（CJS, ESM, UMD）
- ✅ 考虑浏览器兼容性

---

## 常见问题

### Q1: 如何删除已发布的包？
```bash
npm unpublish <package-name> --force
```
⚠️ 注意：发布 24 小时后只能废弃，不能删除

### Q2: 如何废弃某个版本？
```bash
npm deprecate <package-name>@<version> "废弃原因"
```

### Q3: 如何发布 beta 版本？
```bash
npm version prerelease --preid=beta
npm publish --tag beta
```

### Q4: 包名被占用怎么办？
- 使用作用域包：`@username/package-name`
- 选择其他可用名称

### Q5: 如何测试本地包？
```bash
# 在包目录
npm link

# 在测试项目
npm link my-awesome-package
```

---

## 推荐工具

- **Rollup**: 构建工具（适合库）
- **Jest**: 测试框架
- **TypeScript**: 类型系统
- **ESLint**: 代码检查
- **Prettier**: 代码格式化
- **Husky**: Git hooks
- **np**: 更好的发布体验

---

## 学习资源

- NPM 官方文档: https://docs.npmjs.com/
- 语义化版本: https://semver.org/
- Rollup 文档: https://rollupjs.org/
- TypeScript 文档: https://www.typescriptlang.org/

---

**祝你的 NPM 包发布顺利！** 🎉
