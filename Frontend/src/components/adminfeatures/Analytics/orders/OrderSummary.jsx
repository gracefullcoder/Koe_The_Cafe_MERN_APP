import React from 'react'
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { Link } from 'react-router-dom';

function updateInterval(interval, setIntervalState) {
    setIntervalState(interval);
}

function OrderSummary({ orderSummary, intervalState }) {
    let [summaryInterval, setSummaryInterval] = intervalState;

    return (
        <div className="order-summary">
            <h1 className='summary-title'>Order Summary</h1>
            <p>Use the Analytics to accelerate your Buisness</p>
            <div className='interval-filter'>
                <button className={`interval ${summaryInterval == 0 ? 'active' : ''}`} onClick={() => updateInterval(0, setSummaryInterval)}>Today</button>
                <button className={`interval ${summaryInterval == 1 ? 'active' : ''}`} onClick={() => updateInterval(1, setSummaryInterval)}>Weekly</button>
                <button className={`interval ${summaryInterval == 2 ? 'active' : ''}`} onClick={() => updateInterval(2, setSummaryInterval)}>Monthly</button>
            </div>
            <div className='active-orders'>
                <div className='orders'>
                    <div className='count'>
                        {orderSummary.servingOrders.length}
                    </div>
                    <div className='text'>
                        New Orders
                    </div>
                    <div>
                    </div>
                </div>
                <div className='order-redirect'>
                    <div className="text">
                        <Link to={"/admin/order"}>Manage Orders</Link>
                    </div>
                    <i className="uil uil-angle-right-b"></i>
                </div>
            </div>

            <div className='status'>
                <div>
                    <p className='count'>{orderSummary.servingOrders.length}</p>
                    <p className='text'>On Delivery</p>
                </div>
                <div>
                    <p className='count'>{orderSummary.servedOrders.length}</p>
                    <p className='text'>Served</p>
                </div>
                <div>
                    <p className='count'>{orderSummary.cancelledOrders.length}</p>
                    <p className='text'>Cancelled</p>
                </div>
            </div>
            <div className='chart-container'>
                <PieChart
                    colors={['#835BE9', 'lightgreen', '#E95D5B']}
                    slotProps={{
                        legend: {
                            labelStyle: {
                                fontSize: 20,
                                fill: 'white',
                            },
                        },
                    }}
                    series={[
                        {
                            data: [
                                { id: 0, value: orderSummary.servingOrders.length, label: 'On Delivery' },
                                { id: 1, value: orderSummary.servedOrders.length, label: 'Served' },
                                { id: 2, value: orderSummary.cancelledOrders.length, label: 'Cancelled' },
                            ],
                            innerRadius: 30,
                            outerRadius: 90,
                            paddingAngle: 5,
                            cornerRadius: 5
                        },
                    ]}
                    width={400}
                    height={200}
                />
            </div>


        </div>


    )
}

export default OrderSummary