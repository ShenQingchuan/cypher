import type { FilterOptions } from '../types'
import React, { useState } from 'react'

interface SidebarProps {
  onFilterChange: (newFilter: FilterOptions) => void
  onClearRequests: () => void
}

// 常见的HTTP方法
const httpMethods = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
  'OPTIONS',
  'HEAD',
]

export const SidebarFilter: React.FC<SidebarProps> = ({ onFilterChange, onClearRequests }) => {
  return (
    <aside className="w-64 border-r border-neutral-200 dark:border-neutral-800 flex flex-col shrink-0 md:block hidden bg-white dark:bg-neutral-900 overflow-scroll">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
        <h2 className="text-lg font-mono font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Cypher</h2>
        <button
          onClick={onClearRequests}
          className="w-full py-2 cursor-pointer px-4 bg-slate-500 dark:bg-slate-600 hover:bg-slate-600 dark:hover:bg-slate-700 text-white rounded-md transition-colors text-sm"
        >
          清空请求
        </button>
      </div>

      <div className="p-4 flex-1 overflow-auto bg-white dark:bg-neutral-900">
        <h3 className="text-sm font-medium mb-3 text-neutral-900 dark:text-neutral-100">筛选条件</h3>

        <div className="space-y-4">
          {/* URL 筛选 */}
          <div className="space-y-1">
            <label className="block text-xs text-neutral-500 dark:text-neutral-400 font-medium">URL</label>
            <div className="relative">
              <input
                type="text"
                placeholder="输入 URL 关键词"
                className="w-full px-3 py-1.5 text-sm rounded-md border outline-hidden border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-neutral-400 dark:placeholder-neutral-500"
                onChange={e => onFilterChange({ searchText: e.target.value })}
              />
            </div>
          </div>

          {/* HTTP 方法筛选 */}
          <div className="space-y-1">
            <label className="block text-xs text-neutral-500 dark:text-neutral-400 font-medium">HTTP 方法</label>
            <select
              className="w-full px-3 py-1.5 text-sm rounded-md border outline-hidden border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer"
              onChange={e => onFilterChange({ method: e.target.value })}
            >
              <option value="">全部方法</option>
              {httpMethods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>

          {/* 搜索请求头 */}
          <div className="space-y-4">
            <label className="block text-xs text-neutral-500 dark:text-neutral-400 font-medium">请求头</label>
            <input
              type="text"
              placeholder="搜索请求 Headers 内容"
              className="w-full px-3 py-1.5 text-sm rounded-md border outline-hidden border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-neutral-400 dark:placeholder-neutral-500"
              onChange={e => onFilterChange({ requestHeaderSearch: e.target.value })}
            />
          </div>

          {/* 搜索请求体 */}
          <div className="space-y-1">
            <label className="block text-xs text-neutral-500 dark:text-neutral-400 font-medium">请求体</label>
            <input
              type="text"
              placeholder="搜索请求 Body 内容"
              className="w-full px-3 py-1.5 text-sm rounded-md border outline-hidden border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-neutral-400 dark:placeholder-neutral-500"
              onChange={e => onFilterChange({ requestBodySearch: e.target.value })}
            />
          </div>

          {/* 搜索响应头 */}
          <div className="space-y-1">
            <label className="block text-xs text-neutral-500 dark:text-neutral-400 font-medium">响应头</label>
            <input
              type="text"
              placeholder="搜索响应 Headers 内容"
              className="w-full px-3 py-1.5 text-sm rounded-md border outline-hidden border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-neutral-400 dark:placeholder-neutral-500"
              onChange={e => onFilterChange({ responseHeaderSearch: e.target.value })}
            />
          </div>

          {/* 搜索响应体 */}
          <div className="space-y-1">
            <label className="block text-xs text-neutral-500 dark:text-neutral-400 font-medium">响应体</label>
            <input
              type="text"
              placeholder="搜索响应 Body 内容"
              className="w-full px-3 py-1.5 text-sm rounded-md border outline-hidden border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-neutral-400 dark:placeholder-neutral-500"
              onChange={e => onFilterChange({ responseBodySearch: e.target.value })}
            />
          </div>
        </div>
      </div>
    </aside>
  )
}

// 移动端顶部栏
export const MobileFilter: React.FC<SidebarProps> = ({ onFilterChange, onClearRequests }) => {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="md:hidden flex flex-col w-full">
      {/* 固定顶栏 */}
      <div className="fixed top-0 left-0 right-0 z-10 border-b border-neutral-200 dark:border-neutral-800 p-4 flex justify-between items-center bg-neutral-50 dark:bg-neutral-800">
        <h2 className="text-lg font-mono font-semibold text-neutral-900 dark:text-neutral-100">Cypher</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="py-1.5 px-3 cursor-pointer bg-primary-700 hover:bg-primary-900 text-white rounded-md transition-colors text-xs"
          >
            {showFilters ? '隐藏筛选' : '显示筛选'}
          </button>
          <button
            onClick={onClearRequests}
            className="py-1.5 px-3 cursor-pointer bg-slate-500 dark:bg-slate-600 hover:bg-slate-600 dark:hover:bg-slate-700 text-white rounded-md transition-colors text-xs"
          >
            清空请求
          </button>
        </div>
      </div>

      {/* 筛选条件区域 - 展开/收起 */}
      {showFilters && (
        <div className="pt-16 px-4 pb-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
          <h3 className="text-sm pt-2 font-medium mb-3 text-neutral-900 dark:text-neutral-100">筛选条件</h3>

          <div className="grid grid-cols-2 gap-4">
            {/* URL 筛选 */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">URL</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="输入 URL 关键词"
                  className="w-full px-3 py-1.5 text-sm rounded-md border outline-hidden border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-neutral-400 dark:placeholder-neutral-500"
                  onChange={e => onFilterChange({ searchText: e.target.value })}
                />
              </div>
            </div>

            {/* HTTP 方法筛选 */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">HTTP 方法</label>
              <select
                className="w-full px-3 py-1.5 text-sm rounded-md border outline-hidden border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer"
                onChange={e => onFilterChange({ method: e.target.value })}
              >
                <option value="">全部方法</option>
                {httpMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>

            {/* 搜索请求头 */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">请求头</label>
              <input
                type="text"
                placeholder="搜索请求 Headers 内容"
                className="w-full px-3 py-1.5 text-sm rounded-md border outline-hidden border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-neutral-400 dark:placeholder-neutral-500"
                onChange={e => onFilterChange({ requestHeaderSearch: e.target.value })}
              />
            </div>

            {/* 搜索请求体 */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">请求体</label>
              <input
                type="text"
                placeholder="搜索请求 Body 内容"
                className="w-full px-3 py-1.5 text-sm rounded-md border outline-hidden border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-neutral-400 dark:placeholder-neutral-500"
                onChange={e => onFilterChange({ requestBodySearch: e.target.value })}
              />
            </div>

            {/* 搜索响应头 */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">响应头</label>
              <input
                type="text"
                placeholder="搜索响应 Headers 内容"
                className="w-full px-3 py-1.5 text-sm rounded-md border outline-hidden border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-neutral-400 dark:placeholder-neutral-500"
                onChange={e => onFilterChange({ responseHeaderSearch: e.target.value })}
              />
            </div>

            {/* 搜索响应体 */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">响应体</label>
              <input
                type="text"
                placeholder="搜索响应 Body 内容"
                className="w-full px-3 py-1.5 text-sm rounded-md border outline-hidden border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-neutral-400 dark:placeholder-neutral-500"
                onChange={e => onFilterChange({ responseBodySearch: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {/* 占位元素，保持内容不被固定顶栏遮挡 */}
      {!showFilters && (
        <div className="h-14"></div>
      )}
    </div>
  )
}
