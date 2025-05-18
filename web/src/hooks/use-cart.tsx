'use client'

import {
   createContext,
   useContext,
   useEffect,
   useState,
   ReactNode,
   useMemo
} from 'react'
import { Iproduct } from '@/types'

type CartItem = Iproduct

interface CartContextType {
   cart: CartItem[]
   cartCount: number
   addToCart: (item: CartItem) => void
   removeFromCart: (id: string) => void
   clearCart: () => void
   setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_KEY = 'cart'

export const CartProvider = ({ children }: { children: ReactNode }) => {
   const [cart, setCart] = useState<CartItem[]>([])

   useEffect(() => {
      const storedCart = localStorage.getItem(CART_KEY)
      if (storedCart) {
         try {
            setCart(JSON.parse(storedCart))
         } catch (e) {
            if (e) {
               console.error('Gagal parsing cart dari localStorage')
            }
         }
      }
   }, [])

   useEffect(() => {
      localStorage.setItem(CART_KEY, JSON.stringify(cart))
   }, [cart])

   const addToCart = (item: CartItem) => {
      setCart((prev) => [...prev, item])
   }

   const removeFromCart = (id: string) => {
      setCart((prev) => prev.filter((item) => item.id !== id))
   }

   const clearCart = () => {
      setCart([])
   }
   const value = useMemo(
      () => ({
         cart,
         cartCount: cart.length,
         addToCart,
         removeFromCart,
         clearCart,
         setCart
      }),
      [cart]
   )
   return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
   const context = useContext(CartContext)
   if (!context) {
      throw new Error('useCart harus digunakan di dalam CartProvider')
   }
   return context
}
