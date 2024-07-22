import React from 'react'
import { PrimaryButton } from '../../reuseable/Button'

function SectionTable({ tableHead, tableBody, editFnx, deleteFnx }) {

    return (
        <div className='table-container'>
            <table className="details-table">
                <thead>
                    <tr>
                        {tableHead.map((heading, index) => (
                            <th scope="col" key={index}>{heading}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableBody.map(
                        (row, index) => (
                            <tr key={row._id || index}>
                                {Object.keys(row).filter(key => !["_id", "imageid", "__v"].includes(key)).map((key, index) => {
                                    {
                                        return (key === "image" ?
                                            (<td key={index}>
                                                <h1><a href={row[key]} target="_blank">View!</a></h1>
                                            </td>) :
                                            (key === "user" ? <td key={index}>{row[key].fullname}</td> : <td key={index}>{row[key]}</td>))
                                    }
                                })}
                                <td>
                                    <PrimaryButton text1={'Edit'} text2={"Let's Edit"} fnx={() => { editFnx(row) }} />
                                </td>
                                <td>
                                    <PrimaryButton text1={'Delete'} text2={"Let's Delete"} fnx={() => { deleteFnx(row._id) }} />
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default SectionTable;