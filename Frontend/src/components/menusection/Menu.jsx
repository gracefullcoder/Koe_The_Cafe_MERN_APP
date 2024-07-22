import React, { useState, useEffect } from "react";
import dishImg from "../../assets/images/menu-1.png";
import { useLocation, Link } from "react-router-dom";
import { useCartContext } from "../../context/CartContext";
import { CartIcon, Cart } from "../cart/Cart";
import { PrimaryButton } from "../reuseable/Button.jsx";
import { addToCart, increaseQty, decreaseQty, removeFromCart } from "./cartFunctions.js";
import Header from "../header/Header.jsx";
import { monitorActivity } from "../../helperfunction.js";
import Dish from "./Dish.jsx";


function Menu() {
    const { state } = useLocation();
    const [cart, setCart] = useCartContext();

    const [dishes, setDishes] = useState([]);

    useEffect(() => {
        monitorActivity({ menuLookup: state.title })
    }, [])

    useEffect(() => {
        const cartDetails = cart.orders;
        // console.log(state);
        setDishes(state.dishes.map((dish) => {
            const isAdded = cartDetails.find(order => {
                if (order.dish._id == dish._id) return order;
            });

            // console.log(isAdded);

            if (isAdded) {
                console.log("in");
                return { ...isAdded.dish, quantity: isAdded.quantity };
            }
            else return { ...dish, quantity: 0 }
        }));

    }, [cart])


    return (
        <>
            <div className="menu-topbar">
                <Link to="/dashboard/order" className="home-link title-3 hover-underline">View Orders</Link>
                <Link to="/" className="home-link title-3 hover-underline">Back to Menu</Link>
                <CartIcon />
                <Cart />
            </div>
            <section className="text-center menu">
                <div className="container">
                    <p className="section-subtitle label-2">Order Some Food</p>
                    <p className="headline-1 section-title">{state.title}</p>

                    <div className="menu-container">
                        {dishes.map((dish, index) => (
                            <div className="dish-box" key={dish._id}>
                                <Dish dish={dish}/>
                                <div className="order-options">
                                    {dish.quantity == 0 ? <PrimaryButton text1={<i className="fa-solid fa-plus"></i>} text2={"Add It"} fnx={() => { addToCart(dish, setCart) }} /> :
                                        <div className="qty-icons">
                                            <i
                                                className="fa-solid fa-minus"
                                                onClick={() => {
                                                    dish.quantity != 0 && dish.quantity == 1 ? removeFromCart(dish._id, setCart) : decreaseQty(dish._id, setCart);
                                                }}
                                            ></i>
                                            <span className="qty title-3">{dish.quantity}</span>
                                            <i
                                                className="fa-solid fa-plus"
                                                onClick={() => {
                                                    increaseQty(dish._id, setCart);
                                                }}
                                            ></i>
                                        </div>

                                    }
                                    {/* <p>Total: {dish.quantity * dish.price} </p> */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>

    );
}

export default Menu;



