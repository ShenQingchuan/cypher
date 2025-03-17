import type { RequestBodyData } from '../../../src/types'
import { defineEventHandler, getQuery } from 'h3'

// 共享存储的埋点数据（与POST端点共享）
declare global {
  // eslint-disable-next-line no-var
  var trackingEvents: RequestBodyData[]
}

// 初始化全局变量
if (!globalThis.trackingEvents) {
  globalThis.trackingEvents = []
}

export default defineEventHandler((event) => {
  try {
    const query = getQuery(event)
    let events = [...globalThis.trackingEvents]

    // 根据查询参数过滤
    if (query.type) {
      events = events.filter(e => e.type === query.type)
    }

    if (query.limit) {
      const limit = Number.parseInt(query.limit as string)
      if (!Number.isNaN(limit) && limit > 0) {
        events = events.slice(0, limit)
      }
    }

    return {
      success: true,
      data: events,
      total: events.length,
      timestamp: Date.now(),
    }
  }
  catch (error) {
    return {
      success: false,
      error: '查询失败',
      message: error instanceof Error ? error.message : '未知错误',
    }
  }
})
