import { createContext, ReactNode, useContext, useState } from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";

type ShoppingCartProviderProps = {
	children: ReactNode
}

type ShoppingCartContextProps = {
	openCart: () => void
	closeCart: () => void
	getItemQuantity: (id: number) => number
	increaseCartQuantity: (id: number) => void
	decreaseCartQuantity: (id: number) => void
	removeFromCart: (id: number) => void
	cartQuantity: number
	cartItems: CartItem[]
}

type CartItem = {
	id: number,
	quantity: number
}

const ShoppingCartContext = createContext({} as ShoppingCartContextProps)

export function useShoppingCart() {
	return useContext(ShoppingCartContext)
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
	const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("shopping-cart", [])
	const [isOpen, setIsOpen] = useState(false)

	function openCart() {
		setIsOpen(true)
	}

	function closeCart() {
		setIsOpen(false)
	}

	const cartQuantity = cartItems.reduce(
		(quantity, item) => quantity + item.quantity, 0
	)

	function getItemQuantity(id: number) {
		return cartItems.find(item => item.id === id)?.quantity || 0
	}

	function increaseCartQuantity(id: number) {
		setCartItems(currItems => {
			if (currItems.find(item => item.id === id) == null) {
				return [...currItems, { id, quantity: 1 }]
			} else {
				return currItems.map(item => {
					if (item.id === id) {
						return { ...item, quantity: item.quantity++ }
					} else {
						return item
					}
				})
			}
		})
	}

	function decreaseCartQuantity(id: number) {
		setCartItems(currItems => {
			if (currItems.find(item => item.id === id)?.quantity === 1) {
				return currItems.filter(item => item.id !== id)
			} else {
				return currItems.map(item => {
					if (item.id === id) {
						return { ...item, quantity: item.quantity - 1 }
					} else {
						return item
					}
				})
			}
		})

	}

	function removeFromCart(id: number) {
		setCartItems(currItems => {
			return currItems.filter(item => item.id !== id)
		})
	}

	return (
		<ShoppingCartContext.Provider value={{
			getItemQuantity,
			increaseCartQuantity,
			decreaseCartQuantity,
			removeFromCart,
			cartItems,
			cartQuantity,
			openCart,
			closeCart
		}}>
			{children}
			<ShoppingCart isOpen={isOpen} />
		</ShoppingCartContext.Provider>
	)
}