import React, { useEffect, useRef, useState } from 'react'
import Split from 'react-split'
import { useDarkMode, useNetworkRequests, useSelectedRequest } from '../hooks'
import { RequestDetail, RequestDetailHeader } from './RequestDetail'
import { RequestList } from './RequestList'
import { MobileFilter, SidebarFilter } from './Sidebar'

// 主面板组件
export const MainPanel: React.FC = () => {
  const isDarkMode = useDarkMode()

  const {
    requests,
    handleFilterChange,
    handleClearRequests,
  } = useNetworkRequests()

  // 是否显示请求详情面板
  const [showDetailPanel, setShowDetailPanel] = useState(true)

  // 保存不同方向的分割尺寸
  const [horizontalSizes, setHorizontalSizes] = useState<number[]>(() => {
    try {
      const savedSizes = localStorage.getItem('cypher-horizontal-sizes')
      return savedSizes ? JSON.parse(savedSizes) : [50, 50]
    }
    catch {
      return [50, 50]
    }
  })

  const [verticalSizes, setVerticalSizes] = useState<number[]>(() => {
    try {
      const savedSizes = localStorage.getItem('cypher-vertical-sizes')
      return savedSizes ? JSON.parse(savedSizes) : [50, 50]
    }
    catch {
      return [50, 50]
    }
  })

  // 分屏方向 - 桌面端为水平分割，移动端为垂直分割
  const [direction, setDirection] = useState<'vertical' | 'horizontal'>('horizontal')

  // 使用key触发Split组件重新渲染
  const [splitKey, setSplitKey] = useState<number>(0)

  // 上一次的方向
  const prevDirectionRef = useRef<'vertical' | 'horizontal'>('horizontal')

  // 判断是否为移动端
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768
      const newDirection = isMobile ? 'vertical' : 'horizontal'

      // 如果方向发生变化，更新key以强制重新渲染Split组件
      if (newDirection !== prevDirectionRef.current) {
        prevDirectionRef.current = newDirection
        setDirection(newDirection)
        setSplitKey(prev => prev + 1)
      }
    }

    // 初始化检查
    checkMobile()

    // 监听窗口大小变化
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // 使用自定义钩子管理选中的请求
  const {
    selectedRequestId,
    selectedRequest,
    handleSelectRequest,
  } = useSelectedRequest(requests)

  // 处理请求选择，如果是同一请求，则切换详情面板的显示状态
  const handleRequestSelect = (id: string) => {
    if (id === selectedRequestId) {
      setShowDetailPanel(!showDetailPanel)
    }
    else {
      handleSelectRequest(id)
      setShowDetailPanel(true)
    }
  }

  const handleCloseDetailPanel = () => {
    setShowDetailPanel(false)
  }

  // 保存分割大小
  const handleDragEnd = (newSizes: number[]) => {
    if (direction === 'horizontal') {
      setHorizontalSizes(newSizes)
      localStorage.setItem('cypher-horizontal-sizes', JSON.stringify(newSizes))
    }
    else {
      setVerticalSizes(newSizes)
      localStorage.setItem('cypher-vertical-sizes', JSON.stringify(newSizes))
    }
  }

  // 根据当前方向获取对应尺寸
  const getCurrentSizes = () => {
    return direction === 'horizontal' ? horizontalSizes : verticalSizes
  }

  return (
    <div className={`h-screen w-full flex ${isDarkMode ? 'dark' : ''} bg-neutral-50 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100`}>
      {/* 左侧边栏 - 筛选区域 */}
      <SidebarFilter
        onFilterChange={handleFilterChange}
        onClearRequests={handleClearRequests}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 移动端顶部栏 */}
        <MobileFilter onClearRequests={handleClearRequests} onFilterChange={handleFilterChange} />

        {showDetailPanel && selectedRequest
          ? (
              <Split
                key={splitKey}
                sizes={getCurrentSizes()}
                minSize={100}
                expandToMin={false}
                gutterSize={8}
                direction={direction}
                onDragEnd={handleDragEnd}
                className={`flex ${direction === 'horizontal' ? 'flex-row' : 'flex-col'} h-full overflow-hidden split-parent`}
                gutter={(index: number, dir: string) => {
                  const gutter = document.createElement('div')
                  gutter.className = `gutter gutter-${dir} bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors`
                  return gutter
                }}
              >
                {/* 请求列表 */}
                <div className="overflow-hidden flex flex-col">
                  <RequestList
                    requests={requests}
                    selectedId={selectedRequestId}
                    onSelectRequest={handleRequestSelect}
                    showDetailPanel={showDetailPanel}
                  />
                </div>

                {/* 请求详情 */}
                <div className="overflow-hidden flex flex-col shadow">
                  <RequestDetailHeader
                    selectedRequest={selectedRequest}
                    showDetailPanel={showDetailPanel}
                    onCloseDetailPanel={handleCloseDetailPanel}
                  />

                  <RequestDetail request={selectedRequest} isDarkMode={isDarkMode} />
                </div>
              </Split>
            )
          : (
            // 当未显示详情面板时，只显示请求列表
              <div className="flex-1 h-full overflow-hidden">
                <RequestList
                  requests={requests}
                  selectedId={selectedRequestId}
                  onSelectRequest={handleRequestSelect}
                  showDetailPanel={showDetailPanel}
                />
              </div>
            )}
      </div>
    </div>
  )
}
