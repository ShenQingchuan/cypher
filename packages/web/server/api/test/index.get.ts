import { defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  return {
    message: 'Hello, World!',
    params: event.context.params ?? {},
  }
})
