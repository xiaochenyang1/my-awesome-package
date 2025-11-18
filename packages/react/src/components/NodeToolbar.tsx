/**
 * NodeToolbar 组件
 *
 * 节点工具栏 - 用于添加新节点
 *
 * 功能：
 * - 显示可用的节点类型
 * - 点击添加对应类型的节点
 * - 支持自定义节点类型
 */

import React, { useState } from 'react';

export interface NodeTypeDefinition {
  /** 节点类型标识 */
  type: string;
  /** 节点类型名称 */
  label: string;
  /** 节点图标（emoji 或文本） */
  icon?: string;
  /** 节点颜色 */
  color?: string;
  /** 节点描述 */
  description?: string;
}

export interface NodeToolbarProps {
  /** 可用的节点类型列表 */
  nodeTypes: NodeTypeDefinition[];
  /** 添加节点的回调 */
  onAddNode: (type: string) => void;
  /** 工具栏位置 */
  position?: 'top' | 'left' | 'right';
  /** 是否显示 */
  visible?: boolean;
}

/**
 * 节点工具栏组件
 */
export const NodeToolbar: React.FC<NodeToolbarProps> = ({
  nodeTypes,
  onAddNode,
  position = 'top',
  visible = true
}) => {
  const [hoveredType, setHoveredType] = useState<string | null>(null);

  if (!visible) {
    return null;
  }

  const isVertical = position === 'left' || position === 'right';

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    display: 'flex',
    flexDirection: isVertical ? 'column' : 'row',
    gap: 8,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
    ...(position === 'top' && { top: 20, left: '50%', transform: 'translateX(-50%)' }),
    ...(position === 'left' && { top: '50%', left: 20, transform: 'translateY(-50%)' }),
    ...(position === 'right' && { top: '50%', right: 20, transform: 'translateY(-50%)' })
  };

  return (
    <div style={containerStyle}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: '#666',
          marginBottom: isVertical ? 8 : 0,
          marginRight: isVertical ? 0 : 8,
          whiteSpace: 'nowrap'
        }}
      >
        ➕ 添加节点
      </div>

      {nodeTypes.map((nodeType) => (
        <button
          key={nodeType.type}
          onClick={() => onAddNode(nodeType.type)}
          onMouseEnter={() => setHoveredType(nodeType.type)}
          onMouseLeave={() => setHoveredType(null)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 12px',
            backgroundColor: hoveredType === nodeType.type ? (nodeType.color || '#1890ff') : '#f5f5f5',
            color: hoveredType === nodeType.type ? '#ffffff' : '#333',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500,
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
            outline: 'none'
          }}
          title={nodeType.description}
        >
          <span style={{ fontSize: 16 }}>{nodeType.icon || '⭕'}</span>
          <span>{nodeType.label}</span>
        </button>
      ))}
    </div>
  );
};

NodeToolbar.displayName = 'NodeToolbar';
