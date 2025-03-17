import React from 'react'
import { darkStyles, defaultStyles, JsonView } from 'react-json-view-lite'
import 'react-json-view-lite/dist/index.css'

// 自定义暗黑模式样式
const customDarkStyles = {
  ...darkStyles,
  container: 'padding: 0.75rem; background: #1e1e2e; color: #cdd6f4;',
  basicValue: 'color: #89b4fa;',
  string: 'color: #a6e3a1;',
  number: 'color: #f38ba8;',
  boolean: 'color: #fab387;',
  null: 'color: #f38ba8;',
  propertyKey: 'color: #89dceb;',
}

// 自定义亮色模式样式
const customLightStyles = {
  ...defaultStyles,
  container: 'padding: 0.75rem; background: #f8f8f8; color: #1e1e2e;',
  basicValue: 'color: #1e66f5;',
  string: 'color: #40a02b;',
  number: 'color: #d20f39;',
  boolean: 'color: #fe640b;',
  null: 'color: #d20f39;',
  propertyKey: 'color: #179299;',
}

export const BodyView: React.FC<{ body: any, isDarkMode: boolean }> = ({ body, isDarkMode }) => {
  if (!body) {
    return <div className="text-neutral-500 dark:text-neutral-400 text-center py-4">无 body 数据</div>
  }

  // 如果是字符串，尝试解析为JSON
  let dataForView = body
  if (typeof body === 'string') {
    try {
      dataForView = JSON.parse(body)
    }
    catch {
      // 如果不是有效的JSON，仍然以文本形式展示
      return (
        <pre className="whitespace-pre-wrap font-mono text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 p-4 rounded-md overflow-auto">
          {body}
        </pre>
      )
    }
  }

  return (
    <div className="rounded-md overflow-auto font-mono">
      <JsonView data={dataForView} style={isDarkMode ? customDarkStyles : customLightStyles} />
    </div>
  )
}
