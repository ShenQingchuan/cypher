import React from 'react'

export const HeadersView: React.FC<{ headers: Record<string, string> }> = ({ headers }) => {
  if (!headers || Object.keys(headers).length === 0) {
    return <div className="text-neutral-500 dark:text-neutral-400 text-center py-4">头信息为空</div>
  }

  return (
    <div className="space-y-1 rounded-md overflow-auto dark:border-neutral-700 divide-y divide-neutral-100 dark:divide-neutral-700">
      {Object.entries(headers).map(([key, value]) => (
        <div key={key} className="flex text-sm py-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
          <div className="w-1/3 font-bold text-neutral-700 dark:text-neutral-300 truncate pr-2">
            {key}
            :
          </div>
          <div className="w-2/3 text-neutral-600 dark:text-neutral-400 break-all font-mono">
            {value}
          </div>
        </div>
      ))}
    </div>
  )
}
