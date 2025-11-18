/**
 * 结束节点组件
 */

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface EndNodeData {
  title: string;
  description?: string;
}

export const EndNode = memo<NodeProps<EndNodeData>>(({ data, selected }) => {
  return (
    <div
      style={{
        padding: '12px 20px',
        borderRadius: 8,
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#fff',
          width: 10,
          height: 10,
          border: '2px solid #f5576c'
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 20 }}>🏁</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{data.title || '结束'}</div>
          {data.description && (
            <div style={{ fontSize: 12, opacity: 0.9, marginTop: 4 }}>
              {data.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

EndNode.displayName = 'EndNode';
