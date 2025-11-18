/**
 * @flow-designer/vue
 *
 * 流程设计器 Vue 3 适配器
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
} from '@xiaoxiao6.0/flow-designer-core';

// 导出组件
export { default as FlowDesigner } from './components/FlowDesigner.vue';
export { default as NodeToolbar } from './components/NodeToolbar.vue';
export type { NodeTypeDefinition } from './components/NodeToolbar.vue';

// 导出节点组件
export { StartNode, ApprovalNode, EndNode } from './components/nodes';

// 导出 Composables
export { useFlowDesigner } from './composables/useFlowDesigner';
export type {
  UseFlowDesignerOptions,
  UseFlowDesignerReturn
} from './composables/useFlowDesigner';
