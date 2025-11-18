/**
 * 流程设计器核心类型定义
 *
 * 设计原则：
 * 1. 不包含任何硬编码数据
 * 2. 所有配置都是动态的
 * 3. 完全可扩展
 */

/**
 * 流程配置 Schema（完全动态）
 */
export interface FlowConfig {
  /** 流程唯一标识（从外部传入） */
  id: string;
  /** 流程名称（从外部传入） */
  name: string;
  /** 版本号（从外部传入） */
  version: string;
  /** 流程描述（可选） */
  description?: string;
  /** 节点列表（从外部传入） */
  nodes: NodeConfig[];
  /** 连线列表（从外部传入） */
  edges: EdgeConfig[];
  /** 流程设置（从外部传入） */
  settings?: FlowSettings;
  /** 元数据（完全自定义） */
  metadata?: Record<string, any>;
}

/**
 * 流程设置
 */
export interface FlowSettings {
  /** 布局方式（从外部指定） */
  layout?: 'dagre' | 'manual' | string;
  /** 布局方向（从外部指定） */
  direction?: 'LR' | 'TB' | 'RL' | 'BT';
  /** 主题（从外部指定） */
  theme?: 'light' | 'dark' | string;
  /** 是否可编辑（从外部指定） */
  editable?: boolean;
  /** 是否可拖拽（从外部指定） */
  draggable?: boolean;
  /** 节点间距（从外部指定） */
  nodeSpacing?: number;
  /** 扩展配置（完全自定义） */
  [key: string]: any;
}

/**
 * 节点配置 Schema（完全动态）
 */
export interface NodeConfig {
  /** 节点唯一标识（从外部传入） */
  id: string;
  /** 节点类型（用户自定义，不限定） */
  type: string;
  /** 节点标题（从外部传入） */
  title: string;
  /** 节点描述（可选） */
  description?: string;
  /** 节点位置（可选，用于自由布局） */
  position?: {
    x: number;
    y: number;
  };
  /** 节点配置（完全动态） */
  config: NodeConfigData;
  /** 节点样式（完全自定义） */
  style?: NodeStyle;
  /** 子节点 ID 列表 */
  children?: string[];
  /** 元数据（完全自定义） */
  metadata?: Record<string, any>;
}

/**
 * 节点配置数据（完全动态，不限定结构）
 */
export interface NodeConfigData {
  /** 表单定义（从外部传入） */
  formSchema?: FormFieldSchema[];
  /** 表单值（从外部传入） */
  formValues?: Record<string, any>;
  /** 其他配置（完全开放，用户自定义） */
  [key: string]: any;
}

/**
 * 节点样式配置（完全自定义）
 */
export interface NodeStyle {
  width?: number | string;
  height?: number | string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  color?: string;
  fontSize?: number;
  icon?: string;
  className?: string;
  /** 扩展样式（完全自定义） */
  [key: string]: any;
}

/**
 * 表单字段 Schema（动态定义表单）
 */
export interface FormFieldSchema {
  /** 字段名（从外部指定） */
  name: string;
  /** 字段标签（从外部指定） */
  label: string;
  /** 字段类型（用户可扩展） */
  type: string;
  /** 自定义组件名（可选） */
  component?: string;
  /** 默认值（从外部指定） */
  defaultValue?: any;
  /** 是否必填（从外部指定） */
  required?: boolean;
  /** 占位符（从外部指定） */
  placeholder?: string;
  /** 是否禁用（支持布尔或表达式） */
  disabled?: boolean | string;
  /** 是否可见（支持布尔或表达式） */
  visible?: boolean | string;
  /** 选项列表（从外部传入或动态加载） */
  options?: OptionSchema[];
  /** 验证规则（从外部传入） */
  validation?: ValidationRule[];
  /** 额外属性（完全自定义） */
  props?: Record<string, any>;
  /** 依赖字段（从外部指定） */
  dependencies?: string[];
  /** 子字段（用于嵌套） */
  children?: FormFieldSchema[];
  /** 元数据（完全自定义） */
  metadata?: Record<string, any>;
}

/**
 * 选项 Schema（从外部传入）
 */
