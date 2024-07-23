import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import PreLoad from "../components/preload/PreLoad";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

    const [cart, setCart] = useState({ active: false, orders: [] });
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(user ? false : true);

    useEffect(() => {

        const renderCart = async () => {
            const url = `${import.meta.env.VITE_SERVER_ENDPOINT}/cart`;
            const fetchUrl = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })

            const responseData = await fetchUrl.json();
            console.log(responseData);
            setCart({ active: false, orders: responseData.cart });
            setLoading(true);
        }

        user && renderCart();
    }, [])

    return (<CartContext.Provider value={[cart, setCart]}>
        {loading ? children : <PreLoad />}
    </CartContext.Provider >)
}

export const useCartContext = () => useContext(CartContext);