/**
 * 流程模型
 *
 * 职责：
 * 1. 管理流程配置数据
 * 2. 提供节点和连线的 CRUD 操作
 * 3. 触发配置变化事件
 *
 * 原则：
 * - 不包含任何硬编码数据
 * - 所有数据从外部传入
 * - 所有操作都触发事件
 */

import type { FlowConfig, NodeConfig, EdgeConfig } from '../types';
import { EventEngine } from '../engine/EventEngine';
import { ConfigEngine } from '../engine/ConfigEngine';

export class FlowModel {
  /** 流程配置（从外部传入） */
  private config: FlowConfig;

  /** 事件引擎 */
  private eventEngine: EventEngine;

  /** 配置引擎 */
  private configEngine: ConfigEngine;

  constructor(config: FlowConfig, options?: {
    enableHistory?: boolean;
  }) {
    this.config = config;
    this.eventEngine = new EventEngine({
      enableHistory: options?.enableHistory ?? false
    });
    this.configEngine = new ConfigEngine();
  }

  /**
   * 获取流程配置
   */
  getConfig(): FlowConfig {
    return this.configEngine.cloneConfig(this.config);
  }

  /**
   * 更新流程配置
   * @param config - 新的流程配置（从外部传入）
   */
  setConfig(config: FlowConfig): void {
    this.config = this.configEngine.cloneConfig(config);
    this.eventEngine.emit('config:change', this.config);
  }

  /**
   * 获取所有节点
   */
  getNodes(): NodeConfig[] {
    return this.configEngine.cloneConfig(this.config.nodes);
  }

  /**
   * 获取指定节点
   * @param nodeId - 节点 ID（从外部传入）
   */
  getNode(nodeId: string): NodeConfig | undefined {
    const node = this.config.nodes.find(n => n.id === nodeId);
    return node ? this.configEngine.cloneConfig(node) : undefined;
  }

  /**
   * 添加节点
   * @param node - 节点配置（从外部传入）
   */
  addNode(node: NodeConfig): void {
    this.config.nodes.push(this.configEngine.cloneConfig(node));
    this.eventEngine.emit('node:add', node);
    this.eventEngine.emit('config:change', this.config);
  }

  /**
   * 更新节点
   * @param nodeId - 节点 ID（从外部传入）
   * @param updates - 更新内容（从外部传入）
   */
  updateNode(nodeId: string, updates: Partial<NodeConfig>): void {
    const index = this.config.nodes.findIndex(n => n.id === nodeId);
    if (index !== -1) {
      this.config.nodes[index] = {
        ...this.config.nodes[index],
        ...updates
      };
      this.eventEngine.emit('node:update', {
        nodeId,
        updates
      });
      this.eventEngine.emit('config:change', this.config);
    }
  }

  /**
   * 删除节点
   * @param nodeId - 节点 ID（从外部传入）
   */
  removeNode(nodeId: string): void {
    const index = this.config.nodes.findIndex(n => n.id === nodeId);
    if (index !== -1) {
      const node = this.config.nodes[index];
      this.config.nodes.splice(index, 1);

      // 同时删除相关连线
      this.config.edges = this.config.edges.filter(
        e => e.source !== nodeId && e.target !== nodeId
      );

      this.eventEngine.emit('node:remove', node);
      this.eventEngine.emit('config:change', this.config);
    }
  }

  /**
   * 获取所有连线
   */
  getEdges(): EdgeConfig[] {
    return this.configEngine.cloneConfig(this.config.edges);
  }

  /**
   * 获取指定连线
   * @param edgeId - 连线 ID（从外部传入）
   */
  getEdge(edgeId: string): EdgeConfig | undefined {
    const edge = this.config.edges.find(e => e.id === edgeId);
    return edge ? this.configEngine.cloneConfig(edge) : undefined;
  }

  /**
   * 添加连线
   * @param edge - 连线配置（从外部传入）
   */
  addEdge(edge: EdgeConfig): void {
    this.config.edges.push(this.configEngine.cloneConfig(edge));
    this.eventEngine.emit('edge:add', edge);
    this.eventEngine.emit('config:change', this.config);
  }

  /**
   * 更新连线
   * @param edgeId - 连线 ID（从外部传入）
   * @param updates - 更新内容（从外部传入）
   */
  updateEdge(edgeId: string, updates: Partial<EdgeConfig>): void {
    const index = this.config.edges.findIndex(e => e.id === edgeId);
    if (index !== -1) {
      this.config.edges[index] = {
        ...this.config.edges[index],
        ...updates
      };
      this.eventEngine.emit('edge:update', {
        edgeId,
        updates
      });
      this.eventEngine.emit('config:change', this.config);
    }
  }

  /**
   * 删除连线
   * @param edgeId - 连线 ID（从外部传入）
   */
  removeEdge(edgeId: string): void {
    const index = this.config.edges.findIndex(e => e.id === edgeId);
    if (index !== -1) {
      const edge = this.config.edges[index];
      this.config.edges.splice(index, 1);
      this.eventEngine.emit('edge:remove', edge);
      this.eventEngine.emit('config:change', this.config);
    }
  }

  /**
   * 验证流程配置
   */
  validate() {
    return this.configEngine.validateConfig(this.config);
  }

  /**
   * 订阅事件
   */
  on(type: any, listener: any) {
    return this.eventEngine.on(type, listener);
  }

  /**
   * 取消订阅事件
   */
  off(type: any, listener: any) {
    return this.eventEngine.off(type, listener);
  }

  /**
   * 订阅一次性事件
   */
  once(type: any, listener: any) {
    return this.eventEngine.once(type, listener);
  }

  /**
   * 导出配置（JSON）
   */
  toJSON(): FlowConfig {
    return this.configEngine.cloneConfig(this.config);
  }

  /**
   * 从 JSON 加载配置
   * @param json - JSON 配置（从外部传入）
   */
  fromJSON(json: FlowConfig): void {
    this.setConfig(json);
  }
}
