import type { NetworkRequest } from '@/types'
import { MessageAction } from '@/types'
import { createLogger } from '@/utils/logger'

// 创建日志记录器
const logger = createLogger('Background')

export default defineBackground(() => {
  logger.info('初始化', { id: browser.runtime.id })

  // 记录活跃的 DevTools 标签页 ID
  const activeTabIds = new Set<number>()

  // 监听来自devtools的消息
  browser.runtime.onMessage.addListener(handleRuntimeMessage)

  /**
   * 处理运行时消息
   */
  function handleRuntimeMessage(
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse?: (response?: any) => void,
  ): boolean {
    // 处理DevTools面板打开的消息
    if (message.action === MessageAction.DevtoolsOpened) {
      handleDevtoolsOpened(message, sendResponse)
    }
    // 处理DevTools面板关闭的消息
    else if (message.action === MessageAction.DevtoolsClosed) {
      handleDevtoolsClosed(message, sendResponse)
    }
    // 处理新的网络请求记录消息
    else if (message.action === MessageAction.NewCypherRecord && message.record) {
      handleNewNetworkRecord(message.record, sendResponse)
    }

    return true // 异步响应
  }

  /**
   * 处理DevTools面板打开消息
   */
  function handleDevtoolsOpened(
    message: { tabId: number, timestamp: number },
    sendResponse?: (response?: any) => void,
  ): void {
    // 添加当前标签页 ID 到活跃集合
    if (message.tabId) {
      activeTabIds.add(message.tabId)
      logger.info('DevTools面板已打开, 标签页ID:', message.tabId)
    }

    if (sendResponse) {
      sendResponse({ success: true })
    }
  }

  /**
   * 处理DevTools面板关闭消息
   */
  function handleDevtoolsClosed(
    message: { tabId: number, timestamp: number },
    sendResponse?: (response?: any) => void,
  ): void {
    // 从活跃集合中移除标签页 ID
    if (message.tabId) {
      activeTabIds.delete(message.tabId)
      logger.info('DevTools面板已关闭, 标签页ID:', message.tabId)
    }

    if (sendResponse) {
      sendResponse({ success: true })
    }
  }

  /**
   * 处理新的网络请求记录
   */
  function handleNewNetworkRecord(
    record: NetworkRequest,
    sendResponse?: (response?: any) => void,
  ): void {
    // 将请求记录转发到面板
    forwardToPanels(record)

    if (sendResponse) {
      sendResponse({ success: true })
    }
  }

  /**
   * 将请求记录转发到面板
   */
  function forwardToPanels(record: NetworkRequest): void {
    browser.runtime.sendMessage({
      action: MessageAction.NewRequest,
      request: record,
    }).catch(err => logger.error('面板通信错误:', err))
  }
})
