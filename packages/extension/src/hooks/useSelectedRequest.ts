import type { NetworkRequest } from '../types'
import { useCallback, useEffect, useState } from 'react'
import { getRequestById } from '../storage/network-storage'

/**
 * Custom hook for managing the selected request
 * @param {NetworkRequest[]} requests - The array of network requests
 * @returns {object} Object containing selected request state and methods
 */
export function useSelectedRequest(requests: NetworkRequest[]) {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<NetworkRequest | null>(null)

  // 处理请求选择
  const handleSelectRequest = useCallback((id: string) => {
    setSelectedRequestId(id === selectedRequestId ? null : id)
  }, [selectedRequestId])

  // 选中请求ID变化时加载请求详情
  useEffect(() => {
    if (selectedRequestId) {
      const request = getRequestById(selectedRequestId)
      setSelectedRequest(request || null)
    }
    else {
      setSelectedRequest(null)
    }
  }, [selectedRequestId])

  // 当请求列表变化且当前选中的请求不在列表中时，清除选中状态
  useEffect(() => {
    if (selectedRequestId && !requests.find(req => req.timestampId === selectedRequestId)) {
      setSelectedRequestId(null)
    }
  }, [requests, selectedRequestId])

  return {
    selectedRequestId,
    selectedRequest,
    handleSelectRequest,
  }
}
