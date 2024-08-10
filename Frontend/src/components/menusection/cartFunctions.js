import { toastMessage } from "../../helperfunction";
import { monitorActivity } from "../../helperfunction";
const handleEvent = async (route, data) => {
    try {
        const url = `${import.meta.env.VITE_SERVER_ENDPOINT}/cart/${route}`;
        const fetchUrl = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(data)
        })

        const responseData = await fetchUrl.json();
        toastMessage(responseData)

        if (responseData.success) return true;
        return false;
    }
    catch (error) {
        console.log(error);
        toastMessage(error);
    }
}


const addToCart = async (dish, setCart, setDishes) => {
    console.log(dish);
    const result = await handleEvent("add", { dish: dish });

    if (result) {
        setCart((prev) => ({
            ...prev,
            orders: [...prev.orders, { dish, quantity: 1 }],
        }));

        console.log("added this ", dish)
        await monitorActivity({ dishAdded: { dishId: dish._id, dishName: dish.dishName } });
        // setDishes((prevDishes) =>
        //     prevDishes.map((prevDish) => {
        //         console.log(dish);
        //         return prevDish._id == dish._id
        //             ? { ...prevDish, quantity: prevDish.quantity + 1 }
        //             : prevDish;
        //     })
        // );
    }
}

const removeFromCart = async (dishId, setCart) => {
    const result = await handleEvent(`remove/${dishId}`);

    if (result) {
        setCart((prev) => ({
            ...prev,
            orders: prev.orders.filter(order => order.dish._id != dishId),
        }));

    }
}

const increaseQty = async (dishId, setCart) => {
    const result = await handleEvent(`inc/${dishId}`)


    if (result) {
        setCart((prev) => ({
            ...prev,
            orders: prev.orders.map((order) =>
                order.dish._id == dishId
                    ? { ...order, quantity: order.quantity + 1 }
                    : order
            ),
        }));

        // setDishes((prevDishes) =>
        //     prevDishes.map((prevDish) => {
        //         console.log(dish);
        //         return prevDish._id == dish._id
        //             ? { ...prevDish, quantity: prevDish.quantity + 1 }
        //             : prevDish;
        //     })
        // );
    }
}


const decreaseQty = async (dishId, setCart) => {
    const result = await handleEvent(`dec/${dishId}`);
    if (result) {
        setCart((prev) => ({
            ...prev,
            orders: prev.orders.map(order => (order.dish._id == dishId ? { ...order, quantity: order.quantity - 1 } : order)),
        }));

        // await setDishes((prevDishes) =>
        //     prevDishes.map((dish) => {
        //         console.log(dish);
        //         return dish._id == dishId
        //             ? { ...dish, quantity: dish.quantity - 1 }
        //             : dish;
        //     })
        // );
    }

}


export { addToCart, increaseQty, decreaseQty, removeFromCart };