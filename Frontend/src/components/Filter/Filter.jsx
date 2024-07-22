import React from 'react'
import { toastMessage } from '../../helperfunction';
import { PrimaryButton } from '../reuseable/Button';

function Filter({ filter, setState }) {
    return (
        <div className='filter-options'>
            <p className='filter-label label-1'>Filter</p>
            <select className='input-field' onChange={(event) => setState(event.target.value)} value={filter.select}>
                {filter.options.map((option, index) => <option value={option} key={index}>
                    {option}
                </option>)}
            </select>
        </div>
    )
}

function MultipleFilter({ filter, setState }) {
    return (
        <div className='filter-options'>
            <p className='filter-label label-1'>Filter</p>
            <select className='input-field' name={filter.name} onChange={(event) => setState(prevFilter => ({ ...prevFilter, [event.target.name]: event.target.value }))} value={filter.select}>
                {filter.options.map((option, index) => <option value={option} key={index}>
                    {option}
                </option>)}
            </select>
        </div>
    )
}

function compareDate(date1, date2) {
    if ((new Date(date1)) > (new Date(date2))) return true;
    return false;
}

function DateFilter({ filter,filterFnx }) {
    let [dateFilter,setDateFilter] = filter;
    return (
        <div className='filter-options text-center'>
            <div>
                <p>Start Date</p>
                <input type="date" className="input-field" value={dateFilter.startDate}
                    onChange={(e) => {
                        const newStartDate = e.target.value;
                        const currEndDate = dateFilter.endDate;
                        if (!currEndDate) setDateFilter(prev => ({ ...prev, startDate: newStartDate }))
                        else if (compareDate(currEndDate, newStartDate)) setDateFilter(prev => ({ ...prev, startDate: newStartDate }))
                        else toastMessage({ success: false, message: `Start Date must be before ${currEndDate}` })
                    }}
                />
            </div>
            <div>
                <p>End Date</p>
                <input type="date" className="input-field" value={dateFilter.endDate}
                    onChange={(e) => {
                        const newEndDate = e.target.value;
                        const currStartDate = dateFilter.startDate;
                        if (!currStartDate) setDateFilter(prev => ({ ...prev, endDate: newEndDate }))
                        else if (compareDate(newEndDate, currStartDate)) setDateFilter(prev => ({ ...prev, endDate: newEndDate }))
                        else toastMessage({ success: false, message: `End Date must be after ${currStartDate}` })
                    }}
                />
            </div>
            <PrimaryButton text1={"Filter"} text2={"Filter"} fnx={filterFnx}/>
        </div>
    )
}


export { Filter, MultipleFilter, DateFilter }