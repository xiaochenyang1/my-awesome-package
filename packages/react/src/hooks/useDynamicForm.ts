/**
 * useDynamicForm Hook
 *
 * 职责：
 * 1. 管理表单状态
 * 2. 处理字段可见性和禁用状态
 * 3. 表单验证
 *
 * 原则：
 * - 不包含任何硬编码数据
 * - 所有字段配置从外部传入
 * - 完全动态
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import type { FormFieldSchema, OptionSchema } from '@flow-designer/core';
import { ConfigEngine } from '@flow-designer/core';

export interface UseDynamicFormOptions {
  /** 表单字段配置（从外部传入） */
  schema: FormFieldSchema[];
  /** 初始值（从外部传入） */
  initialValues?: Record<string, any>;
  /** 值变化回调 */
  onChange?: (values: Record<string, any>) => void;
  /** 选项加载器（从外部传入） */
  optionsLoader?: (field: FormFieldSchema) => Promise<OptionSchema[]>;
  /** 自定义验证器（从外部传入） */
  validators?: Record<string, (value: any, context?: any) => boolean | Promise<boolean>>;
}

export interface UseDynamicFormReturn {
  /** 当前表单值 */
  values: Record<string, any>;
  /** 表单错误 */
  errors: Record<string, string>;
  /** 可见字段列表 */
  visibleFields: FormFieldSchema[];
  /** 设置字段值 */
  setValue: (name: string, value: any) => void;
  /** 批量设置值 */
  setValues: (values: Record<string, any>) => void;
  /** 获取字段值 */
  getValue: (name: string) => any;
  /** 判断字段是否可见 */
  isFieldVisible: (field: FormFieldSchema) => boolean;
  /** 判断字段是否禁用 */
  isFieldDisabled: (field: FormFieldSchema) => boolean;
  /** 获取字段选项 */
  getFieldOptions: (field: FormFieldSchema) => OptionSchema[];
  /** 验证单个字段 */
  validateField: (name: string) => Promise<boolean>;
  /** 验证整个表单 */
  validateForm: () => Promise<boolean>;
  /** 重置表单 */
  reset: () => void;
}

export function useDynamicForm(
  options: UseDynamicFormOptions
): UseDynamicFormReturn {
  const {
    schema,
    initialValues = {},
    onChange,
    optionsLoader,
    validators
  } = options;

  const configEngine = useMemo(() => new ConfigEngine(), []);

  // 表单值（从外部初始值初始化）
  const [values, setValuesState] = useState<Record<string, any>>(() => {
    const defaultValues: Record<string, any> = {};

    // 从 schema 中提取默认值
    schema.forEach(field => {
      if (field.defaultValue !== undefined) {
        defaultValues[field.name] = field.defaultValue;
      }
    });

    // 合并初始值
    return { ...defaultValues, ...initialValues };
  });

  // 表单错误
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 动态加载的选项（运行时数据，非硬编码）
  const [loadedOptions, setLoadedOptions] = useState<Record<string, OptionSchema[]>>({});

  // 计算可见字段
  const visibleFields = useMemo(() => {
    return schema.filter(field => configEngine.isFieldVisible(field, values));
  }, [schema, values, configEngine]);

  // 加载字段选项
  useEffect(() => {
    if (optionsLoader) {
      schema.forEach(async field => {
        if (field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') {
          try {
            const options = await optionsLoader(field);
            setLoadedOptions(prev => ({
              ...prev,
              [field.name]: options
            }));
          } catch (error) {
            console.error(`加载选项失败 [${field.name}]:`, error);
          }
        }
      });
    }
  }, [schema, optionsLoader]);

  // 设置字段值
  const setValue = useCallback((name: string, value: any) => {
    setValuesState(prev => {
      const newValues = { ...prev, [name]: value };
      onChange?.(newValues);
      return newValues;
    });

    // 清除该字段的错误
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, [onChange]);

  // 批量设置值
  const setValues = useCallback((newValues: Record<string, any>) => {
    setValuesState(prev => {
      const mergedValues = { ...prev, ...newValues };
      onChange?.(mergedValues);
      return mergedValues;
    });
  }, [onChange]);

  // 获取字段值
  const getValue = useCallback((name: string) => {
    return values[name];
  }, [values]);

  // 判断字段是否可见
  const isFieldVisible = useCallback((field: FormFieldSchema) => {
    return configEngine.isFieldVisible(field, values);
  }, [configEngine, values]);

  // 判断字段是否禁用
  const isFieldDisabled = useCallback((field: FormFieldSchema) => {
    return configEngine.isFieldDisabled(field, values);
  }, [configEngine, values]);

  // 获取字段选项（优先使用动态加载的选项）
  const getFieldOptions = useCallback((field: FormFieldSchema) => {
    return loadedOptions[field.name] || field.options || [];
  }, [loadedOptions]);

  // 验证单个字段
  const validateField = useCallback(async (name: string) => {
    const field = schema.find(f => f.name === name);
    if (!field) return true;

    const value = values[name];
    const result = await configEngine.validateField(field, value, validators);

    if (!result.valid && result.error) {
      setErrors(prev => ({ ...prev, [name]: result.error! }));
      return false;
    }

    return true;
  }, [schema, values, configEngine, validators]);

  // 验证整个表单
  const validateForm = useCallback(async () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    for (const field of visibleFields) {
      const value = values[field.name];
      const result = await configEngine.validateField(field, value, validators);

      if (!result.valid && result.error) {
        newErrors[field.name] = result.error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [visibleFields, values, configEngine, validators]);

  // 重置表单
  const reset = useCallback(() => {
    const defaultValues: Record<string, any> = {};

    schema.forEach(field => {
      if (field.defaultValue !== undefined) {
        defaultValues[field.name] = field.defaultValue;
      }
    });

    setValuesState({ ...defaultValues, ...initialValues });
    setErrors({});
  }, [schema, initialValues]);

  return {
    values,
    errors,
    visibleFields,
    setValue,
    setValues,
    getValue,
    isFieldVisible,
    isFieldDisabled,
    getFieldOptions,
    validateField,
    validateForm,
    reset
  };
}
