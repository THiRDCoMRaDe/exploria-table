/* eslint-disable @typescript-eslint/no-explicit-any */
export function hasValue(x: unknown) {
  return x !== undefined && x !== null && (typeof x !== 'number' || !isNaN(x))
}
export function removeElementsWithValue<T>(arr: T[], val: T): T[] {
  let i = arr.length
  while (i--) {
    if (arr[i] === val) {
      arr.splice(i, 1)
    }
  }
  return arr
}

export function generateRandomString(
  length: number = 8,
  chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
): string {
  let result = ''
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

export function debounce<Params extends any[]>(
  func: (...args: Params) => any,
  timeout: number,
): (...args: Params) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Params) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, timeout)
  }
}

export function asap(f: () => void) {
  setTimeout(() => f(), 0)
}

export function isEmptyObject(obj: {}): boolean {
  return obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype
}
export function getScrollBarWidth() {
  const inner = document.createElement('p')
  inner.style.width = '100%'
  inner.style.height = '200px'

  const outer = document.createElement('div')
  outer.style.position = 'absolute'
  outer.style.top = '0px'
  outer.style.left = '0px'
  outer.style.visibility = 'hidden'
  outer.style.width = '200px'
  outer.style.height = '150px'
  outer.style.overflow = 'hidden'
  outer.appendChild(inner)

  document.body.appendChild(outer)
  const w1 = inner.offsetWidth
  outer.style.overflow = 'scroll'
  let w2 = inner.offsetWidth
  if (w1 === w2) {
    w2 = outer.clientWidth
  }

  document.body.removeChild(outer)
  return w1 - w2
}
