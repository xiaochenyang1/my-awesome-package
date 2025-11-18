/**
 * @flow-designer/core
 *
 * 流程设计器核心包 - 框架无关
 *
 * 设计原则：
 * 1. 零硬编码 - 不包含任何硬编码数据
 * 2. 完全动态 - 所有数据从外部传入
 * 3. 框架无关 - 不依赖任何前端框架
 * 4. 高度可扩展 - 支持任意扩展
 */

// 类型定义（Schema Only，无数据）
export type {
  FlowConfig,
  FlowSettings,
  NodeConfig,
  NodeConfigData,
  NodeStyle,
  FormFieldSchema,
  OptionSchema,
  ValidationRule,
  EdgeConfig,
  EdgeStyle,
  ValidationResult,
  DataLoaders,
  NodeTypeSchema,
  FormComponentSchema,
  FlowEventType,
  FlowEvent,
  EventListener
} from './types';

// 引擎
export { ConfigEngine } from './engine/ConfigEngine';
export { EventEngine } from './engine/EventEngine';

// 模型
export { FlowModel } from './models/FlowModel';

// 工具函数
export {
  generateId,
  deepClone,
  deepMerge,
  debounce,
  throttle
} from './utils';
