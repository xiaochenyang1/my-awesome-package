/**
 * FlowDesigner 组件
 *
 * 流程设计器主组件（完整的拖拽版本，基于 ReactFlow）
 *
 * 原则：
 * - 所有数据从 props 传入
 * - 不包含任何硬编码数据
 * - 完全受控
 */

import React, { useCallback, useState, useEffect, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  addEdge,
  NodeTypes,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';

import type { FlowConfig, NodeConfig, EdgeConfig, DataLoaders } from '@flow-designer/core';
import { StartNode, ApprovalNode, EndNode } from './nodes';
import { NodeConfigModal } from './NodeConfigModal';

/**
 * 流程设计器 Props
 */
export interface FlowDesignerProps {
  // ========== 数据（必须从外部传入） ==========

  /** 流程配置（从外部传入） */
  config: FlowConfig;

  /** 配置变化回调 */
  onChange?: (config: FlowConfig) => void;

  // ========== 数据加载器（可选） ==========

  /** 数据加载器（用于动态加载外部数据） */
  loaders?: DataLoaders;

  // ========== 组件注册（可选） ==========

  /** 自定义节点组件映射 */
  nodeComponents?: Record<string, React.ComponentType<any>>;

  /** 自定义表单组件映射 */
  formComponents?: Record<string, React.ComponentType<any>>;

  /** 自定义验证器 */
  validators?: Record<string, (value: any, context?: any) => boolean | Promise<boolean>>;

  // ========== 样式和主题（可选） ==========

  /** 主题 */
  theme?: 'light' | 'dark' | Record<string, any>;

  /** 自定义类名 */
  className?: string;

  /** 自定义样式 */
  style?: React.CSSProperties;

  // ========== 事件回调 ==========

  /** 节点点击事件 */
  onNodeClick?: (node: NodeConfig) => void;

  /** 节点双击事件 */
  onNodeDoubleClick?: (node: NodeConfig) => void;

  /** 节点添加事件 */
  onNodeAdd?: (parentId: string, type: string) => void;

  /** 节点删除事件 */
  onNodeDelete?: (nodeId: string) => void;

  /** 连线添加事件 */
  onEdgeAdd?: (source: string, target: string) => void;

  /** 连线删除事件 */
  onEdgeDelete?: (edgeId: string) => void;

  // ========== 钩子函数 ==========

  /** 配置保存前的钩子 */
  beforeSave?: (config: FlowConfig) => FlowConfig | Promise<FlowConfig>;

  /** 配置保存后的钩子 */
  afterSave?: (config: FlowConfig) => void | Promise<void>;
}

/**
 * 将 NodeConfig 转换为 ReactFlow 的 Node
 */
const convertToReactFlowNode = (node: NodeConfig, index: number): Node => {
  return {
    id: node.id,
    type: node.type,
    position: { x: index * 300, y: 100 },
    data: {
      title: node.title,
      description: node.config?.description,
      ...node.config
    }
  };
};

/**
 * 将 EdgeConfig 转换为 ReactFlow 的 Edge
 */
const convertToReactFlowEdge = (edge: EdgeConfig): Edge => {
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    type: 'smoothstep',
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed
    },
    style: {
      stroke: '#1890ff',
      strokeWidth: 2
    }
  };
};

/**
 * 流程设计器组件（完整拖拽版本）
 */
