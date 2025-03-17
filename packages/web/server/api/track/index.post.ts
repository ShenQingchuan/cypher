import type { RequestBodyData } from '../../../src/types'
import { defineEventHandler, readBody } from 'h3'

// 共享存储的埋点数据
declare global {
  // eslint-disable-next-line no-var
  var trackingEvents: RequestBodyData[]
}

// 初始化全局变量
if (!globalThis.trackingEvents) {
  globalThis.trackingEvents = []
}

export default defineEventHandler(async (event) => {
  try {
    // 读取请求体
    const body = await readBody<RequestBodyData>(event)

    // 添加服务器接收时间戳
    const eventWithTimestamp = {
      ...body,
      receivedAt: Date.now(),
    }

    // 存储事件数据
    globalThis.trackingEvents.unshift(eventWithTimestamp)

    // 限制存储的事件数量
    if (globalThis.trackingEvents.length > 100) {
      globalThis.trackingEvents.pop()
    }

    console.log(`[API] 收到埋点: ${body.type}`, body)

    // 模拟随机延迟
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 200))

    // 返回成功响应
    return {
      success: true,
      message: `埋点 ${body.type} 已接收`,
      timestamp: Date.now(),
    }
  }
  catch (error) {
    // 返回错误响应
    console.error('[API] 处理埋点请求失败:', error)
    return {
      success: false,
      error: '处理请求失败',
      message: error instanceof Error ? error.message : '未知错误',
    }
  }
})
