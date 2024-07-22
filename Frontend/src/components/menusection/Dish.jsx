import React from 'react'

function Dish({ dish }) {
    return (
        <div className="dish">
            <img src={dish.dishImage} alt="dish" className="dish-logo" />
            <div className="dish-details">
                <div className="dish-title">
                    <span className="title-3">{dish.dishName}</span>
                    {dish.tag && <span className="dish-badge">{dish.tag}</span>}
                    <span className="dish-price title-3">
                        Price: {dish.price}/-
                    </span>
                </div>
                <div className="dish-description card-text label-1">
                    {dish.description}
                </div>
            </div>
        </div>
    )
}

export default Dish