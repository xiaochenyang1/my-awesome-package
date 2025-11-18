/**
 * useFlowDesigner Composable
 *
 * 职责：
 * 1. 管理流程配置状态
 * 2. 提供节点和连线操作方法
 * 3. 处理事件订阅
 *
 * 原则：
 * - 不包含任何硬编码数据
 * - 所有数据从 props 传入
 * - 完全受控
 */

import { ref, computed, watch, onUnmounted, Ref } from 'vue';
import type { FlowConfig, NodeConfig, EdgeConfig } from '@xiaoxiao6.0/flow-designer-core';
import { FlowModel } from '@xiaoxiao6.0/flow-designer-core';

export interface UseFlowDesignerOptions {
  /** 流程配置（从外部传入） */
  config: Ref<FlowConfig> | FlowConfig;
  /** 配置变化回调（从外部传入） */
  onChange?: (config: FlowConfig) => void;
  /** 是否启用历史记录 */
  enableHistory?: boolean;
}

export interface UseFlowDesignerReturn {
  /** 当前流程配置 */
  config: Ref<FlowConfig>;
  /** 流程模型实例 */
  flowModel: FlowModel;
  /** 所有节点 */
  nodes: Ref<NodeConfig[]>;
  /** 所有连线 */
  edges: Ref<EdgeConfig[]>;
  /** 添加节点 */
  addNode: (node: NodeConfig) => void;
  /** 更新节点 */
  updateNode: (nodeId: string, updates: Partial<NodeConfig>) => void;
  /** 删除节点 */
  removeNode: (nodeId: string) => void;
  /** 获取节点 */
  getNode: (nodeId: string) => NodeConfig | undefined;
  /** 添加连线 */
  addEdge: (edge: EdgeConfig) => void;
  /** 更新连线 */
  updateEdge: (edgeId: string, updates: Partial<EdgeConfig>) => void;
  /** 删除连线 */
  removeEdge: (edgeId: string) => void;
  /** 获取连线 */
  getEdge: (edgeId: string) => EdgeConfig | undefined;
  /** 验证配置 */
  validate: () => { valid: boolean; errors: string[]; warnings?: string[] };
}

export function useFlowDesigner(
  options: UseFlowDesignerOptions
): UseFlowDesignerReturn {
  const { config: externalConfig, onChange, enableHistory = false } = options;

  // 将 config 转换为 ref
  const configRef = ref(externalConfig) as Ref<FlowConfig>;

  // 创建流程模型实例
  const flowModel = new FlowModel(configRef.value, { enableHistory });

  // 内部状态（从流程模型同步）
  const config = ref<FlowConfig>(configRef.value);
  const nodes = ref<NodeConfig[]>(configRef.value.nodes || []);
  const edges = ref<EdgeConfig[]>(configRef.value.edges || []);

  // 同步外部配置变化
  watch(
    configRef,
    (newConfig) => {
      flowModel.setConfig(newConfig);
      config.value = newConfig;
      nodes.value = newConfig.nodes || [];
      edges.value = newConfig.edges || [];
    },
    { deep: true }
  );

  // 监听配置变化事件
  const unsubscribe = flowModel.on('config:change', (event: any) => {
    const newConfig = event.data;
    config.value = newConfig;
    nodes.value = newConfig.nodes || [];
    edges.value = newConfig.edges || [];

    // 触发外部回调
    onChange?.(newConfig);
  });

  // 组件卸载时取消订阅
  onUnmounted(() => {
    unsubscribe();
  });

  // 添加节点
  const addNode = (node: NodeConfig) => {
    flowModel.addNode(node);
  };

  // 更新节点
  const updateNode = (nodeId: string, updates: Partial<NodeConfig>) => {
    flowModel.updateNode(nodeId, updates);
  };

  // 删除节点
  const removeNode = (nodeId: string) => {
    flowModel.removeNode(nodeId);
  };

  // 获取节点
  const getNode = (nodeId: string) => {
    return flowModel.getNode(nodeId);
  };

  // 添加连线
  const addEdge = (edge: EdgeConfig) => {
    flowModel.addEdge(edge);
  };

  // 更新连线
  const updateEdge = (edgeId: string, updates: Partial<EdgeConfig>) => {
    flowModel.updateEdge(edgeId, updates);
  };

  // 删除连线
  const removeEdge = (edgeId: string) => {
    flowModel.removeEdge(edgeId);
  };

  // 获取连线
  const getEdge = (edgeId: string) => {
    return flowModel.getEdge(edgeId);
  };

  // 验证配置
  const validate = () => {
    return flowModel.validate();
  };

  return {
    config,
    flowModel,
    nodes,
    edges,
    addNode,
    updateNode,
    removeNode,
    getNode,
    addEdge,
    updateEdge,
    removeEdge,
    getEdge,
    validate
  };
}
