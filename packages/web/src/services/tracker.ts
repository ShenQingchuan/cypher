import type { RecordType, RequestBodyData } from '../types'

// 本地API端点，使用3888端口
const TRACKING_ENDPOINT = 'http://localhost:4888/api/track'

// 发送埋点请求
export async function sendTrackingEvent(type: RecordType, data: unknown): Promise<void> {
  const payload: RequestBodyData = {
    type,
    data,
    timestamp: Date.now(),
    userId: `user-${Math.random().toString(36).substring(2, 10)}`,
    sessionId: getOrCreateSessionId(),
  }

  try {
    console.log(`[Tracker] 开始发送${type}埋点:`, payload)

    const response = await fetch(TRACKING_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      // 添加跨域支持
      mode: 'cors',
      credentials: 'omit',
    })

    if (!response.ok) {
      console.error(`[Tracker] 请求失败: ${response.status} ${response.statusText}`)
      throw new Error(`请求失败: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    console.log(`[Tracker] 发送${type}埋点成功:`, result)

    return Promise.resolve()
  }
  catch (error) {
    console.error('[Tracker] 发送埋点请求失败:', error)
    // 在控制台打印更多错误详情，帮助调试
    if (error instanceof Error) {
      console.error('[Tracker] 错误详情:', error.message, error.stack)
    }
    return Promise.reject(error)
  }
}

// 获取或创建会话ID
function getOrCreateSessionId(): string {
  let sessionId = localStorage.getItem('tracking_session_id')

  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`
    localStorage.setItem('tracking_session_id', sessionId)
  }

  return sessionId
}

// 创建页面浏览埋点
export function trackPageView(pageName: string, referrer?: string): Promise<void> {
  return sendTrackingEvent('page-view', {
    pageName,
    url: window.location.href,
    referrer: referrer || document.referrer,
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
  })
}

// 创建点击埋点
export function trackClick(elementType: string, elementId?: string, elementText?: string): Promise<void> {
  return sendTrackingEvent(
    elementType === 'header' ? 'header-click' : 'button-click',
    {
      elementType,
      elementId,
      elementText,
      path: getElementPath(document.activeElement as HTMLElement),
    },
  )
}

// 创建订单埋点
export function trackOrder(stage: 'start' | 'complete', orderId: string, amount?: number): Promise<void> {
  return sendTrackingEvent(
    stage === 'start' ? 'order-start' : 'order-complete',
    {
      orderId,
      amount,
      items: stage === 'complete' ? Math.floor(Math.random() * 5) + 1 : undefined,
      currency: 'CNY',
    },
  )
}

// 创建表单提交埋点
export function trackFormSubmit(formId: string, formData: Record<string, unknown>): Promise<void> {
  return sendTrackingEvent('form-submit', {
    formId,
    formFields: Object.keys(formData),
    success: true,
  })
}

// 创建错误埋点
export function trackError(errorType: string, errorMessage: string, stackTrace?: string): Promise<void> {
  return sendTrackingEvent('error', {
    errorType,
    errorMessage,
    stackTrace,
    browserInfo: navigator.userAgent,
  })
}

// 自定义埋点
export function trackCustomEvent(eventName: string, eventData: Record<string, unknown>): Promise<void> {
  return sendTrackingEvent('custom', {
    eventName,
    ...eventData,
  })
}

// 获取元素路径
function getElementPath(element: HTMLElement | null): string {
  if (!element || element === document.body)
    return ''

  let path = element.tagName.toLowerCase()
  if (element.id)
    path += `#${element.id}`
  if (element.className) {
    const classes = element.className.split(' ').filter(c => c)
    if (classes.length)
      path += `.${classes.join('.')}`
  }

  return `${getElementPath(element.parentElement)} > ${path}`
}
