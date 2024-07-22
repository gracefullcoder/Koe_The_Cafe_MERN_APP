import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisConfig} from './AnalyticsFunctions.js';

function BarGraph({title, xAxisValue, yAxisValue }) {

    return (
        <div>
            <p>{title}</p>
            <BarChart
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

export default BarGraph;