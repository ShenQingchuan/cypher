# Cypher - 网络请求筛选分析浏览器插件

一开始这个浏览器扩展是为了筛选分析实际工作项目中大量的网络请求，统计埋点数据。
解决的问题是：URL 相同的请求在 Chrome Network 面板下无法通过请求/响应的内容来筛选。

## 项目结构

这是一个使用 pnpm 管理的 Monorepo 项目，包含以下子项目：

- `packages/extension`: 浏览器插件，基于WXT框架开发
- `packages/web`: 用来测试，基于 Vite+React 搭建，模拟发送埋点请求

## 功能特点

- 在浏览器 DevTools 中添加专用面板，类似Network面板
- 支持根据请求和响应的 header 和 body 内容进行筛选和搜索
- 提供请求详情展示（请求头、响应、JSON 树预览等）

## 开发指南

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev:ext

# 构建项目
pnpm build:ext
```

## 技术栈

- TypeScript
- WXT (浏览器扩展开发框架)
- React
- Vite
- UnoCSS
- Lucide icons
