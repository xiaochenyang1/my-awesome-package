/**
 * 配置引擎
 *
 * 职责：
 * 1. 解析和验证配置
 * 2. 处理表达式求值
 * 3. 管理配置转换
 *
 * 原则：
 * - 不包含任何硬编码数据
 * - 所有数据从外部传入
 * - 完全可扩展
 */

import type {
  FlowConfig,
  NodeConfig,
  FormFieldSchema,
  ValidationResult,
  OptionSchema
} from '../types';

export class ConfigEngine {
  /**
   * 验证流程配置
   * @param config - 流程配置（从外部传入）
   * @returns 验证结果
   */
  validateConfig(config: FlowConfig): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 验证基础字段
    if (!config.id) errors.push('流程缺少 id');
    if (!config.name) errors.push('流程缺少 name');
    if (!config.version) errors.push('流程缺少 version');

    // 验证节点
    if (!config.nodes || config.nodes.length === 0) {
      errors.push('流程至少需要一个节点');
    } else {
      const nodeIds = new Set<string>();
      config.nodes.forEach((node, index) => {
        if (!node.id) {
          errors.push(`节点 [${index}] 缺少 id`);
        } else if (nodeIds.has(node.id)) {
          errors.push(`节点 id "${node.id}" 重复`);
        } else {
          nodeIds.add(node.id);
        }

        if (!node.type) {
          errors.push(`节点 "${node.id}" 缺少 type`);
        }
        if (!node.title) {
          errors.push(`节点 "${node.id}" 缺少 title`);
        }
      });

      // 验证连线
      if (config.edges) {
        config.edges.forEach((edge, index) => {
          if (!edge.id) {
            errors.push(`连线 [${index}] 缺少 id`);
          }
          if (!edge.source) {
            errors.push(`连线 "${edge.id}" 缺少 source`);
          } else if (!nodeIds.has(edge.source)) {
            errors.push(`连线 "${edge.id}" 的源节点 "${edge.source}" 不存在`);
          }
          if (!edge.target) {
            errors.push(`连线 "${edge.id}" 缺少 target`);
          } else if (!nodeIds.has(edge.target)) {
            errors.push(`连线 "${edge.id}" 的目标节点 "${edge.target}" 不存在`);
          }
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 解析表单字段的可见性
   * @param field - 表单字段配置（从外部传入）
   * @param values - 当前表单值（从外部传入）
   * @returns 是否可见
   */
  isFieldVisible(field: FormFieldSchema, values: Record<string, any>): boolean {
    if (field.visible === undefined || field.visible === null) {
      return true;
    }

    // 如果是布尔值，直接返回
    if (typeof field.visible === 'boolean') {
      return field.visible;
    }

    // 如果是字符串，作为表达式求值
    if (typeof field.visible === 'string') {
      return this.evaluateExpression(field.visible, values);
    }

    return true;
  }

  /**
   * 解析表单字段的禁用状态
   * @param field - 表单字段配置（从外部传入）
   * @param values - 当前表单值（从外部传入）
   * @returns 是否禁用
   */
  isFieldDisabled(field: FormFieldSchema, values: Record<string, any>): boolean {
    if (field.disabled === undefined || field.disabled === null) {
      return false;
    }

    // 如果是布尔值，直接返回
    if (typeof field.disabled === 'boolean') {
      return field.disabled;
    }

    // 如果是字符串，作为表达式求值
    if (typeof field.disabled === 'string') {
      return this.evaluateExpression(field.disabled, values);
    }

    return false;
  }

  /**
   * 表达式求值（简单实现）
   * @param expression - 表达式字符串（从外部传入）
   * @param context - 上下文数据（从外部传入）
   * @returns 表达式结果
   *
   * 示例：
   * - "type === 'sick'" -> 判断 type 字段是否等于 'sick'
   * - "amount > 10000" -> 判断 amount 字段是否大于 10000
   * - "status === 'approved' && amount > 5000" -> 复杂条件
   */
  evaluateExpression(expression: string, context: Record<string, any>): boolean {
    try {
      // 创建函数，使用 context 中的键作为参数
      const keys = Object.keys(context);
      const values = Object.values(context);
      const func = new Function(...keys, `return ${expression}`);
      return Boolean(func(...values));
    } catch (error) {
      console.warn('表达式求值失败:', expression, error);
      return false;
    }
  }

  /**
   * 获取字段的有效选项
   * @param field - 表单字段配置（从外部传入）
   * @param allOptions - 所有选项数据（从外部传入或动态加载）
   * @returns 有效选项列表
   */
  getFieldOptions(
    field: FormFieldSchema,
    allOptions?: OptionSchema[]
  ): OptionSchema[] {
    // 优先使用传入的选项数据
    if (allOptions && allOptions.length > 0) {
      return allOptions;
    }

    // 否则使用字段配置中的选项
    return field.options || [];
  }

  /**
   * 验证字段值
   * @param field - 表单字段配置（从外部传入）
   * @param value - 字段值（从外部传入）
   * @param validators - 自定义验证器（从外部传入）
   * @returns 验证结果
   */
  async validateField(
    field: FormFieldSchema,
    value: any,
    validators?: Record<string, (value: any, context?: any) => boolean | Promise<boolean>>
  ): Promise<{ valid: boolean; error?: string }> {
    // 必填验证
    if (field.required && (value === undefined || value === null || value === '')) {
      return {
        valid: false,
        error: `${field.label}不能为空`
      };
    }

    // 自定义验证规则
    if (field.validation && field.validation.length > 0) {
      for (const rule of field.validation) {
        const result = await this.validateRule(rule, value, validators);
        if (!result.valid) {
          return result;
        }
      }
    }

    return { valid: true };
  }

  /**
   * 执行验证规则
   * @param rule - 验证规则（从外部传入）
   * @param value - 字段值（从外部传入）
   * @param validators - 自定义验证器（从外部传入）
   * @returns 验证结果
   */
  private async validateRule(
    rule: any,
    value: any,
    validators?: Record<string, (value: any, context?: any) => boolean | Promise<boolean>>
  ): Promise<{ valid: boolean; error?: string }> {
    switch (rule.type) {
      case 'required':
        if (value === undefined || value === null || value === '') {
          return { valid: false, error: rule.message };
        }
        break;

      case 'pattern':
        if (rule.value && !new RegExp(rule.value).test(String(value))) {
          return { valid: false, error: rule.message };
        }
        break;

      case 'min':
        if (typeof value === 'number' && value < rule.value) {
          return { valid: false, error: rule.message };
        }
        if (typeof value === 'string' && value.length < rule.value) {
          return { valid: false, error: rule.message };
        }
        break;

      case 'max':
        if (typeof value === 'number' && value > rule.value) {
          return { valid: false, error: rule.message };
        }
        if (typeof value === 'string' && value.length > rule.value) {
          return { valid: false, error: rule.message };
        }
        break;

      case 'custom':
        // 使用自定义验证器（从外部传入）
        if (rule.validator && validators && validators[rule.validator]) {
          try {
            const isValid = await validators[rule.validator](value);
            if (!isValid) {
              return { valid: false, error: rule.message };
            }
          } catch (error) {
            return { valid: false, error: rule.message };
          }
        }
        break;
    }

    return { valid: true };
  }

  /**
   * 深度克隆配置
   * @param config - 配置对象（从外部传入）
   * @returns 克隆后的配置
   */
  cloneConfig<T>(config: T): T {
    return JSON.parse(JSON.stringify(config));
  }
}
