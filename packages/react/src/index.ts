/**
 * @flow-designer/react
 *
 * 流程设计器 React 适配器
 *
 * 设计原则：
 * 1. 零硬编码 - 不包含任何硬编码数据
 * 2. 完全受控 - 所有数据从 props 传入
 * 3. 高度可扩展 - 支持自定义组件和验证器
 */

// 导出核心类型（从 core 包）
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
} from '@flow-designer/core';

// 导出组件
export { FlowDesigner } from './components/FlowDesigner';
export type { FlowDesignerProps } from './components/FlowDesigner';

// 导出 Hooks
export { useFlowDesigner } from './hooks/useFlowDesigner';
export type { UseFlowDesignerOptions, UseFlowDesignerReturn } from './hooks/useFlowDesigner';

export { useDynamicForm } from './hooks/useDynamicForm';
export type { UseDynamicFormOptions, UseDynamicFormReturn } from './hooks/useDynamicForm';
