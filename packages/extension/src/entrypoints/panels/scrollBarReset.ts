export function resetScrollBar() {
  let timer: ReturnType<typeof setTimeout> | null = null
  window.addEventListener('scroll', () => {
    document.body.toggleAttribute('scroll', true)
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      document.body.toggleAttribute('scroll')
    }, 500)
  })
}