export const FlowDesigner: React.FC<FlowDesignerProps> = (props) => {
  const {
    config,
    onChange,
    loaders,
    nodeComponents,
    formComponents,
    validators,
    theme = 'light',
    className,
    style,
    onNodeClick,
    onNodeDoubleClick,
    onNodeAdd,
    onNodeDelete,
    onEdgeAdd,
    onEdgeDelete,
    beforeSave,
    afterSave
  } = props;

  // 节点类型映射（内置 + 自定义）
  const nodeTypes: NodeTypes = useMemo(
    () => ({
      start: StartNode,
      approval: ApprovalNode,
      end: EndNode,
      ...nodeComponents
    }),
    [nodeComponents]
  );

  // ReactFlow 状态
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // 节点配置弹窗
  const [selectedNode, setSelectedNode] = useState<NodeConfig | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // 从 config 初始化 ReactFlow 数据
  useEffect(() => {
    if (config.nodes) {
      const reactFlowNodes = config.nodes.map((node, index) =>
        convertToReactFlowNode(node, index)
      );
      setNodes(reactFlowNodes);
    }

    if (config.edges) {
      const reactFlowEdges = config.edges.map(convertToReactFlowEdge);
      setEdges(reactFlowEdges);
    }
  }, [config.id]); // 仅在流程 ID 变化时重新初始化

  // 处理连线
  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge = {
        ...connection,
        id: `edge-${Date.now()}`,
        type: 'smoothstep',
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed
        },
        style: {
          stroke: '#1890ff',
          strokeWidth: 2
        }
      } as Edge;

      setEdges((eds: Edge[]) => addEdge(newEdge, eds));

      // 触发回调
      if (connection.source && connection.target) {
        onEdgeAdd?.(connection.source, connection.target);
      }

      // 同步到 config
      syncToConfig();
    },
    [onEdgeAdd]
  );

  // 处理节点双击（打开配置弹窗）
  const onNodeDoubleClickHandler = useCallback(
    (event: React.MouseEvent, node: Node) => {
      const nodeConfig = config.nodes.find((n) => n.id === node.id);
      if (nodeConfig) {
        setSelectedNode(nodeConfig);
        setModalVisible(true);
        onNodeDoubleClick?.(nodeConfig);
      }
    },
    [config.nodes, onNodeDoubleClick]
  );

  // 处理节点点击
  const onNodeClickHandler = useCallback(
    (event: React.MouseEvent, node: Node) => {
      const nodeConfig = config.nodes.find((n) => n.id === node.id);
      if (nodeConfig) {
        onNodeClick?.(nodeConfig);
      }
    },
    [config.nodes, onNodeClick]
  );

  // 保存节点配置
  const handleSaveNode = useCallback(
    (updatedNode: NodeConfig) => {
      const newNodes = config.nodes.map((n) =>
        n.id === updatedNode.id ? updatedNode : n
      );

      const newConfig: FlowConfig = {
        ...config,
        nodes: newNodes
      };

      onChange?.(newConfig);

      // 更新 ReactFlow 节点显示
      setNodes((nds: Node[]) =>
        nds.map((n: Node) =>
          n.id === updatedNode.id
            ? {
                ...n,
                data: {
                  ...n.data,
                  title: updatedNode.title,
                  ...updatedNode.config
                }
              }
            : n
        )
      );
    },
    [config, onChange, setNodes]
  );

  // 同步 ReactFlow 数据到 config
  const syncToConfig = useCallback(() => {
    // 将 ReactFlow 的 nodes 和 edges 转换回 NodeConfig 和 EdgeConfig
    const newNodeConfigs: NodeConfig[] = nodes.map((node: Node) => {
      const existingNode = config.nodes.find((n) => n.id === node.id);
      return {
        id: node.id,
        type: node.type || 'default',
        title: node.data.title || existingNode?.title || '',
        config: existingNode?.config || {}
      };
    });

    const newEdgeConfigs: EdgeConfig[] = edges.map((edge: Edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label as string
    }));

    const newConfig: FlowConfig = {
      ...config,
      nodes: newNodeConfigs,
      edges: newEdgeConfigs
    };

    onChange?.(newConfig);
  }, [nodes, edges, config, onChange]);

  return (
    <div
      className={`flow-designer flow-designer-theme-${theme} ${className || ''}`}
      style={{
        width: '100%',
        height: 600,
        border: '1px solid #d9d9d9',
        borderRadius: 8,
        overflow: 'hidden',
        ...style
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClickHandler}
        onNodeDoubleClick={onNodeDoubleClickHandler}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node: Node) => {
            switch (node.type) {
              case 'start':
                return '#667eea';
              case 'approval':
                return '#1890ff';
              case 'end':
                return '#f5576c';
              default:
                return '#eee';
            }
          }}
        />
      </ReactFlow>

      {/* 节点配置弹窗 */}
      <NodeConfigModal
        node={selectedNode}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveNode}
      />

      {/* 提示信息 */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '8px 12px',
          borderRadius: 4,
          fontSize: 12,
          color: '#666',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          zIndex: 10
        }}
      >
        💡 提示：双击节点可配置，拖拽节点可移动，连接手柄可创建连线
      </div>
    </div>
  );
};

FlowDesigner.displayName = 'FlowDesigner';
