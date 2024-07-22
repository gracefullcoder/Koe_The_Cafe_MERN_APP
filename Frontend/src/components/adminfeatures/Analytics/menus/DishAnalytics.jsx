import React, { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { monthData } from '../AnalyticsFunctions';
import Dish from '../../../menusection/Dish';
import {Filter} from "../../../Filter/Filter";

const getTrendingDishMonthy = (monthlyOrders) => {
    const trendingMap = new Map();
    const currentMonthOrders = monthData(monthlyOrders);
    currentMonthOrders.forEach((orderDetails) => {
        orderDetails.orders.forEach((order) => {
            const currentSales = trendingMap.get(order.dish._id) || { dish: order.dish, sales: 0 };
            trendingMap.set(order.dish._id, { ...currentSales, sales: currentSales.sales + order.quantity });
        });
    });
    return trendingMap;
}

const getAverageRating = (menus) => {
    // console.log(menus)
    let dishes = [];
    menus.forEach((menu) => {
        menu.dishes.forEach((dish) => {
            dishes.push({ ...dish, category: menu.title })
        })
    })
    console.log(dishes)
    let averageRatedDishes = dishes.map((dish) => {
        let totalRating = dish.reviews.reduce((acc, review) => (acc + review.rating), 0);
        return { ...dish, avgRating: !totalRating ? null : (totalRating / dish.reviews.length) }
    })

    return averageRatedDishes;
}

function DishAnalytics() {
    const { analytics, setAnalytics, monthlyMappedOrders, recentOrders } = useOutletContext();

    const trendingDishesMonthly = useMemo(() => getTrendingDishMonthy(monthlyMappedOrders), [monthlyMappedOrders]);

    const [categoryFilter, setCategoryFilter] = useState("");

    const sortedTrendingDishes = useMemo(() => {
        return [...trendingDishesMonthly.entries()].sort((a, b) => b[1].sales - a[1].sales);
    }, [trendingDishesMonthly]);

    const ratedDishes = useMemo(() => getAverageRating(analytics.menus), [analytics.menus])

    const sortedRatedDishes = useMemo(() => ratedDishes.sort((a, b) => b.avgRating - a.avgRating), [ratedDishes]);

    const { categoryWiseSorted, categories } = useMemo(() => {
        const categoryWiseSorted = [];
        const categories = []
        let tempCategory = [];

        ratedDishes.forEach((dish, index) => {
            if (index != 0) {
                if (ratedDishes[index - 1].category != dish.category) {
                    tempCategory = tempCategory.sort((a, b) => b.avgRating - a.avgRating);
                    categoryWiseSorted.push(tempCategory);
                    tempCategory = [dish]
                    categories.push(dish.category);
                } else {
                    tempCategory.push(dish);
                }
            } else {
                tempCategory.push(dish);
                categories.push(dish.category);
                setCategoryFilter(dish.category);
            }
        })

        if (tempCategory.length) categoryWiseSorted.push(tempCategory);
        console.log(categoryWiseSorted)
        return { categoryWiseSorted, categories };
    }, [ratedDishes])

    return (
        <div className="trending-container">
            <div className='analytics-container'>
                <p className='analytics-title'>Trending Items this Month</p>
                <div className="menu-container analytics-data">
                    {
                        sortedTrendingDishes.map(([dishId, dishDetails]) => (

                            <div className='dish-box' key={dishId}>
                                <Dish dish={dishDetails.dish} />
                                <p className='analytics-title m-a'>Sales : {dishDetails.sales}</p>
                            </div>

                        ))
                    }
                </div>
            </div>

            <div className='analytics-container'>
                <p className='analytics-title'>Most Rated Dishes</p>
                <div className="menu-container analytics-data">
                    {
                        sortedRatedDishes.map((dish) => (

                            <div className='dish-box' key={dish._id}>
                                <Dish dish={dish} />
                                <p className='analytics-title m-a'>Rating : {dish.avgRating ? dish.avgRating : "Not Reviewed Yet!"}</p>
                                <p>{dish.category}</p>
                            </div>

                        ))
                    }
                </div>
            </div>


            <div className='analytics-container'>
                <p className='analytics-title'>Rated (Categories Wise)</p>
                <Filter filter={{ options: categories, select: categoryFilter }} setState={setCategoryFilter} />
                <div className="menu-container analytics-data">
                    {
                        categoryFilter.length && categoryWiseSorted[categories.indexOf(categoryFilter)].map((dish) => (

                            <div key={dish._id}>
                                <div className='dish-box' key={dish._id}>
                                    <Dish dish={dish} />
                                    <p className='analytics-title m-a'>Rating : {dish.avgRating ? dish.avgRating : "Not Reviewed Yet!"}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className='analytics-container'>
                <p className='analytics-title'>Read Review (Categories Wise)</p>
                <Filter filter={{ options: categories, select: categoryFilter }} setState={setCategoryFilter} />
                <div className="menu-container analytics-data">
                    {
                        categoryFilter.length && categoryWiseSorted[categories.indexOf(categoryFilter)].map((dish) => (

                            <div key={dish._id}>
                                <div className='dish-box' key={dish._id}>
                                    <Dish dish={dish} />
                                </div>
                                <p className='analytics-title m-a'>Reviews</p>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                    {dish.reviews.map((review, index) => (

                                        <div key={index}>
                                            <p>comment: {review.comment || 'Not Commented'}</p>
                                            <p>rating : {review.rating}</p>
                                        </div>

                                    ))}
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default DishAnalytics;
