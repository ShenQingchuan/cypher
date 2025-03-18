import type { NetworkRequest } from '@/types'
import { formatDuration, formatTimestamp } from '@/utils/network'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { getStatusColor } from '../utils/tag'

interface RequestListProps {
  requests: NetworkRequest[]
  selectedId: string | null
  showDetailPanel: boolean
  onSelectRequest: (id: string) => void
}

// 单个请求项组件 - 使用memo优化渲染性能
const RequestItem = memo(({
  request,
  isSelected,
  onClick,
}: {
  request: NetworkRequest
  isSelected: boolean
  onClick: () => void
}) => {
  let pathname: string
  try {
    pathname = new URL(request.url).pathname
  }
  catch {
    pathname = request.url // 回退到完整URL
  }

  return (
    <div
      className={`px-4 py-3 cursor-pointer transition-colors ${
        isSelected
          ? 'bg-neutral-100 dark:bg-neutral-800'
          : 'bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        {/* 左侧信息：Method + 状态码 + URL */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-1">
            {/* Method 标签 */}
            <span className="inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {request.method}
            </span>

            {/* 状态码 */}
            <span className={`inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-medium rounded text-white ${getStatusColor(request.status)}`}>
              {request.status}
            </span>

            {/* URL 显示 */}
            <div className="text-sm font-medium truncate text-neutral-900 dark:text-neutral-100 font-mono">
              {pathname}
            </div>
          </div>
        </div>

        {/* 右侧信息：耗时 + 发起时间 */}
        <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center whitespace-nowrap">
          <div className="mr-2 text-neutral-500 dark:text-neutral-400 font-mono">
            {formatTimestamp(Number(request.timestampId))}
          </div>
          <div className="text-neutral-700 dark:text-neutral-400:50 select-none">
            耗时：
            {formatDuration(request.duration || 0)}
          </div>
        </div>
      </div>
    </div>
  )
})

RequestItem.displayName = 'RequestItem'

// 定义列表项高度和缓冲区大小
const ITEM_HEIGHT = 72 // 单个请求项的高度（px）
const BUFFER_SIZE = 5 // 上下缓冲区个数

export const RequestList: React.FC<RequestListProps> = ({
  requests,
  selectedId,
  onSelectRequest,
  showDetailPanel,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 })

  // 处理滚动事件，计算可见范围
  const handleScroll = useCallback(() => {
    if (!containerRef.current)
      return

    const { scrollTop, clientHeight } = containerRef.current
    const start = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER_SIZE)
    const end = Math.min(
      requests.length,
      Math.ceil((scrollTop + clientHeight) / ITEM_HEIGHT) + BUFFER_SIZE,
    )

    setVisibleRange({ start, end })
  }, [requests.length])

  // 监听滚动事件
  useEffect(() => {
    const container = containerRef.current
    if (!container)
      return

    container.addEventListener('scroll', handleScroll)
    handleScroll() // 初始计算

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  // 监听请求数量变化，重新计算可见范围
  useEffect(() => {
    handleScroll()
  }, [requests.length, handleScroll])

  // 计算列表总高度
  const totalHeight = requests.length * ITEM_HEIGHT

  // 生成只有可见部分的虚拟列表
  const visibleItems = requests.slice(visibleRange.start, visibleRange.end)

  // 计算顶部填充高度
  const paddingTop = visibleRange.start * ITEM_HEIGHT

  return (
    <div className="flex-1 h-full overflow-hidden flex flex-col bg-white dark:bg-neutral-900">
      <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-700 flex justify-between items-center">
        <h3 className="font-medium text-neutral-900 dark:text-neutral-100">请求列表</h3>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {requests.length}
          {' '}
          个请求
        </span>
      </div>

      <div ref={containerRef} className="flex-1 overflow-auto">
        {requests.length === 0
          ? (
              <div className="h-full flex items-center justify-center bg-white dark:bg-neutral-900">
                <span className="text-neutral-500 dark:text-neutral-400">暂无请求数据</span>
              </div>
            )
          : (
              <div
                className="divide-y divide-neutral-200 dark:divide-neutral-800"
                style={{ height: totalHeight, position: 'relative' }}
              >
                <div style={{ position: 'absolute', top: paddingTop, left: 0, right: 0 }}>
                  {visibleItems.map(request => (
                    <RequestItem
                      key={request.timestampId}
                      request={request}
                      isSelected={selectedId === request.timestampId}
                      onClick={() => onSelectRequest(request.timestampId)}
                    />
                  ))}
                </div>
              </div>
            )}
      </div>
    </div>
  )
}
