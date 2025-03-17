#!/usr/bin/env node

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 获取扩展的package.json路径
const extensionPackageJsonPath = path.resolve(__dirname, '../packages/extension/package.json')
// 读取扩展的package.json文件
const extensionPackageJson = JSON.parse(fs.readFileSync(extensionPackageJsonPath, 'utf8'))

// 从两个package.json文件中获取版本号，优先使用根目录的版本号
const version = extensionPackageJson.version

// 构建输出目录
const buildOutputDir = path.resolve(__dirname, '../packages/extension/.output/chrome-mv3')
// .output目录路径
const outputDir = path.resolve(__dirname, '../packages/extension/.output')
// 目标目录名（使用版本号）
const targetDirName = `cypher-v${version}`
// 目标目录路径（在.output目录下）
const targetDir = path.resolve(outputDir, targetDirName)
// zip文件名
const zipFileName = `${targetDirName}.zip`
// zip文件路径（放在项目根目录下）
const zipFilePath = path.resolve(__dirname, `../${zipFileName}`)

console.log(`🚀 开始构建后处理...`)
console.log(`📦 扩展版本: v${version}`)

// 确保目标目录不存在
if (fs.existsSync(targetDir)) {
  console.log(`🗑️ 删除已存在的目标目录: ${targetDirName}`)
  fs.rmSync(targetDir, { recursive: true, force: true })
}

// 确保zip文件不存在
if (fs.existsSync(zipFilePath)) {
  console.log(`🗑️ 删除已存在的zip文件: ${zipFileName}`)
  fs.unlinkSync(zipFilePath)
}

// 复制构建输出到目标目录
console.log(`📋 复制构建输出到: ${outputDir}/${targetDirName}`)
fs.cpSync(buildOutputDir, targetDir, { recursive: true })

// 创建zip文件
console.log(`🔒 创建zip文件: ${zipFileName}`)
const currentDir = process.cwd()
process.chdir(outputDir) // 切换到.output目录

try {
  // 根据操作系统选择合适的zip命令
  if (process.platform === 'win32') {
    // Windows下使用PowerShell
    execSync(`powershell Compress-Archive -Path "./${targetDirName}" -DestinationPath "${zipFilePath}"`)
  }
  else {
    // macOS/Linux下使用zip命令
    execSync(`zip -r "${zipFilePath}" "${targetDirName}"`)
  }
  console.log(`✅ zip文件创建成功: ${zipFileName}`)

  // 打包完成后删除复制的目录
  console.log(`🗑️ 清理临时目录: ${targetDirName}`)
  fs.rmSync(targetDir, { recursive: true, force: true })
}
catch (error) {
  console.error('❌ 创建zip文件失败:', error)
  process.exit(1)
}
finally {
  process.chdir(currentDir) // 切回原目录
}

console.log('✨ 构建后处理完成!')
