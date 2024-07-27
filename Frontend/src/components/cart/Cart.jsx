import React from 'react'
import cartIcon from "../../assets/images/icons/food-serve.gif"
import { useCartContext } from '../../context/CartContext';
import { removeFromCart, increaseQty, decreaseQty } from '../menusection/cartFunctions';
import { SecondaryButton } from "../reuseable/Button";
import { toastMessage } from '../../helperfunction';
import Dish from '../menusection/Dish';
import { useAuthContext } from '../../context/AuthContext';
import displayRazorpay from '../../razorpay';


function CartIcon() {
    let [cart, setCart] = useCartContext();
    const toggleCart = () => {
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
    const { user } = useAuthContext();

    const toggleCart = () => {
        setCart((prev) => ({ ...prev, active: !prev.active }));
    }


    async function makeOrder() {
        if (cart.orders.length == 0) {
            toastMessage({ success: false, message: "Please Add something in your Cart" });
        } else {
            const requiredDetails = {
                totalAmount: cart.orders.reduce((acc, order) => { return acc + (order.dish.price * order.quantity) }, 0)
                , paymentUrl: `${import.meta.env.VITE_SERVER_ENDPOINT}/order/payment`
                , userName: user.fullname
                , successUrl: `${import.meta.env.VITE_SERVER_ENDPOINT}/order/payment/success`
                , orderDetails: cart.orders
                , updateChanges: () => { setCart({ active: true, orders: [] }) }
            }
            displayRazorpay(requiredDetails);
        }
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
                        <div className="dish-box" key={order.dish._id}>
                            <Dish dish={order.dish} />
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
                        <SecondaryButton text1={"Checkout!"} text2={"Order It!"} fnx={makeOrder} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export { CartIcon, Cart }