import { createRoot } from 'react-dom/client'
import { MainPanel } from '../components/MainPanel'
import 'uno.css'

// 渲染应用
const root = createRoot(document.getElementById('app')!)
root.render(<MainPanel />)
