/**
 * 动态表单组件
 * 根据 formSchema 动态渲染表单字段
 */

import React, { useState, useEffect } from 'react';
import type { FormFieldSchema } from '@flow-designer/core';

interface DynamicFormProps {
  schema: FormFieldSchema[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ schema, values, onChange }) => {
  const [formValues, setFormValues] = useState(values || {});

  useEffect(() => {
    setFormValues(values || {});
  }, [values]);

  const handleFieldChange = (name: string, value: any) => {
    const newValues = { ...formValues, [name]: value };
    setFormValues(newValues);
    onChange(newValues);
  };

  // 评估条件表达式（简化版）
  const evaluateCondition = (condition: string | boolean | undefined): boolean => {
    if (condition === undefined || condition === true) return true;
    if (condition === false) return false;
    if (typeof condition !== 'string') return true;

    try {
      // 简单的表达式解析（仅支持基本比较）
      const func = new Function(...Object.keys(formValues), `return ${condition}`);
      return func(...Object.values(formValues));
    } catch (e) {
      console.error('条件表达式解析失败:', condition, e);
      return true;
    }
  };

  const renderField = (field: FormFieldSchema) => {
    // 检查条件显示
    if (!evaluateCondition(field.visible)) {
      return null;
    }

    const fieldValue = formValues[field.name] ?? field.defaultValue ?? '';
    const isDisabled = field.disabled === true || !evaluateCondition(field.disabled);

    const fieldStyle: React.CSSProperties = {
      marginBottom: 16
    };

    const labelStyle: React.CSSProperties = {
      display: 'block',
      marginBottom: 8,
      fontWeight: 500,
      color: '#333',
      fontSize: 14
    };

    const inputStyle: React.CSSProperties = {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d9d9d9',
      borderRadius: 4,
      fontSize: 14,
      transition: 'all 0.3s',
      outline: 'none'
    };

    const inputFocusStyle = {
      borderColor: '#1890ff',
      boxShadow: '0 0 0 2px rgba(24, 144, 255, 0.2)'
    };

    // 根据字段类型渲染不同的输入组件
    switch (field.type) {
      case 'input':
        return (
          <div key={field.name} style={fieldStyle}>
            <label style={labelStyle}>
              {field.label}
              {field.required && <span style={{ color: '#ff4d4f' }}> *</span>}
            </label>
            <input
              type="text"
              value={fieldValue}
              placeholder={field.placeholder}
              disabled={isDisabled}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              style={inputStyle}
              maxLength={200}
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name} style={fieldStyle}>
            <label style={labelStyle}>
              {field.label}
              {field.required && <span style={{ color: '#ff4d4f' }}> *</span>}
            </label>
            <textarea
              value={fieldValue}
              placeholder={field.placeholder}
              disabled={isDisabled}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
              maxLength={500}
            />
          </div>
        );

      case 'number':
        return (
          <div key={field.name} style={fieldStyle}>
            <label style={labelStyle}>
              {field.label}
              {field.required && <span style={{ color: '#ff4d4f' }}> *</span>}
            </label>
            <input
              type="number"
              value={fieldValue}
              placeholder={field.placeholder}
              disabled={isDisabled}
              onChange={(e) => handleFieldChange(field.name, Number(e.target.value))}
              style={inputStyle}
              {...(field.props || {})}
            />
          </div>
        );

      case 'select':
        return (
          <div key={field.name} style={fieldStyle}>
            <label style={labelStyle}>
              {field.label}
              {field.required && <span style={{ color: '#ff4d4f' }}> *</span>}
            </label>
            <select
              value={fieldValue}
              disabled={isDisabled}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="">请选择</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'radio':
        return (
          <div key={field.name} style={fieldStyle}>
            <label style={labelStyle}>
              {field.label}
              {field.required && <span style={{ color: '#ff4d4f' }}> *</span>}
            </label>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {field.options?.map((option) => (
                <label
                  key={option.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: 14
                  }}
                >
                  <input
                    type="radio"
                    name={field.name}
                    value={option.value}
                    checked={fieldValue === option.value}
                    disabled={isDisabled}
                    onChange={() => handleFieldChange(field.name, option.value)}
                    style={{ marginRight: 6 }}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} style={fieldStyle}>
            <label style={labelStyle}>
              {field.label}
              {field.required && <span style={{ color: '#ff4d4f' }}> *</span>}
            </label>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {field.options?.map((option) => (
                <label
                  key={option.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: 14
                  }}
                >
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={(fieldValue || []).includes(option.value)}
                    disabled={isDisabled}
                    onChange={(e) => {
                      const currentValues = fieldValue || [];
                      const newValues = e.target.checked
                        ? [...currentValues, option.value]
                        : currentValues.filter((v: any) => v !== option.value);
                      handleFieldChange(field.name, newValues);
                    }}
                    style={{ marginRight: 6 }}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        );

      case 'dateRange':
        return (
          <div key={field.name} style={fieldStyle}>
            <label style={labelStyle}>
              {field.label}
              {field.required && <span style={{ color: '#ff4d4f' }}> *</span>}
            </label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="date"
                value={fieldValue?.start || ''}
                disabled={isDisabled}
                onChange={(e) =>
                  handleFieldChange(field.name, {
                    ...fieldValue,
                    start: e.target.value
                  })
                }
                style={{ ...inputStyle, flex: 1 }}
              />
              <span>至</span>
              <input
                type="date"
                value={fieldValue?.end || ''}
                disabled={isDisabled}
                onChange={(e) =>
                  handleFieldChange(field.name, {
                    ...fieldValue,
                    end: e.target.value
                  })
                }
                style={{ ...inputStyle, flex: 1 }}
              />
            </div>
          </div>
        );

      default:
        return (
          <div key={field.name} style={fieldStyle}>
            <label style={labelStyle}>{field.label}</label>
            <div style={{ color: '#999', fontSize: 12 }}>
              不支持的字段类型: {field.type}
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ padding: '8px 0' }}>
      {schema.map((field) => renderField(field))}
    </div>
  );
};
