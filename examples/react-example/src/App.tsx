/**
 * 示例应用
 *
 * 展示如何使用流程设计器（完全数据驱动）
 *
 * 原则：
 * - 数据从配置文件加载
 * - 支持从 API 加载
 * - 展示动态选项加载
 * - 展示自定义验证器
 */

import React, { useState, useEffect } from 'react';
import { FlowDesigner } from '@flow-designer/react';
import type { FlowConfig, OptionSchema, FormFieldSchema } from '@flow-designer/core';

function App() {
  const [config, setConfig] = useState<FlowConfig | null>(null);
  const [loading, setLoading] = useState(true);

  // 从配置文件加载流程配置
  useEffect(() => {
    loadFlowConfig();
  }, []);

  /**
   * 加载流程配置（从外部）
   * 这里演示多种加载方式
   */
  const loadFlowConfig = async () => {
    try {
      // 方式 1: 从 JSON 文件加载（推荐用于静态配置）
      // const response = await fetch('/configs/leave-approval.json');
      // const data = await response.json();

      // 方式 2: 从 API 加载（推荐用于动态配置）
      // const response = await fetch('/api/flows/leave-approval');
      // const data = await response.json();

      // 方式 3: 内联定义（仅用于演示）
      const data: FlowConfig = {
        id: 'demo-flow',
        name: '演示流程',
        version: '1.0.0',
        description: '这是一个演示流程，展示完全数据驱动的设计',
        nodes: [
          {
            id: 'start-1',
            type: 'start',
            title: '发起申请',
            config: {
              formSchema: [
                {
                  name: 'title',
                  label: '申请标题',
                  type: 'input',
                  required: true,
                  placeholder: '请输入申请标题'
                },
                {
                  name: 'type',
                  label: '申请类型',
                  type: 'radio',
                  required: true,
                  defaultValue: 'leave',
                  // 选项可以静态配置，也可以通过 loaders.options 动态加载
                  options: [
                    { label: '请假', value: 'leave' },
                    { label: '报销', value: 'expense' },
                    { label: '采购', value: 'purchase' }
                  ]
                },
                {
                  name: 'reason',
                  label: '申请原因',
                  type: 'textarea',
                  required: true,
                  placeholder: '请输入申请原因',
                  visible: 'type === "leave"', // 动态显示条件
                  validation: [
                    {
                      type: 'min',
                      value: 10,
                      message: '申请原因至少 10 个字'
                    }
                  ]
                },
                {
                  name: 'amount',
                  label: '报销金额',
                  type: 'number',
                  required: true,
                  visible: 'type === "expense"', // 动态显示条件
                  props: {
                    min: 0,
                    step: 0.01
                  }
                },
                {
                  name: 'dateRange',
                  label: '日期区间',
                  type: 'dateRange',
                  required: true,
                  visible: 'type === "leave"'
                }
              ],
              formValues: {}
            }
          },
          {
            id: 'approval-1',
            type: 'approval',
            title: '部门审批',
            config: {
              formSchema: [
                {
                  name: 'approverType',
                  label: '审批人类型',
                  type: 'radio',
                  defaultValue: 'role',
                  options: [
                    { label: '指定用户', value: 'user' },
                    { label: '指定角色', value: 'role' }
                  ]
                },
                {
                  name: 'approvers',
                  label: '审批人',
                  type: 'select',
                  visible: 'approverType === "user"',
                  // 这个选项将通过 loaders.options 动态加载
                  options: []
                },
                {
                  name: 'role',
                  label: '审批角色',
                  type: 'select',
                  visible: 'approverType === "role"',
                  defaultValue: 'dept_manager',
                  options: [
                    { label: '部门经理', value: 'dept_manager' },
                    { label: '总经理', value: 'general_manager' }
                  ]
                }
              ]
            }
          },
          {
            id: 'end-1',
            type: 'end',
            title: '完成',
            config: {}
          }
        ],
        edges: [
          {
            id: 'edge-1',
            source: 'start-1',
            target: 'approval-1',
            label: '提交'
          },
          {
            id: 'edge-2',
            source: 'approval-1',
            target: 'end-1',
            label: '通过'
          }
        ],
        settings: {
          layout: 'dagre',
          direction: 'LR',
          editable: true,
          draggable: true
        }
      };

      setConfig(data);
    } catch (error) {
      console.error('加载流程配置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 动态加载选项（模拟从 API 加载）
   */
  const loadOptions = async (field: FormFieldSchema): Promise<OptionSchema[]> => {
    // 模拟 API 请求
    await new Promise(resolve => setTimeout(resolve, 300));

    // 根据字段名返回不同的选项
    if (field.name === 'approvers') {
      // 模拟从 API 加载用户列表
      return [
        { label: '张三', value: 'user1' },
        { label: '李四', value: 'user2' },
        { label: '王五', value: 'user3' }
      ];
    }

    // 默认返回配置中的选项
    return field.options || [];
  };

  /**
   * 自定义验证器
   */
  const customValidators = {
    // 示例：验证金额是否在合理范围
    validateAmount: async (value: number) => {
      return value > 0 && value < 100000;
    }
  };

  /**
   * 保存配置
   */
  const handleSave = async (newConfig: FlowConfig) => {
    console.log('保存配置:', newConfig);

    // 实际应用中，这里应该调用 API 保存配置
    // await fetch('/api/flows/demo-flow', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newConfig)
    // });

    setConfig(newConfig);
  };

  if (loading) {
    return <div style={{ padding: 20, fontSize: 20 }}>加载中...</div>;
  }

  if (!config) {
    return <div style={{ padding: 20, fontSize: 20 }}>加载配置失败</div>;
  }

  return (
    <div style={{
      padding: 20,
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{
        color: '#333',
        fontSize: 32,
        marginBottom: 10,
        borderBottom: '2px solid #1890ff',
        paddingBottom: 10
      }}>
        🚀 流程设计器示例
      </h1>
      <p style={{ fontSize: 16, color: '#666' }}>完全数据驱动，无硬编码</p>

      <div style={{ marginTop: 20 }}>
        <FlowDesigner
          config={config}
          onChange={handleSave}
          loaders={{
            // 动态加载选项
            options: loadOptions
          }}
          validators={customValidators}
          onNodeClick={(node) => {
            console.log('点击节点:', node);
          }}
          onNodeDoubleClick={(node) => {
            console.log('双击节点:', node);
          }}
        />
      </div>

      <div style={{ marginTop: 40, padding: 20, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
        <h3>🎯 功能说明</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <h4 style={{ marginTop: 0, color: '#1890ff' }}>✨ 拖拽功能</h4>
            <ul style={{ lineHeight: 1.8, fontSize: 14 }}>
              <li>🖱️ <strong>拖拽节点</strong>：按住节点可自由移动位置</li>
              <li>🔗 <strong>连接节点</strong>：拖拽节点手柄创建连线</li>
              <li>📝 <strong>配置节点</strong>：双击节点打开配置弹窗</li>
              <li>🔍 <strong>缩放画布</strong>：鼠标滚轮缩放，右键拖拽平移</li>
              <li>🗺️ <strong>小地图</strong>：右下角小地图快速导航</li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginTop: 0, color: '#52c41a' }}>💡 数据驱动特性</h4>
            <ul style={{ lineHeight: 1.8, fontSize: 14 }}>
              <li>✅ 流程配置从外部加载（JSON/API）</li>
              <li>✅ 动态加载选项（<code>loaders.options</code>）</li>
              <li>✅ 条件显示字段（<code>visible</code> 表达式）</li>
              <li>✅ 自定义验证器（<code>validators</code>）</li>
              <li>✅ 实时保存配置（<code>onChange</code> 回调）</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
