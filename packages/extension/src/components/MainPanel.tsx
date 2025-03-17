import React, { useState } from 'react'
import { useDarkMode, useNetworkRequests, useSelectedRequest } from '../hooks'
import { RequestDetail, RequestDetailHeader } from './RequestDetail'
import { RequestList } from './RequestList'
import { MobileFilter, SidebarFilter } from './Sidebar'

// 主面板组件
export const MainPanel: React.FC = () => {
  // 使用自定义钩子获取暗黑模式状态
  const isDarkMode = useDarkMode()

  // 使用自定义钩子管理网络请求
  const {
    requests,
    handleFilterChange,
    handleClearRequests,
  } = useNetworkRequests()

  // 是否显示请求详情面板
  const [showDetailPanel, setShowDetailPanel] = useState(true)

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

        {/* 请求列表 */}
        <RequestList
          requests={requests}
          selectedId={selectedRequestId}
          onSelectRequest={handleRequestSelect}
          showDetailPanel={showDetailPanel}
        />

        {/* 请求详情 */}
        <div className={`${showDetailPanel ? 'h-1/2' : 'hidden'} overflow-hidden flex flex-col shadow transition-all duration-300`}>
          <RequestDetailHeader
            selectedRequest={selectedRequest}
            showDetailPanel={showDetailPanel}
            onCloseDetailPanel={handleCloseDetailPanel}
          />

          {selectedRequest && showDetailPanel
            ? (
                <RequestDetail request={selectedRequest} isDarkMode={isDarkMode} />
              )
            : (
                <div className={`${!showDetailPanel && selectedRequest ? 'hidden' : 'h-full flex items-center justify-center bg-white dark:bg-neutral-900'}`}>
                  <span className="text-neutral-500 dark:text-neutral-400">选择一个请求查看详情</span>
                </div>
              )}
        </div>
      </div>
    </div>
  )
}
