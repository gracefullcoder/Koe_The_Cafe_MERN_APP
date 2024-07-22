import React from 'react';
import { LineChart } from '@mui/x-charts';
import { axisConfig } from './AnalyticsFunctions.js';

function LineGraph({ xAxisValue, yAxisValue, title }) {

    return (
        <div>
            <p>
                {title}
            </p>
            <LineChart
                sx={axisConfig()}
                xAxis={[
                    {
                        id: 'barCategories',
                        data: xAxisValue,
                        scaleType: 'band',
                        tickPlacement: 'middle'
                    },
                ]}

                yAxis={[
                    {
                        min:0
                    }
                ]}

                series={[
                    {
                        data: yAxisValue,
                    },
                ]}
                width={500}
                height={300}
            />
        </div>
    )
}

export default LineGraph;