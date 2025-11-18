/**
 * 开始节点组件
 */

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface StartNodeData {
  title: string;
  description?: string;
}

export const StartNode = memo<NodeProps<StartNodeData>>(({ data, selected }) => {
  return (
    <div
      style={{
        padding: '12px 20px',
        borderRadius: 8,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        border: selected ? '2px solid #1890ff' : '2px solid transparent',
        boxShadow: selected
          ? '0 4px 12px rgba(24, 144, 255, 0.4)'
          : '0 2px 8px rgba(0, 0, 0, 0.15)',
        minWidth: 180,
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 20 }}>▶️</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{data.title || '开始'}</div>
          {data.description && (
            <div style={{ fontSize: 12, opacity: 0.9, marginTop: 4 }}>
              {data.description}
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#fff',
          width: 10,
          height: 10,
          border: '2px solid #667eea'
        }}
      />
    </div>
  );
});

StartNode.displayName = 'StartNode';
