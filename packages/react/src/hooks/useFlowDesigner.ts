/**
 * useFlowDesigner Hook
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

import { useState, useEffect, useCallback, useRef } from 'react';
import type { FlowConfig, NodeConfig, EdgeConfig } from '@flow-designer/core';
import { FlowModel } from '@flow-designer/core';

export interface UseFlowDesignerOptions {
  /** 流程配置（从外部传入） */
  config: FlowConfig;
  /** 配置变化回调（从外部传入） */
  onChange?: (config: FlowConfig) => void;
  /** 是否启用历史记录 */
  enableHistory?: boolean;
}

export interface UseFlowDesignerReturn {
  /** 当前流程配置 */
  config: FlowConfig;
  /** 流程模型实例 */
  flowModel: FlowModel;
  /** 所有节点 */
  nodes: NodeConfig[];
  /** 所有连线 */
  edges: EdgeConfig[];
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

  // 创建流程模型实例（仅初始化一次）
  const flowModelRef = useRef<FlowModel | null>(null);

  if (!flowModelRef.current) {
    flowModelRef.current = new FlowModel(externalConfig, { enableHistory });
  }

  const flowModel = flowModelRef.current;

  // 内部状态（从流程模型同步）
  const [config, setConfig] = useState<FlowConfig>(externalConfig);
  const [nodes, setNodes] = useState<NodeConfig[]>(externalConfig.nodes || []);
  const [edges, setEdges] = useState<EdgeConfig[]>(externalConfig.edges || []);

  // 同步外部配置变化
  useEffect(() => {
    flowModel.setConfig(externalConfig);
    setConfig(externalConfig);
    setNodes(externalConfig.nodes || []);
    setEdges(externalConfig.edges || []);
  }, [externalConfig, flowModel]);

  // 监听配置变化事件
  useEffect(() => {
    const unsubscribe = flowModel.on('config:change', (event: any) => {
      const newConfig = event.data;
      setConfig(newConfig);
      setNodes(newConfig.nodes || []);
      setEdges(newConfig.edges || []);

      // 触发外部回调
      onChange?.(newConfig);
    });

    return () => {
      unsubscribe();
    };
  }, [flowModel, onChange]);

  // 添加节点
  const addNode = useCallback((node: NodeConfig) => {
    flowModel.addNode(node);
  }, [flowModel]);

  // 更新节点
  const updateNode = useCallback((nodeId: string, updates: Partial<NodeConfig>) => {
    flowModel.updateNode(nodeId, updates);
  }, [flowModel]);

  // 删除节点
  const removeNode = useCallback((nodeId: string) => {
    flowModel.removeNode(nodeId);
  }, [flowModel]);

  // 获取节点
  const getNode = useCallback((nodeId: string) => {
    return flowModel.getNode(nodeId);
  }, [flowModel]);

  // 添加连线
  const addEdge = useCallback((edge: EdgeConfig) => {
    flowModel.addEdge(edge);
  }, [flowModel]);

  // 更新连线
  const updateEdge = useCallback((edgeId: string, updates: Partial<EdgeConfig>) => {
    flowModel.updateEdge(edgeId, updates);
  }, [flowModel]);

  // 删除连线
  const removeEdge = useCallback((edgeId: string) => {
    flowModel.removeEdge(edgeId);
  }, [flowModel]);

  // 获取连线
  const getEdge = useCallback((edgeId: string) => {
    return flowModel.getEdge(edgeId);
  }, [flowModel]);

  // 验证配置
  const validate = useCallback(() => {
    return flowModel.validate();
  }, [flowModel]);

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
