import React, { useState } from 'react'
import { handleInputChangeObj } from '../CustomizationAssets/CustomizationFunction';
import { PrimaryButton } from '../../reuseable/Button';
import { toastMessage } from '../../../helperfunction';
function CreateDish({ menuId }) {
    let [dish, setDish] = useState({ dishName: "", description: "", price: "", tag: "", myFile: "" });

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const url = `${import.meta.env.VITE_SERVER_ENDPOINT}/admin/menusection/dish/${menuId}`;
            const dish = new FormData(event.target);
            const uploadDish = await fetch(url, {
                method: "POST",
                body: dish,
                credentials: "include"
            })

            const responseData = await uploadDish.json();
            toastMessage(responseData);
        } catch (error) {
            console.log(error);
            toastMessage(error);
        }
    };
    return (
        <section className='section create-menu'>
            <div className="container">
                <p className='section-subtitle headline-1 text-center'>Create Dish</p>
                <form onSubmit={handleSubmit}>
                    <p>Dish Name</p>
                    <input type="text" className="input-field" name='dishName' value={dish.dishName} onChange={(event) => handleInputChangeObj(event, setDish)} placeholder='Enter the Name of the Dish' required />
                    <p>Dish Image</p>
                    <input type="File" className="input-field" name='myFile' value={dish.myFile} onChange={(event) => handleInputChangeObj(event, setDish)} placeholder='Dish image' required />
                    <p>Dish Description</p>
                    <input type="text" className="input-field" name='description' value={dish.description} onChange={(event) => handleInputChangeObj(event, setDish)} placeholder=' Description of the Dish' required />
                    <p>Dish Price</p>
                    <input type="number" min={0} className="input-field" name='price' value={dish.price} onChange={(event) => handleInputChangeObj(event, setDish)} placeholder='Dish Price' required />
                    <p>Dish Tag</p>
                    <input type="text" className="input-field" name='tag' value={dish.tag} onChange={(event) => handleInputChangeObj(event, setDish)} placeholder='Any Tag like New , Special ...' required />
                    <PrimaryButton text1={"create it"} text2={"let's Create"} />
                </form>
            </div>
        </section>
    )
}

export default CreateDish