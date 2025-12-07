import type { DirectiveBinding } from 'vue'

type Handler = {
  timeout?: number
  el?: HTMLElement
  tooltipEl?: HTMLElement | null
}

function createTooltip(text: string): HTMLElement {
  const t = document.createElement('div')
  t.className = 'longpress-tooltip'
  t.textContent = text
  document.body.appendChild(t)
  return t
}

function positionTooltip(tooltip: HTMLElement, rect: DOMRect) {
  const padding = 8
  const top = rect.top - tooltip.offsetHeight - padding
  const left = Math.min(Math.max(rect.left + rect.width / 2 - tooltip.offsetWidth / 2, 6), window.innerWidth - tooltip.offsetWidth - 6)
  tooltip.style.top = `${top < 6 ? rect.bottom + padding : top}px`
  tooltip.style.left = `${left}px`
}

const longpress = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | undefined>) {
    const data: Handler = { el, tooltipEl: null }
    const delay = 600

    const start = (e: Event) => {
      if ((e as TouchEvent).touches && (e as TouchEvent).touches.length > 1) return
      data.timeout = window.setTimeout(() => {
        const text = binding.value || el.getAttribute('title') || el.getAttribute('aria-label') || ''
        if (!text) return
        data.tooltipEl = createTooltip(text)
        const rect = el.getBoundingClientRect()
        positionTooltip(data.tooltipEl, rect)
        // auto remove
        window.setTimeout(() => {
          if (data.tooltipEl && data.tooltipEl.parentNode) data.tooltipEl.parentNode.removeChild(data.tooltipEl)
          data.tooltipEl = null
        }, 1600)
      }, delay)
    }

    const cancel = () => {
      if (data.timeout) {
        clearTimeout(data.timeout)
        data.timeout = undefined
      }
      if (data.tooltipEl && data.tooltipEl.parentNode) {
        data.tooltipEl.parentNode.removeChild(data.tooltipEl)
        data.tooltipEl = null
      }
    }

    el.addEventListener('touchstart', start, { passive: true })
    el.addEventListener('mousedown', start)
    el.addEventListener('touchend', cancel)
    el.addEventListener('touchcancel', cancel)
    el.addEventListener('mouseup', cancel)
    el.addEventListener('mouseleave', cancel)

    ;(el as any).__longpress = { start, cancel }
  },
  unmounted(el: HTMLElement) {
    const h = (el as any).__longpress
    if (h) {
      el.removeEventListener('touchstart', h.start)
      el.removeEventListener('mousedown', h.start)
      el.removeEventListener('touchend', h.cancel)
      el.removeEventListener('touchcancel', h.cancel)
      el.removeEventListener('mouseup', h.cancel)
      el.removeEventListener('mouseleave', h.cancel)
      delete (el as any).__longpress
    }
  }
}

export default longpress
