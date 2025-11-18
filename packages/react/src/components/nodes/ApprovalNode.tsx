/**
 * 审批节点组件
 */

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface ApprovalNodeData {
  title: string;
  description?: string;
  approver?: string;
}

export const ApprovalNode = memo<NodeProps<ApprovalNodeData>>(({ data, selected }) => {
  return (
    <div
      style={{
        padding: '12px 20px',
        borderRadius: 8,
        background: '#fff',
        border: selected ? '2px solid #1890ff' : '2px solid #d9d9d9',
        boxShadow: selected
          ? '0 4px 12px rgba(24, 144, 255, 0.4)'
          : '0 2px 8px rgba(0, 0, 0, 0.1)',
        minWidth: 180,
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#1890ff',
          width: 10,
          height: 10,
          border: '2px solid #fff'
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 20 }}>✅</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: '#333' }}>
            {data.title || '审批'}
          </div>
          {data.approver && (
            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
              审批人: {data.approver}
            </div>
          )}
          {data.description && (
            <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
              {data.description}
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#52c41a',
          width: 10,
          height: 10,
          border: '2px solid #fff'
        }}
      />
    </div>
  );
});

ApprovalNode.displayName = 'ApprovalNode';
