import type { FilterOptions, NetworkRequest } from '../types'
import { useCallback, useEffect, useState } from 'react'
import {
  clearRequests,
  getFilteredRequests,
  initNetworkStorage,
} from '../storage/network-storage'

/**
 * Custom hook for managing network requests
 * @param {FilterOptions} initialFilter - Initial filter options
 * @returns {object} Object containing requests state and methods
 */
export function useNetworkRequests(initialFilter: FilterOptions = {}) {
  const [requests, setRequests] = useState<NetworkRequest[]>([])
  const [filter, setFilter] = useState<FilterOptions>(initialFilter)

  // 加载请求列表
  const loadRequests = useCallback(() => {
    const filteredRequests = getFilteredRequests(filter)
    setRequests(filteredRequests)
  }, [filter])

  // 处理过滤条件变化
  const handleFilterChange = useCallback((newFilter: FilterOptions) => {
    const nextFilter = { ...filter, ...newFilter }
    setFilter(nextFilter)
  }, [filter])

  // 处理清空所有请求
  const handleClearRequests = useCallback(() => {
    clearRequests()
    setRequests([])
  }, [])

  useEffect(() => {
    // 初始化存储监听
    initNetworkStorage()
  }, [])

  // 监听新请求事件
  useEffect(() => {
    const handleNewRequest = () => {
      loadRequests()
    }

    // 监听自定义事件通知的更新
    document.addEventListener('requestsUpdated', handleNewRequest)

    return () => {
      document.removeEventListener('requestsUpdated', handleNewRequest)
    }
  }, [loadRequests])

  // 过滤条件变化时重新加载请求
  useEffect(() => {
    loadRequests()
  }, [filter, loadRequests])

  return {
    requests,
    filter,
    loadRequests,
    handleFilterChange,
    handleClearRequests,
  }
}
