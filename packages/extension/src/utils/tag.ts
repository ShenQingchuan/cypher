// 获取状态码对应的颜色
export function getStatusColor(status: number) {
  if (status >= 500)
    return 'bg-red-500 dark:bg-red-600'
  if (status >= 400)
    return 'bg-orange-500 dark:bg-orange-600'
  if (status >= 300)
    return 'bg-yellow-500 dark:bg-yellow-600'
  if (status >= 200)
    return 'bg-green-500 dark:bg-green-600'
  return 'bg-blue-500 dark:bg-blue-600'
}
