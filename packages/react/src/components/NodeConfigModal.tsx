/**
 * 节点配置弹窗组件
 */

import React, { useState, useEffect } from 'react';
import type { NodeConfig } from '@flow-designer/core';
import { DynamicForm } from './DynamicForm';

interface NodeConfigModalProps {
  node: NodeConfig | null;
  visible: boolean;
  onClose: () => void;
  onSave: (node: NodeConfig) => void;
}

export const NodeConfigModal: React.FC<NodeConfigModalProps> = ({
  node,
  visible,
  onClose,
  onSave
}) => {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [nodeTitle, setNodeTitle] = useState('');

  useEffect(() => {
    if (node) {
      setFormValues(node.config?.formValues || {});
      setNodeTitle(node.title || '');
    }
  }, [node]);

  if (!visible || !node) return null;

  const handleSave = () => {
    const updatedNode: NodeConfig = {
      ...node,
      title: nodeTitle,
      config: {
        ...node.config,
        formValues
      }
    };
    onSave(updatedNode);
    onClose();
  };

  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease'
  };

  const modalContentStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '90%',
    maxWidth: 600,
    maxHeight: '80vh',
    overflow: 'hidden',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
    animation: 'slideIn 0.3s ease'
  };

  const modalHeaderStyle: React.CSSProperties = {
    padding: '16px 24px',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const modalBodyStyle: React.CSSProperties = {
    padding: '24px',
    maxHeight: 'calc(80vh - 140px)',
    overflowY: 'auto'
  };

  const modalFooterStyle: React.CSSProperties = {
    padding: '12px 24px',
    borderTop: '1px solid #f0f0f0',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 8
  };

  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    transition: 'all 0.3s'
  };

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#1890ff',
    color: '#fff'
  };

  const defaultButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#fff',
    color: '#333',
    border: '1px solid #d9d9d9'
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        {/* 头部 */}
        <div style={modalHeaderStyle}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
            配置节点: {node.type}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 20,
              cursor: 'pointer',
              color: '#999',
              padding: 4
            }}
          >
            ×
          </button>
        </div>

        {/* 内容 */}
        <div style={modalBodyStyle}>
          {/* 节点标题 */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: 'block',
                marginBottom: 8,
                fontWeight: 500,
                color: '#333',
                fontSize: 14
              }}
            >
              节点标题 <span style={{ color: '#ff4d4f' }}>*</span>
            </label>
            <input
              type="text"
              value={nodeTitle}
              onChange={(e) => setNodeTitle(e.target.value)}
              placeholder="请输入节点标题"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: 4,
                fontSize: 14,
                outline: 'none',
                transition: 'all 0.3s'
              }}
              maxLength={50}
            />
          </div>

          {/* 动态表单 */}
          {node.config?.formSchema && node.config.formSchema.length > 0 && (
            <>
              <div
                style={{
                  marginBottom: 16,
                  paddingBottom: 12,
                  borderBottom: '1px solid #f0f0f0'
                }}
              >
                <h4 style={{ margin: 0, fontSize: 14, color: '#666' }}>节点配置</h4>
              </div>
              <DynamicForm
                schema={node.config.formSchema}
                values={formValues}
                onChange={setFormValues}
              />
            </>
          )}

          {(!node.config?.formSchema || node.config.formSchema.length === 0) && (
            <div style={{ color: '#999', fontSize: 14, textAlign: 'center', padding: 20 }}>
              该节点没有可配置的表单字段
            </div>
          )}
        </div>

        {/* 底部 */}
        <div style={modalFooterStyle}>
          <button onClick={onClose} style={defaultButtonStyle}>
            取消
          </button>
          <button onClick={handleSave} style={primaryButtonStyle}>
            保存
          </button>
        </div>
      </div>

      {/* CSS 动画 */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
