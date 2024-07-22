import React from 'react'
import cartIcon from "../../assets/images/icons/food-serve.gif"
import { useCartContext } from '../../context/CartContext';
import { removeFromCart, increaseQty, decreaseQty } from '../menusection/cartFunctions';
import { SecondaryButton } from "../reuseable/Button";
import { toastMessage } from '../../helperfunction';
import Dish from '../menusection/Dish';

function CartIcon() {
    let [cart, setCart] = useCartContext();
    const toggleCart = () => {
        console.log("called");
        setCart((prev) => ({ ...prev, active: !prev.active }));
    }
    return (
        <span className='cart-icon' onClick={() => toggleCart()}>
            <img src={cartIcon} height="50" width="50" />
            <p className='label-1 text-center'>cart</p>
        </span>
    )
}

function Cart() {
    const [cart, setCart] = useCartContext();
    // console.log(cart);

    const toggleCart = () => {
        setCart((prev) => ({ ...prev, active: !prev.active }));
    }

    const orderSelected = async () => {
        const url = `${import.meta.env.VITE_SERVER_ENDPOINT}/order`;


        const makeOrder = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ orderDetails: cart.orders })
        })

        if (makeOrder.ok) {
            setCart({ active: true, orders: [] });
        }
        const orderDetails = await makeOrder.json()
        toastMessage(orderDetails);
    }

    return (
        <div className={`cart ${cart.active && "active"}`}>
            <div className='cart-topbar'>
                <p className='text-center title-1'>My cart</p>
                <i className='uil uil-times close-btn clos-btn' onClick={() => toggleCart(setCart)}></i>
            </div>
            <div className='cart-added'>
                <div className="menu-container">
                    {cart.orders.map((order, index) => (
                        <div className="dish-box" key={order._id}>
                           <Dish dish={order.dish}/>
                            <div className="order-options">
                                <div className='qty-icons' >
                                    <i className="fa-solid fa-minus" onClick={() => { order.quantity != 0 && order.quantity == 1 ? removeFromCart(order.dish._id, setCart) : decreaseQty(order.dish._id, setCart); }}></i>
                                    <span className='qty title-3'>{order.quantity}</span>
                                    <i className="fa-solid fa-plus" onClick={() => { increaseQty(order.dish._id, setCart) }}></i>
                                </div>
                                <p>Total: {order.quantity * order.dish.price} </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='cart-accounting'>
                    <div className='cart-total'>
                        <p>SubTotal</p>
                        <p>
                            {cart.orders.reduce((acc, order) => {
                                return acc + (order.dish.price * order.quantity)
                            }, 0)} /-
                        </p>
                    </div>
                    <div>

                    </div>
                    <div className='final-order'>
                        <p>Proceed to checkout -</p>
                        <SecondaryButton text1={"Checkout!"} text2={"Order It!"} fnx={orderSelected} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export { CartIcon, Cart }