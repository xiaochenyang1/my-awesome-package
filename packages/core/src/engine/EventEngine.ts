/**
 * 事件引擎
 *
 * 职责：
 * 1. 事件发布订阅
 * 2. 事件传播
 * 3. 事件历史记录
 *
 * 原则：
 * - 不包含任何硬编码的事件类型
 * - 完全由用户定义事件
 * - 支持任意事件类型
 */

import type { FlowEvent, FlowEventType, EventListener } from '../types';

export class EventEngine {
  /** 事件监听器映射（运行时数据，非硬编码） */
  private listeners: Map<FlowEventType, Set<EventListener>> = new Map();

  /** 事件历史记录（运行时数据，非硬编码） */
  private history: FlowEvent[] = [];

  /** 是否启用历史记录（从外部配置） */
  private enableHistory: boolean;

  /** 最大历史记录数（从外部配置） */
  private maxHistorySize: number;

  constructor(options?: {
    enableHistory?: boolean;
    maxHistorySize?: number;
  }) {
    this.enableHistory = options?.enableHistory ?? false;
    this.maxHistorySize = options?.maxHistorySize ?? 100;
  }

  /**
   * 订阅事件
   * @param type - 事件类型（从外部传入）
   * @param listener - 事件监听器（从外部传入）
   */
  on<T = any>(type: FlowEventType, listener: EventListener<T>): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }

    this.listeners.get(type)!.add(listener as EventListener);

    // 返回取消订阅函数
    return () => this.off(type, listener);
  }

  /**
   * 取消订阅事件
   * @param type - 事件类型（从外部传入）
   * @param listener - 事件监听器（从外部传入）
   */
  off<T = any>(type: FlowEventType, listener: EventListener<T>): void {
    const listeners = this.listeners.get(type);
    if (listeners) {
      listeners.delete(listener as EventListener);
      if (listeners.size === 0) {
        this.listeners.delete(type);
      }
    }
  }

  /**
   * 发布事件
   * @param type - 事件类型（从外部传入）
   * @param data - 事件数据（从外部传入）
   */
  emit<T = any>(type: FlowEventType, data: T): void {
    const event: FlowEvent<T> = {
      type,
      data,
      timestamp: Date.now()
    };

    // 记录历史
    if (this.enableHistory) {
      this.history.push(event);
      // 限制历史记录数量
      if (this.history.length > this.maxHistorySize) {
        this.history.shift();
      }
    }

    // 触发监听器
    const listeners = this.listeners.get(type);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(event);
        } catch (error) {
          console.error(`事件监听器执行失败 [${type}]:`, error);
        }
      });
    }
  }

  /**
   * 订阅一次性事件
   * @param type - 事件类型（从外部传入）
   * @param listener - 事件监听器（从外部传入）
   */
  once<T = any>(type: FlowEventType, listener: EventListener<T>): () => void {
    const wrapper: EventListener<T> = (event) => {
      listener(event);
      this.off(type, wrapper);
    };

    return this.on(type, wrapper);
  }

  /**
   * 获取事件历史记录
   * @param type - 可选，过滤特定类型的事件
   * @returns 事件历史列表
   */
  getHistory(type?: FlowEventType): FlowEvent[] {
    if (!this.enableHistory) {
      console.warn('事件历史记录未启用');
      return [];
    }

    if (type) {
      return this.history.filter(event => event.type === type);
    }

    return [...this.history];
  }

  /**
   * 清空事件历史记录
   */
  clearHistory(): void {
    this.history = [];
  }

  /**
   * 清空所有事件监听器
   */
  clear(): void {
    this.listeners.clear();
  }

  /**
   * 获取所有已订阅的事件类型
   * @returns 事件类型列表
   */
  getEventTypes(): FlowEventType[] {
    return Array.from(this.listeners.keys());
  }

  /**
   * 获取指定事件类型的监听器数量
   * @param type - 事件类型
   * @returns 监听器数量
   */
  getListenerCount(type: FlowEventType): number {
    return this.listeners.get(type)?.size ?? 0;
  }
}
