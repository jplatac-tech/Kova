'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type CartItem = {
  id: string
  slug: string
  name: string
  price: number
  quantity: number
  size: string
  image: string
  brand?: string
}

export type AccountProfile = {
  name: string
  email: string
  whatsapp?: string
  isAdmin?: boolean
} | null

type AppStateContextValue = {
  cartItems: CartItem[]
  totalItems: number
  totalPrice: number
  addToCart: (item: Omit<CartItem, 'quantity' | 'id'>, quantity?: number) => void
  updateCartQuantity: (id: string, quantity: number) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  profile: AccountProfile
  saveProfile: (profile: AccountProfile) => void
  clearProfile: () => void
}

const STORAGE_CART_KEY = 'kova-cart'
const STORAGE_PROFILE_KEY = 'kova-account'
const AppStateContext = createContext<AppStateContextValue | undefined>(undefined)

function cartLineId(slug: string, size: string) {
  return `${slug}::${size}`
}

function loadStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_CART_KEY)
    const parsed = raw ? (JSON.parse(raw) as CartItem[]) : []
    return parsed.map((item) => ({
      ...item,
      id: item.id || cartLineId(item.slug, item.size || ''),
    }))
  } catch {
    return []
  }
}

function loadStoredProfile(): AccountProfile {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_PROFILE_KEY)
    return raw ? (JSON.parse(raw) as AccountProfile) : null
  } catch {
    return null
  }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [profile, setProfile] = useState<AccountProfile>(null)

  useEffect(() => {
    setCartItems(loadStoredCart())
    setProfile(loadStoredProfile())
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cartItems))
    } catch {
      /* ignore */
    }
  }, [cartItems])

  useEffect(() => {
    try {
      if (profile) {
        window.localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile))
      } else {
        window.localStorage.removeItem(STORAGE_PROFILE_KEY)
      }
    } catch {
      /* ignore */
    }
  }, [profile])

  const totalItems = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  )

  const totalPrice = useMemo(
    () =>
      cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems],
  )

  const addToCart = (item: Omit<CartItem, 'quantity' | 'id'>, quantity = 1) => {
    const id = cartLineId(item.slug, item.size)
    setCartItems((previous) => {
      const exists = previous.find((cartItem) => cartItem.id === id)
      if (exists) {
        return previous.map((cartItem) =>
          cartItem.id === id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem,
        )
      }
      return [...previous, { ...item, id, quantity }]
    })
  }

  const updateCartQuantity = (id: string, quantity: number) => {
    setCartItems((previous) =>
      previous
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, Math.floor(quantity)) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const removeFromCart = (id: string) => {
    setCartItems((previous) => previous.filter((item) => item.id !== id))
  }

  const clearCart = () => setCartItems([])
  const saveProfile = (nextProfile: AccountProfile) => setProfile(nextProfile)
  const clearProfile = () => setProfile(null)

  const value = useMemo(
    () => ({
      cartItems,
      totalItems,
      totalPrice,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      profile,
      saveProfile,
      clearProfile,
    }),
    [cartItems, totalItems, totalPrice, profile],
  )

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider')
  }
  return context
}
