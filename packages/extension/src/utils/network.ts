/**
 * 尝试将文本解析为JSON对象
 * @param text 要解析的文本
 * @returns 解析后的对象，解析失败则返回原文本
 */
export function tryParseJSON<T>(text: string): T | string {
  if (!text)
    return text

  try {
    return JSON.parse(text) as T
  }
  catch {
    return text
  }
}

/**
 * 将headers数组转换为对象
 * @param headers 请求/响应头数组
 * @returns 转换后的头部对象
 */
export function convertHeadersToObject(headers: { name: string, value: string }[]): Record<string, string> {
  const result: Record<string, string> = {}

  for (const header of headers) {
    if (header.name && header.value !== undefined) {
      result[header.name] = header.value
    }
  }

  return result
}

/**
 * 从日期时间获取时间戳ID
 * @param dateTime 日期时间字符串
 * @returns 时间戳ID
 */
export function getTimestampId(dateTime: string): string {
  return String(new Date(dateTime).getTime())
}

/**
 * 格式化时间戳为本地时间
 * @param timestamp 时间戳
 * @returns 格式化后的时间字符串
 */
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString()
}

/**
 * 格式化请求持续时间
 * @param duration 持续时间（毫秒）
 * @returns 格式化后的持续时间字符串
 */
export function formatDuration(duration: number): string {
  if (duration < 1000) {
    return `${Math.round(duration)}ms`
  }
  else {
    return `${(duration / 1000).toFixed(2)}s`
  }
}

/**
 * 判断响应状态码是否表示错误
 * @param status HTTP状态码
 * @returns 是否为错误状态
 */
export function isErrorStatus(status: number): boolean {
  return status >= 400
}

/**
 * 在内容中搜索指定文本
 * @param content 要搜索的内容
 * @param searchText 搜索文本
 * @returns 是否找到匹配
 */
export function searchInContent(content: any, searchText: string): boolean {
  if (!content)
    return false

  const text = searchText.toLowerCase()

  // 如果是字符串
  if (typeof content === 'string') {
    return content.toLowerCase().includes(text)
  }

  // 如果是对象或数组
  if (typeof content === 'object') {
    try {
      const jsonStr = JSON.stringify(content)
      return jsonStr.toLowerCase().includes(text)
    }
    catch {
      return false
    }
  }

  return false
}

/**
 * 在响应头中搜索
 * @param headers 头部对象
 * @param searchText 搜索文本
 * @returns 是否找到匹配
 */
export function searchInHeaders(headers: Record<string, string>, searchText: string): boolean {
  const text = searchText.toLowerCase()

  return Object.entries(headers).some(([key, value]) => {
    return key.toLowerCase().includes(text) || (value && value.toLowerCase().includes(text))
  })
}
