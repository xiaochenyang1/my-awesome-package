<template>
  <div class="node-toolbar" :class="`toolbar-${position}`">
    <div class="toolbar-title">添加节点</div>
    <div class="toolbar-items">
      <div
        v-for="nodeType in nodeTypes"
        :key="nodeType.type"
        class="toolbar-item"
        :style="{ borderColor: nodeType.color }"
        @click="handleAddNode(nodeType.type)"
      >
        <div class="item-icon">{{ nodeType.icon }}</div>
        <div class="item-content">
          <div class="item-label">{{ nodeType.label }}</div>
          <div v-if="nodeType.description" class="item-description">
            {{ nodeType.description }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface NodeTypeDefinition {
  type: string;
  label: string;
  icon: string;
  color: string;
  description?: string;
}

interface Props {
  nodeTypes: NodeTypeDefinition[];
  position?: 'top' | 'left' | 'right';
}

interface Emits {
  (e: 'add-node', type: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top'
});

const emit = defineEmits<Emits>();

const handleAddNode = (type: string) => {
  emit('add-node', type);
};
</script>

<style scoped>
.node-toolbar {
  position: absolute;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.toolbar-top {
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
}

.toolbar-left {
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
}

.toolbar-right {
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
}

.toolbar-title {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.toolbar-items {
  display: flex;
  gap: 8px;
}

.toolbar-left .toolbar-items,
.toolbar-right .toolbar-items {
  flex-direction: column;
}

.toolbar-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 2px solid;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  background: white;
  min-width: 140px;
}

.toolbar-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.item-icon {
  font-size: 20px;
  line-height: 1;
}

.item-content {
  flex: 1;
}

.item-label {
  font-size: 13px;
  font-weight: 600;
  color: #262626;
  line-height: 1.4;
}

.item-description {
  font-size: 11px;
  color: #8c8c8c;
  margin-top: 2px;
  line-height: 1.3;
}
</style>