export interface OptionSchema {
  /** 选项标签（从外部传入） */
  label: string;
  /** 选项值（从外部传入） */
  value: any;
  /** 是否禁用（从外部传入） */
  disabled?: boolean;
  /** 扩展数据（完全自定义） */
  metadata?: Record<string, any>;
}

/**
 * 验证规则（从外部配置）
 */
export interface ValidationRule {
  /** 验证类型（用户可扩展） */
  type: string;
  /** 错误消息（从外部传入） */
  message: string;
  /** 验证值（从外部传入） */
  value?: any;
  /** 自定义验证器名称（从外部指定） */
  validator?: string;
  /** 扩展配置（完全自定义） */
  metadata?: Record<string, any>;
}

/**
 * 连线配置
 */
export interface EdgeConfig {
  /** 连线唯一标识（从外部传入） */
  id: string;
  /** 源节点 ID（从外部传入） */
  source: string;
  /** 目标节点 ID（从外部传入） */
  target: string;
  /** 连线标签（从外部传入） */
  label?: string;
  /** 条件表达式（从外部传入） */
  condition?: string;
  /** 连线样式（从外部传入） */
  style?: EdgeStyle;
  /** 元数据（完全自定义） */
  metadata?: Record<string, any>;
}

/**
 * 连线样式
 */
export interface EdgeStyle {
  type?: 'solid' | 'dashed' | 'dotted' | string;
  color?: string;
  width?: number;
  arrow?: boolean;
  arrowSize?: number;
  animated?: boolean;
  /** 扩展样式（完全自定义） */
  [key: string]: any;
}

/**
 * 验证结果
 */
export interface ValidationResult {
  /** 是否有效 */
  valid: boolean;
  /** 错误列表 */
  errors: string[];
  /** 警告列表 */
  warnings?: string[];
}

/**
 * 数据加载器（用于动态加载外部数据）
 */
export interface DataLoaders {
  /**
   * 加载节点类型定义（从外部加载）
   */
  nodeTypes?: () => Promise<NodeTypeSchema[]>;

  /**
   * 加载表单组件定义（从外部加载）
   */
  formComponents?: () => Promise<FormComponentSchema[]>;

  /**
   * 加载选项数据（从外部加载）
   * @param field - 字段配置
   * @param context - 上下文数据
   */
  options?: (field: FormFieldSchema, context?: any) => Promise<OptionSchema[]>;

  /**
   * 加载初始值（从外部加载）
   * @param nodeId - 节点 ID
   */
  initialValues?: (nodeId: string) => Promise<Record<string, any>>;

  /**
   * 加载验证规则（从外部加载）
   * @param fieldName - 字段名
   */
  validations?: (fieldName: string) => Promise<ValidationRule[]>;
}

/**
 * 节点类型定义（从外部传入）
 */
export interface NodeTypeSchema {
  /** 类型标识（从外部指定） */
  type: string;
  /** 类型名称（从外部指定） */
  name: string;
  /** 类型描述（从外部指定） */
  description?: string;
  /** 图标（从外部指定） */
  icon?: string;
  /** 默认配置（从外部指定） */
  defaultConfig?: NodeConfigData;
  /** 默认样式（从外部指定） */
  defaultStyle?: NodeStyle;
  /** 元数据（完全自定义） */
  metadata?: Record<string, any>;
}

/**
 * 表单组件定义（从外部传入）
 */
export interface FormComponentSchema {
  /** 组件名称（从外部指定） */
  name: string;
  /** 组件类型（从外部指定） */
  type: string;
  /** 组件描述（从外部指定） */
  description?: string;
  /** 支持的字段类型（从外部指定） */
  supportedTypes?: string[];
  /** 默认属性（从外部指定） */
  defaultProps?: Record<string, any>;
  /** 元数据（完全自定义） */
  metadata?: Record<string, any>;
}

/**
 * 事件类型
 */
export type FlowEventType =
  | 'node:add'
  | 'node:remove'
  | 'node:update'
  | 'node:click'
  | 'node:doubleclick'
  | 'edge:add'
  | 'edge:remove'
  | 'edge:update'
  | 'config:change'
  | string; // 允许自定义事件类型

/**
 * 事件数据
 */
export interface FlowEvent<T = any> {
  type: FlowEventType;
  data: T;
  timestamp: number;
}

/**
 * 事件监听器
 */
export type EventListener<T = any> = (event: FlowEvent<T>) => void;
