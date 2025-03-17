import type { NetworkRequest } from '@/types'
import { MessageAction } from '@/types'
import { createLogger } from '@/utils/logger'
import { convertHeadersToObject, getTimestampId, tryParseJSON } from '@/utils/network'

// 创建日志记录器
const logger = createLogger('DevTools')

// 保存已处理的请求ID，避免重复处理
const processedRequests = new Set<string>()

// 获取当前标签页ID
const currentTabId = chrome.devtools.inspectedWindow.tabId
logger.info('已连接到标签页:', currentTabId)

// 在DevTools启动时就开始监听网络请求
initDevTools()

/**
 * 初始化DevTools功能
 */
function initDevTools(): void {
  // 启动网络监听
  startNetworkListener()

  // 创建自定义面板
  createCustomPanel()

  // 设置DevTools关闭监听
  setupDisconnectListener()

  // 通知background页面DevTools已打开
  notifyDevtoolsOpened()
}

/**
 * 通知background DevTools已打开
 */
function notifyDevtoolsOpened(): void {
  chrome.runtime.sendMessage({
    action: MessageAction.DevtoolsOpened,
    tabId: currentTabId,
    timestamp: Date.now(),
  }).catch((err) => {
    logger.error('DevTools打开消息发送失败:', err)
  })
}

/**
 * 通知background DevTools已关闭
 */
function notifyDevtoolsClosed(): void {
  chrome.runtime.sendMessage({
    action: MessageAction.DevtoolsClosed,
    tabId: currentTabId,
    timestamp: Date.now(),
  }).catch((err) => {
    // 这里可能会有错误，因为DevTools关闭时无法发送消息，但这是正常的
    logger.debug('DevTools关闭消息发送失败:', err)
  })
}

/**
 * 创建并注册自定义面板
 */
function createCustomPanel(): void {
  chrome.devtools.panels.create(
    'Cypher',
    '/cypher.png',
    '/panels.html',
    (panel) => {
      logger.info('面板已创建')

      panel.onShown.addListener(() => {
        logger.debug('面板已显示')
      })

      panel.onHidden.addListener(() => {
        logger.debug('面板已隐藏')
      })
    },
  )
}

/**
 * 设置DevTools断开连接的监听器
 */
function setupDisconnectListener(): void {
  chrome.runtime.onConnect.addListener((port) => {
    port.onDisconnect.addListener(() => {
      notifyDevtoolsClosed()
    })
  })
}

/**
 * 将请求记录发送到background
 */
function sendNetworkRecord(record: NetworkRequest): void {
  chrome.runtime.sendMessage({
    action: MessageAction.NewCypherRecord,
    record,
  }).catch(err => logger.error('发送记录失败:', err))
}

/**
 * 处理请求完成事件
 */
function handleRequestFinished(request: chrome.devtools.network.Request): void {
  try {
    // 使用开始时间作为唯一标识
    const timestampId = getTimestampId(request.startedDateTime)

    // 检查是否已处理过此请求
    if (!timestampId || processedRequests.has(timestampId)) {
      return
    }

    // 标记为已处理
    processedRequests.add(timestampId)

    // 提取请求信息
    const { url, method, headers: requestHeadersArray, postData } = request.request
    const requestHeaders = convertHeadersToObject(requestHeadersArray)

    // 提取响应信息
    const { status, statusText = '', headers: responseHeadersArray } = request.response
    const responseHeaders = convertHeadersToObject(responseHeadersArray)

    // 计算持续时间（毫秒）
    const duration = request.time

    // 获取请求体
    const requestBody = postData?.text
      ? tryParseJSON<Record<string, any>>(postData.text)
      : undefined

    // 获取响应体
    request.getContent((content, encoding) => {
      try {
        // 尝试解析响应体
        const responseBody = content
          ? tryParseJSON<Record<string, any>>(content)
          : undefined

        // 创建完整的请求记录
        const record: NetworkRequest = {
          requestId: timestampId, // 使用timestampId作为requestId
          timestampId,
          url,
          method,
          duration,
          requestHeaders,
          responseHeaders,
          requestBody,
          status,
          statusText,
          responseBody,
          encoding,
        }

        // 发送记录到background
        sendNetworkRecord(record)
      }
      catch (e) {
        logger.error('处理响应体出错:', e)
      }
    })
  }
  catch (e) {
    logger.error('网络请求监听器出错:', e)
  }
}

/**
 * 启动网络请求监听
 */
function startNetworkListener(): void {
  logger.info('启动网络请求监听')

  // 监听网络请求完成事件
  chrome.devtools.network.onRequestFinished.addListener(handleRequestFinished)

  // 设置一个定时器清理过旧的处理记录
  setInterval(() => {
    if (processedRequests.size > 1000) {
      logger.info(`清理请求记录，当前大小: ${processedRequests.size}`)
      processedRequests.clear()
    }
  }, 60000) // 每分钟检查一次
}
