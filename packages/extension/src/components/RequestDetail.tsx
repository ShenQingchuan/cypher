import type { NetworkRequest } from '../types'
import React, { useState } from 'react'
import { BodyView } from './BodyView'
import { HeadersView } from './HeadersView'

export const RequestDetailHeader: React.FC<{
  selectedRequest: NetworkRequest | null
  showDetailPanel: boolean
  onCloseDetailPanel: () => void
}> = ({ selectedRequest, onCloseDetailPanel }) => {
  return (
    <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-700 flex justify-between items-center">
      <h3 className="font-medium text-neutral-900 dark:text-neutral-100 flex-1 whitespace-nowrap overflow-hidden">
        {selectedRequest
          ? (
              <div className="flex items-center">
                <span className="whitespace-nowrap">请求详情: </span>
                <div className={`font-mono ml-2 px-2 rounded text-white ${getStatusColor(selectedRequest.status)}`}>{selectedRequest.method}</div>
                <span className="font-mono ml-2 whitespace-nowrap overflow-auto">{new URL(selectedRequest.url).pathname}</span>
              </div>
            )
          : '请求详情'}
      </h3>
      {selectedRequest && (
        <button
          className="ml-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          onClick={onCloseDetailPanel}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  )
}

// 请求详情组件
export const RequestDetail: React.FC<{ request: NetworkRequest, isDarkMode: boolean }> = ({ request, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'request' | 'response'>('request')
  const [subTab, setSubTab] = useState<'headers' | 'body'>('headers')

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-neutral-900">
      {/* 标签页标题 */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
        <button
          className={`px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${
            activeTab === 'request'
              ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
          }`}
          onClick={() => setActiveTab('request')}
        >
          请求
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${
            activeTab === 'response'
              ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
          }`}
          onClick={() => setActiveTab('response')}
        >
          响应
        </button>
      </div>

      {/* 子标签页标题 */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <button
          className={`px-4 py-2 text-xs font-medium cursor-pointer ${
            subTab === 'headers'
              ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
          }`}
          onClick={() => setSubTab('headers')}
        >
          头信息（Headers）
        </button>
        <button
          className={`px-4 py-2 text-xs font-medium cursor-pointer ${
            subTab === 'body'
              ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
          }`}
          onClick={() => setSubTab('body')}
        >
          内容（Body）
        </button>
      </div>

      {/* 标签页内容 */}
      <div className="flex-1 overflow-auto p-2 bg-white dark:bg-neutral-900">
        {activeTab === 'request' && subTab === 'headers' && (
          <HeadersView headers={request.requestHeaders} />
        )}

        {activeTab === 'request' && subTab === 'body' && (
          <BodyView body={request.requestBody} isDarkMode={isDarkMode} />
        )}

        {activeTab === 'response' && subTab === 'headers' && (
          <HeadersView headers={request.responseHeaders} />
        )}

        {activeTab === 'response' && subTab === 'body' && (
          <BodyView body={request.responseBody} isDarkMode={isDarkMode} />
        )}
      </div>
    </div>
  )
}
