import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image_url: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: any) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const { user, signInWithGoogle } = useAuth();
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        if (user) {
            const saved = localStorage.getItem(`ssdee_cart_${user.id}`);
            setItems(saved ? JSON.parse(saved) : []);
        } else {
            setItems([]);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            localStorage.setItem(`ssdee_cart_${user.id}`, JSON.stringify(items));
        }
    }, [items, user]);

    const addToCart = async (product: any) => {
        if (!user) {
            toast.error("Please log in to add items to your cart.");
            window.location.href = "/login";
            return;
        }

        setItems((current) => {
            const existing = current.find((item) => item.id === product.id);
            if (existing) {
                toast.success("Quantity increased in cart!");
                return current.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            toast.success(`${product.name} added to cart!`);
            return [...current, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setItems((current) => current.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return removeFromCart(id);
        setItems((current) =>
            current.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);