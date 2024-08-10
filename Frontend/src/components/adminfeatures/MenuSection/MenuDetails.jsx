import React, { useEffect, useState } from 'react'
import { deleteSectionData, getSectionData } from '../CustomizationAssets/CustomizationFunction';
import { useNavigate } from 'react-router-dom';
import TableHead from "./TableHead";
import { handleInputChangeObj } from '../CustomizationAssets/CustomizationFunction';

import { SecondaryButton } from '../../reuseable/Button';
import { uploadFormData } from '../../../helperfunction';


function MenuDetails() {
    const [menus, setMenus] = useState([]);
    let [edit, setEdit] = useState({ _id: "", title: "", myFile: "", available: "" })
    const navigate = useNavigate();

    const navigateFnx = (route, dishes) => {
        navigate(route, { state: { dishes: dishes } });
    }

    useEffect(() => {
        getSectionData("admin/menusection", setMenus);
    }, []);

    const deleteMenu = async (menuId) => {
        await deleteSectionData(menuId, "admin/menusection", setMenus);
    }

    const editMenu = async (menu) => {
        setEdit({ ...menu, available: menu.available ? "yes" : "no" });
    }

    const handleMenuEdit = async (event) => {
        const updateResponse = await uploadFormData(event, `admin/menusection/${edit._id}`, "PATCH");
        if (updateResponse.success) setEdit({ _id: "", title: "", myFile: "" })
    }

    return (
        <section className='text-center'>
            {edit._id &&
                <>
                    <p className='headline-1 section-subtitle'>Update Menu</p>
                    <form onSubmit={handleMenuEdit}>
                        <p>New Title</p>
                        <input type="text" className="input-field" name='title' value={edit.title} onChange={(event) => handleInputChangeObj(event, setEdit)} />
                        <p>Update Image</p>
                        <input type="file" className='input-field' name='myFile' onChange={(event) => handleInputChangeObj(event, setEdit)} />
                        <div className='flex'>
                            <label className="status flex">
                                <p>Active</p>
                                <input type="radio"
                                    name='available' value={"yes"}
                                    onChange={(event) => handleInputChangeObj(event, setEdit)}
                                    checked={edit.available == "yes"}
                                />
                            </label>
                            <label className="status flex">
                                <p>Disable</p>
                                <input type="radio" name='available' value={"no"}
                                    onChange={(event) => handleInputChangeObj(event, setEdit)}
                                    checked={edit.available == "no"}
                                />
                            </label>
                        </div>
                        <div className='flex'>
                            <SecondaryButton text1={"Update Menu"} text2={"Submit!"} />
                            <SecondaryButton text1={edit.available ? "Disable Menu" : "Enable Menu"} text2={"Submit!"} />
                        </div>
                    </form>
                </>}
            <div className="table-container">
                <table className="details-table">
                    <TableHead tableHead={["Menu Name", "Image", "Dishes", "Delete Menu", "Edit Menu"]} />
                    <tbody>
                        {
                            menus.length != 0 && menus.map((menu, index) => (
                                <tr key={menu._id}>
                                    <td>
                                        {menu.title}
                                    </td>
                                    <td>
                                        <a href={menu.image} target="_blank" >View </a>
                                    </td>
                                    <td>
                                        <SecondaryButton text1={"Dishes"} text2={"See Dish!"} fnx={() => navigateFnx(`/admin/menu/dishes/${menu._id}`, menu.dishes)} />
                                    </td>
                                    <td>
                                        <SecondaryButton text1={"Delete Menu!"} text2={"Delete It!"} fnx={() => { deleteMenu(menu._id) }} />
                                    </td>
                                    <td>
                                        <SecondaryButton text1={"Edit Menu!"} text2={"Edit It!"} fnx={() => { editMenu(menu) }} />
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default MenuDetails