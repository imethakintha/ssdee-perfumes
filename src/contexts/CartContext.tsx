import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext"; // AuthContext එක සම්බන්ධ කරගන්නවා

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
    const { user, signInWithGoogle } = useAuth(); // User ගේ විස්තර සහ Login Function එක ගන්නවා
    const [items, setItems] = useState<CartItem[]>([]);

    // 1. User වෙනස් වෙනකොට (Login/Logout වෙද්දී) ඒ User ට අදාල Cart එක Load කිරීම
    useEffect(() => {
        if (user) {
            // User ID එක පාවිච්චි කරලා එයාගේම Cart එක ගන්නවා
            const saved = localStorage.getItem(`ssdee_cart_${user.id}`);
            setItems(saved ? JSON.parse(saved) : []);
        } else {
            // Logout වෙලා නම් Cart එක සම්පූර්ණයෙන්ම හිස් කරනවා
            setItems([]);
        }
    }, [user]);

    // 2. Cart එකට Items දානකොට ඒක User ගේ ID එකත් එක්ක Save කිරීම
    useEffect(() => {
        if (user) {
            localStorage.setItem(`ssdee_cart_${user.id}`, JSON.stringify(items));
        }
    }, [items, user]);

    // 3. Add to Cart Function එක (Login Check එකත් එක්ක)
    const addToCart = async (product: any) => {
        if (!user) {
            toast.error("Please log in to add items to your cart.");
            // Popup එක වෙනුවට අලුත් Login පිටුවට හරවා යවයි
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