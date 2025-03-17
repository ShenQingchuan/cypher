import type { FC } from 'react'
import { useCallback } from 'react'

export const TestOneRequest: FC = () => {
  const onTestBtnClick = useCallback(async () => {
    const res = await fetch('http://localhost:4888/api/test')
    const data = await res.json()
    console.log(data)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center mb-4">
      <div className="mb-2 font-bold">测试一个请求</div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={onTestBtnClick}>测试</button>
    </div>
  )
}
