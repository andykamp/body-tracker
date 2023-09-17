import type { DebounceSettings, ThrottleSettings } from "lodash"
import debounce from "lodash.debounce"
import throttle from "lodash.throttle"
import { useRef } from "react"

type Cb = (...args: any[]) => any

export function useDebounce(cb: Cb, t = 350, options?: DebounceSettings) {
  return useRef(debounce(cb, t, options)).current
}

export function useThrottle(cb: Cb, t = 350, options?: ThrottleSettings) {
  return useRef(throttle(cb, t, options)).current
}
