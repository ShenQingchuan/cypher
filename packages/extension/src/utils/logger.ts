/* eslint-disable no-console */
import process from 'node:process'

/**
 * 日志级别枚举
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

/**
 * 当前环境的日志级别
 * 可通过localStorage中的logLevel设置（仅在开发环境）
 */
let currentLogLevel = LogLevel.INFO

// 在开发环境中，尝试从localStorage读取日志级别
try {
  if (process.env.NODE_ENV === 'development') {
    const storedLevel = localStorage.getItem('cypher_logLevel')
    if (storedLevel !== null) {
      currentLogLevel = Number(storedLevel)
    }
  }
}
catch {
  // 忽略localStorage错误
}

/**
 * 设置日志级别
 */
export function setLogLevel(level: LogLevel): void {
  currentLogLevel = level
  // 仅在开发环境存储日志级别
  if (process.env.NODE_ENV === 'development') {
    try {
      localStorage.setItem('cypher_logLevel', level.toString())
    }
    catch {
      // 忽略localStorage错误
    }
  }
}

/**
 * 获取当前日志级别
 */
export function getLogLevel(): LogLevel {
  return currentLogLevel
}

/**
 * 创建格式化的日志消息
 */
function formatMessage(context: string, message: string): string {
  return `[Cypher][${context}] ${message}`
}

/**
 * 创建一个有上下文的记录器
 */
export function createLogger(context: string) {
  return {
    debug(...args: any[]): void {
      if (currentLogLevel <= LogLevel.DEBUG) {
        console.debug(formatMessage(context, args.map(arg =>
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg),
        ).join(' ')))
      }
    },

    info(...args: any[]): void {
      if (currentLogLevel <= LogLevel.INFO) {
        console.info(formatMessage(context, args.map(arg =>
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg),
        ).join(' ')))
      }
    },

    warn(...args: any[]): void {
      if (currentLogLevel <= LogLevel.WARN) {
        console.warn(formatMessage(context, args.map(arg =>
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg),
        ).join(' ')))
      }
    },

    error(...args: any[]): void {
      if (currentLogLevel <= LogLevel.ERROR) {
        console.error(formatMessage(context, args.map(arg =>
          typeof arg === 'object'
            ? (arg instanceof Error ? arg.stack || arg.message : JSON.stringify(arg))
            : String(arg),
        ).join(' ')))
      }
    },
  }
}
