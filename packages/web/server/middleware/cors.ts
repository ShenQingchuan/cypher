import { defineEventHandler, setResponseHeaders } from 'h3'

export default defineEventHandler((event) => {
  // 设置基本的CORS响应头
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  })

  // 如果是OPTIONS请求，立即返回200响应
  const method = event.method
  if (method === 'OPTIONS') {
    event.node.res.statusCode = 200
    event.node.res.end()
  }
})
