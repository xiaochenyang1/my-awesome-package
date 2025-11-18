<template>
  <div
    class="flow-designer"
    :class="`flow-designer-theme-${theme}`"
    :style="containerStyle"
  >
    <VueFlow
      v-model:nodes="vueFlowNodes"
      v-model:edges="vueFlowEdges"
      :node-types="nodeTypes"
      fit-view-on-init
      :snap-to-grid="true"
      :snap-grid="[15, 15]"
      @node-click="handleNodeClick"
      @node-double-click="handleNodeDoubleClick"
      @connect="handleConnect"
    >
      <Background />
      <Controls />
      <MiniMap :node-color="getNodeColor" />
    </VueFlow>

    <!-- 节点工具栏 -->
    <NodeToolbar
      v-if="showToolbar"
      :node-types="availableNodeTypes"
      :position="toolbarPosition"
      @add-node="handleAddNode"
    />

    <!-- 提示信息 -->
    <div class="flow-hint">
      💡 提示：双击节点可配置，拖拽节点可移动，连接手柄可创建连线，点击工具栏可添加节点
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { VueFlow, type Node, type Edge, MarkerType } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/controls/dist/style.css';
import '@vue-flow/minimap/dist/style.css';

import type { FlowConfig, NodeConfig, EdgeConfig } from '@xiaoxiao6.0/flow-designer-core';
import { StartNode, ApprovalNode, EndNode } from './nodes';
import NodeToolbar, { type NodeTypeDefinition } from './NodeToolbar.vue';

/**
 * 流程设计器 Props
 */
interface Props {
  /** 流程配置（从外部传入） */
  config: FlowConfig;
  /** 主题 */
  theme?: 'light' | 'dark';
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: Record<string, any>;
  /** 是否显示节点工具栏 */
  showToolbar?: boolean;
  /** 工具栏位置 */
  toolbarPosition?: 'top' | 'left' | 'right';
  /** 可添加的节点类型列表 */
  availableNodeTypes?: NodeTypeDefinition[];
}

interface Emits {
  (e: 'change', config: FlowConfig): void;
  (e: 'node-click', node: NodeConfig): void;
  (e: 'node-double-click', node: NodeConfig): void;
  (e: 'node-add', parentId: string, type: string): void;
  (e: 'node-delete', nodeId: string): void;
  (e: 'edge-add', source: string, target: string): void;
  (e: 'edge-delete', edgeId: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'light',
  showToolbar: true,
  toolbarPosition: 'top',
  availableNodeTypes: () => [
    {
      type: 'start',
      label: '开始',
      icon: '🚀',
      color: '#667eea',
      description: '流程开始节点'
    },
    {
      type: 'approval',
      label: '审批',
      icon: '✅',
      color: '#1890ff',
      description: '审批节点'
    },
    {
      type: 'end',
      label: '结束',
      icon: '🏁',
      color: '#f5576c',
      description: '流程结束节点'
    }
  ]
});

const emit = defineEmits<Emits>();

// 节点类型映射
const nodeTypes = {
  start: StartNode,
  approval: ApprovalNode,
  end: EndNode
};

// VueFlow 节点和边
const vueFlowNodes = ref<Node[]>([]);
const vueFlowEdges = ref<Edge[]>([]);

// 容器样式
const containerStyle = computed(() => ({
  width: '100%',
  height: '600px',
  border: '1px solid #d9d9d9',
  borderRadius: '8px',
  overflow: 'hidden',
  position: 'relative',
  ...props.style
}));

// 将 NodeConfig 转换为 VueFlow 的 Node
const convertToVueFlowNode = (node: NodeConfig, index: number): Node => {
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

// 将 EdgeConfig 转换为 VueFlow 的 Edge
const convertToVueFlowEdge = (edge: EdgeConfig): Edge => {
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    type: 'smoothstep',
    animated: true,
    markerEnd: MarkerType.ArrowClosed,
    style: {
      stroke: '#1890ff',
      strokeWidth: 2
    }
  };
};

// 从 config 初始化 VueFlow 数据
const initializeFlow = () => {
  if (props.config.nodes) {
    vueFlowNodes.value = props.config.nodes.map((node, index) =>
      convertToVueFlowNode(node, index)
    );
  }

  if (props.config.edges) {
    vueFlowEdges.value = props.config.edges.map(convertToVueFlowEdge);
  }
};

// 监听 config 变化
watch(
  () => props.config.id,
  () => {
    initializeFlow();
  }
);

// 处理节点点击
const handleNodeClick = (event: any) => {
  const nodeConfig = props.config.nodes.find((n) => n.id === event.node.id);
  if (nodeConfig) {
    emit('node-click', nodeConfig);
  }
};

// 处理节点双击
const handleNodeDoubleClick = (event: any) => {
  const nodeConfig = props.config.nodes.find((n) => n.id === event.node.id);
  if (nodeConfig) {
    emit('node-double-click', nodeConfig);
    console.log('双击节点配置:', nodeConfig);
  }
};

// 处理连线
const handleConnect = (connection: any) => {
  const newEdge: EdgeConfig = {
    id: `edge-${Date.now()}`,
    source: connection.source,
    target: connection.target,
    label: ''
  };

  // 添加到边数组
  vueFlowEdges.value.push(convertToVueFlowEdge(newEdge));

  // 同步到配置
  syncToConfig();

  // 触发回调
  emit('edge-add', connection.source, connection.target);
};

// 同步 VueFlow 数据到 config
const syncToConfig = () => {
  const newNodeConfigs: NodeConfig[] = vueFlowNodes.value.map((node) => {
    const existingNode = props.config.nodes.find((n) => n.id === node.id);
    return {
      id: node.id,
      type: node.type || 'default',
      title: node.data.title || existingNode?.title || '',
      config: existingNode?.config || {}
    };
  });

  const newEdgeConfigs: EdgeConfig[] = vueFlowEdges.value.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: (edge.label as string) || ''
  }));

  const newConfig: FlowConfig = {
    ...props.config,
    nodes: newNodeConfigs,
    edges: newEdgeConfigs
  };

  emit('change', newConfig);
};

// 添加节点
const handleAddNode = (type: string) => {
  const nodeId = `${type}-${Date.now()}`;
  const nodeTypeDef = props.availableNodeTypes.find((nt) => nt.type === type);

  // 计算新节点位置
  const lastNode = vueFlowNodes.value[vueFlowNodes.value.length - 1];
  const position = lastNode
    ? { x: lastNode.position.x + 300, y: lastNode.position.y }
    : { x: 100, y: 100 };

  // 创建新节点配置
  const newNodeConfig: NodeConfig = {
    id: nodeId,
    type,
    title: nodeTypeDef?.label || type,
    config: {
      formSchema: [],
      formValues: {}
    }
  };

  // 创建 VueFlow 节点
  const newVueFlowNode: Node = {
    id: nodeId,
    type,
    position,
    data: {
      title: newNodeConfig.title,
      ...newNodeConfig.config
    }
  };

  // 添加到节点数组
  vueFlowNodes.value.push(newVueFlowNode);

  // 同步到配置
  const newConfig: FlowConfig = {
    ...props.config,
    nodes: [...props.config.nodes, newNodeConfig]
  };

  emit('change', newConfig);
  emit('node-add', nodeId, type);

  console.log('添加节点:', newNodeConfig);
};

// 获取节点颜色（用于 MiniMap）
const getNodeColor = (node: Node) => {
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
};

// 初始化
onMounted(() => {
  initializeFlow();
});
</script>

<style scoped>
.flow-designer {
  position: relative;
}

.flow-hint {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  pointer-events: none;
}
</style>
