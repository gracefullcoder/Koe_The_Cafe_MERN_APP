import React, { useEffect, useState } from 'react'
import TableHead from './TableHead'
import { useParams, useLocation } from 'react-router-dom'
import CreateDish from './CreateDish';
import { SecondaryButton } from '../../reuseable/Button';
import { deleteSectionData } from '../CustomizationAssets/CustomizationFunction';
function Dish() {
    const { menuId } = useParams();
    let [dishes, setDishes] = useState([]);
    const { state } = useLocation();

    useEffect(() => {
        setDishes(state.dishes);
    }, [])

    const removeDish = async (dishId) => {
        await deleteSectionData(dishId, `admin/menusection/dish/${menuId}`, setDishes);
    }

    return (
        <section>
            <div className="table-container">
                <table className="details-table">
                    <TableHead tableHead={["Dish Name", "Desription", "Price", "Tag", "Image", "Delete", "Edit"]} />
                    <tbody>
                        {dishes.map((dish, index) => (
                            <tr key={dish._id}>
                                <td>
                                    {dish.dishName}
                                </td>
                                <td>
                                    {dish.description}
                                </td>
                                <td>
                                    {dish.price}
                                </td>
                                <td>
                                    {dish.tag}
                                </td>
                                <td>
                                    <a href={dish.dishImage}>View</a>
                                </td>
                                <td>
                                    <SecondaryButton text1={"Delete"} text2={"Delete"} fnx={() => removeDish(dish._id)} />
                                </td>
                                <td>
                                    <SecondaryButton text1={"Edit!"} text2={"Edit!"} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <CreateDish menuId={menuId} />
        </section>
    )
}

export default Dish