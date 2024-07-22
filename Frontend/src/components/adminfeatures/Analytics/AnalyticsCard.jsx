import React from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';

function AnalyticsCard({ analyticsData, downloadData, detailedLink }) {
    const handleDownload = () => {

        const ws = XLSX.utils.json_to_sheet(downloadData.data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "AnalyticsData");

        XLSX.writeFile(wb, `${downloadData.fileName}.xlsx`);
    };

    return (
        <div className='analytics-box'>
            <div className='details'>
                <div>
                    <i className={analyticsData.iconClass}></i>
                    <h3 className='value'>{analyticsData.value}</h3>
                </div>
                {analyticsData.percent < 0 ? (
                    <i className="fa-solid fa-arrow-trend-down"></i>
                ) : (
                    <i className="fa-solid fa-arrow-trend-up"></i>
                )}
            </div>
            <div className='details'>
                <h3 className='details-title'>{analyticsData.title}</h3>
                <p className='percent'>{analyticsData.percent.toFixed(2)} %</p>
            </div>
            <div className='details' style={{ marginTop: "1rem" }}>
                <Link to={detailedLink}>View Detailed Report</Link>
                <button onClick={handleDownload}>
                    <i className="uil uil-import"></i>
                </button>
            </div>
        </div>
    );
}

export default AnalyticsCard;
