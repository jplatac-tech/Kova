import { formatPrice } from './utils'

export function formatCartPrice(value: number): string {
  return formatPrice(value)
}
