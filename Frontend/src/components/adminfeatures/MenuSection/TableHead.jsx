import React from 'react'

function TableHead({tableHead}) {
    return (
        <thead>
            <tr>
                {tableHead.map((heading, index) => (
                    <th scope="col" className='text-center' key={index}>{heading}</th>
                ))}
            </tr>
        </thead>
    )
}

export default TableHead