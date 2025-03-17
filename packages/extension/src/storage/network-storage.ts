import type { FilterOptions, NetworkRequest } from '@/types'
import { MessageAction } from '@/types'
import { createLogger } from '@/utils/logger'
import { searchInContent, searchInHeaders } from '@/utils/network'

// 创建日志记录器
const logger = createLogger('NetworkStorage')

// 存储结构：使用Map而不是数组以提高查找和插入效率
// 按时间戳ID存储请求
const requestsMap = new Map<string, NetworkRequest>()
// 保存按时间戳排序的ID列表，用于分页和排序
let sortedRequestIds: string[] = []
let isNetworkStorageInitialized = false

// 最大存储请求数量
const MAX_REQUESTS = 1000
// 缓存最新的过滤结果，避免重复计算
let lastFilterOptions: FilterOptions | null = null
let lastFilteredRequests: NetworkRequest[] = []

/**
 * 初始化网络存储和消息监听
 */
export async function initNetworkStorage(): Promise<void> {
  if (isNetworkStorageInitialized)
    return

  // 清空请求数据 - 每次打开面板时清空
  clearRequests({ notify: false })

  // 监听来自background的消息
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // 处理新的请求消息
    if (message.action === MessageAction.NewRequest && message.request) {
      // 存储请求
      storeRequest(message.request)

      // 响应消息
      if (sendResponse) {
        sendResponse({ success: true })
      }
    }

    // 返回true表示异步响应
    return true
  })

  logger.info('网络存储初始化完成')
  isNetworkStorageInitialized = true
}

/**
 * 解析请求体
 */
export function parseRequestBody(body: string | undefined): object | string | undefined {
  if (!body)
    return undefined

  try {
    // 尝试解析为JSON
    return JSON.parse(body)
  }
  catch {
    // 如果不是有效的JSON，返回原始格式
    return body
  }
}

/**
 * 存储请求到内存中
 * 使用Map结构优化存取性能
 */
function storeRequest(request: NetworkRequest | null | undefined): void {
  if (!request || !request.timestampId)
    return

  const { timestampId } = request

  // 检查是否已达到最大容量
  if (requestsMap.size >= MAX_REQUESTS && !requestsMap.has(timestampId)) {
    // 移除最老的一条记录
    if (sortedRequestIds.length > 0) {
      const oldestId = sortedRequestIds[0]
      requestsMap.delete(oldestId)
      sortedRequestIds.shift()
    }
  }

  // 存储或更新请求
  requestsMap.set(timestampId, request)

  // 如果是新请求，更新排序列表
  if (!sortedRequestIds.includes(timestampId)) {
    // 添加到排序列表
    sortedRequestIds.push(timestampId)
    // 确保排序列表按时间戳排序（升序）
    sortedRequestIds.sort((a, b) => Number(a) - Number(b))
  }

  // 重置过滤缓存
  lastFilterOptions = null
  lastFilteredRequests = []

  // 通知 UI 更新
  notifyUIUpdate()
}

/**
 * 添加新的请求
 */
export function addRequest(request: NetworkRequest | null | undefined): void {
  storeRequest(request)
}

/**
 * 清空所有请求
 */
export function clearRequests({ notify = true }: { notify?: boolean } = {}): void {
  requestsMap.clear()
  sortedRequestIds = []
  lastFilterOptions = null
  lastFilteredRequests = []

  if (notify) {
    notifyUIUpdate()
  }
}

/**
 * 应用单个过滤条件
 */
function applyFilter(
  request: NetworkRequest,
  filterKey: keyof FilterOptions,
  filterValue: any,
): boolean {
  if (!filterValue)
    return true

  switch (filterKey) {
    case 'searchText':
      return request.url.toLowerCase().includes(String(filterValue).toLowerCase())

    case 'timeStart':
      return Number(request.timestampId) >= Number(filterValue)

    case 'timeEnd':
      return Number(request.timestampId) <= Number(filterValue)

    case 'statusCode': {
      const statusStr = String(filterValue)
      if (statusStr.endsWith('xx')) {
        // 匹配状态码类别，如 2xx, 4xx 等
        const prefix = statusStr.charAt(0)
        return request.status.toString().startsWith(prefix)
      }
      return request.status.toString() === statusStr
    }

    case 'method':
      return request.method === filterValue

    case 'onlyErrors':
      return filterValue ? (Boolean(request.error) || request.status >= 400) : true

    case 'requestHeaderSearch':
      return searchInHeaders(request.requestHeaders, String(filterValue))

    case 'requestBodySearch':
      return searchInContent(request.requestBody, String(filterValue))

    case 'responseHeaderSearch':
      return searchInHeaders(request.responseHeaders, String(filterValue))

    case 'responseBodySearch':
      return searchInContent(request.responseBody, String(filterValue))

    default:
      return true
  }
}

/**
 * 获取经过过滤的请求列表
 * 优化过滤算法，使用缓存提高性能
 */
export function getFilteredRequests(filter: FilterOptions = {}): NetworkRequest[] {
  // 如果没有过滤条件，直接返回所有请求（倒序）
  if (!filter || Object.keys(filter).length === 0) {
    const allRequests = sortedRequestIds.map(id => requestsMap.get(id)!)
    return [...allRequests].reverse()
  }

  // 检查是否可以使用缓存的过滤结果
  if (lastFilterOptions && isFilterEqual(filter, lastFilterOptions)) {
    return lastFilteredRequests
  }

  // 应用所有过滤条件
  const filtered = sortedRequestIds
    .map(id => requestsMap.get(id)!)
    .filter((request) => {
      // 所有过滤条件必须满足
      return Object.entries(filter).every(([key, value]) => {
        if (value === undefined || value === null)
          return true
        return applyFilter(request, key as keyof FilterOptions, value)
      })
    })
    .reverse() // 最新的请求在前面

  // 缓存过滤结果
  lastFilterOptions = { ...filter }
  lastFilteredRequests = filtered

  return filtered
}

/**
 * 比较两个过滤条件是否相同
 */
function isFilterEqual(filter1: FilterOptions, filter2: FilterOptions): boolean {
  const keys1 = Object.keys(filter1)
  const keys2 = Object.keys(filter2)

  if (keys1.length !== keys2.length)
    return false

  return keys1.every((key) => {
    const k = key as keyof FilterOptions
    return filter1[k] === filter2[k]
  })
}

/**
 * 根据ID获取请求
 */
export function getRequestById(id: string): NetworkRequest | undefined {
  return requestsMap.get(id)
}

/**
 * 通知UI更新
 */
function notifyUIUpdate(): void {
  // 使用自定义事件通知UI
  document.dispatchEvent(new CustomEvent('requestsUpdated'))
}
