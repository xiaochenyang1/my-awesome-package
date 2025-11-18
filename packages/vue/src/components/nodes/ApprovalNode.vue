<template>
  <div class="flow-node flow-node-approval" :style="nodeStyle">
    <Handle type="target" :position="Position.Top" />
    <div class="node-icon">✅</div>
    <div class="node-content">
      <div class="node-title">{{ data.title || '审批' }}</div>
      <div v-if="data.description" class="node-description">
        {{ data.description }}
      </div>
      <div v-if="data.approvers && data.approvers.length > 0" class="node-info">
        <span class="info-label">审批人：</span>
        <span class="info-value">{{ data.approvers.join(', ') }}</span>
      </div>
    </div>
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Handle, Position } from '@vue-flow/core';

interface Props {
  data: {
    title?: string;
    description?: string;
    approvers?: string[];
    [key: string]: any;
  };
}

const props = defineProps<Props>();

const nodeStyle = computed(() => ({
  background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
  color: '#fff',
  padding: '12px 16px',
  borderRadius: '8px',
  minWidth: '180px',
  boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)',
  border: '2px solid #1890ff'
}));
</script>

<style scoped>
.flow-node {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.flow-node:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2) !important;
}

.node-icon {
  font-size: 24px;
  line-height: 1;
}

.node-content {
  flex: 1;
}

.node-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
}

.node-description {
  font-size: 12px;
  opacity: 0.9;
  line-height: 1.4;
  margin-bottom: 4px;
}

.node-info {
  font-size: 11px;
  opacity: 0.85;
  display: flex;
  gap: 4px;
  margin-top: 4px;
}

.info-label {
  font-weight: 500;
}

.info-value {
  opacity: 0.9;
}
</style>
