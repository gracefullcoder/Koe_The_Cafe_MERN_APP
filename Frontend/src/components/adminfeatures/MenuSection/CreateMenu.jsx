import React, { useState } from 'react'
import { PrimaryButton } from "../../reuseable/Button.jsx";
import { handleInputChangeObj } from '../CustomizationAssets/CustomizationFunction.js';
import { toastMessage } from '../../../helperfunction.js';
function CreateMenu() {

    const [menu, setMenu] = useState({ title: "", myFile: "" });

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const url = `${import.meta.env.VITE_SERVER_ENDPOINT}/admin/menusection`;

            const menu = new FormData(event.target);

            const uploadMenu = await fetch(url, {
                method: "POST",
                credentials: "include",
                body: menu
            })

            const responseData = await uploadMenu.json();

            toastMessage(responseData);
        }
        catch (error) {
            console.log(error);
            toastMessage(error);
        }
    }

    return (
        <section className='create-menu'>
            <div className="container">
                <p className='headline-1 section-subtitle text-center'>Create Menu</p>
                <form onSubmit={handleSubmit}>
                    <p>Menu Name</p>
                    <input type="text" className="input-field" name='title' value={menu.title} onChange={(event) => handleInputChangeObj(event, setMenu)} placeholder='Enter the Name of the menu' />
                    <p>Menu Image</p>
                    <input type="File" className="input-field" name='myFile' value={menu.myFile} onChange={(event) => handleInputChangeObj(event, setMenu)} placeholder='Common menu image' />
                    <PrimaryButton text1={"create it"} text2={"let's Create"} />
                </form>
            </div>
        </section>
    )
}

export default CreateMenu