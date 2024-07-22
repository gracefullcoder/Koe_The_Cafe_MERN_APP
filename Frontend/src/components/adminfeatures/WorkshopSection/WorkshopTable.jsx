import React, { useState } from 'react';
import { PrimaryButton } from "../../reuseable/Button.jsx";
import { getSectionData, deleteSectionData } from '../CustomizationAssets/CustomizationFunction';
import { getTime } from '../../../helperfunction.js';

function WorkshopTable({ workshops, setStates }) {
    const [setWorkshops, setRegistrations, setSelect, setWorkshopEdit] = setStates;


    const getRegistrations = async (workshopId) => {
        await getSectionData(`admin/workshopregistration/${workshopId}`, setRegistrations);
        setSelect({ details: false, add: false, edit: "", registrations: true });
    }

    const deleteWorkshop = async (workshopId) => {
        await deleteSectionData(workshopId, "admin/workshopsection", setWorkshops);
    }

    const editWorkshop = (workshop) => {
        setWorkshopEdit({ label: workshop.label, title: workshop.title, text: workshop.text, date: workshop.time.toString().slice(0, 10), time: getTime(workshop.time) });
        setSelect({ details: false, add: false, edit: workshop._id, registrations: false })
    }

    return (
        <div className="table-container">
            <table className="details-table">
                <thead>
                    <tr>
                        <th scope="col">LABEL</th>
                        <th scope="col">TITLE</th>
                        <th scope="col">TEXT BELOW TITLE</th>
                        <th scope="col">TIME</th>
                        <th scope="col">Get Details</th>
                        <th scope="col">Edit Countdown</th>
                        <th scope="col">Delete Slider</th>
                    </tr>
                </thead>
                <tbody>
                    {workshops.map((workshop) => (
                        <tr key={workshop._id}>
                            <td>{workshop.label}</td>
                            <td>{workshop.title}</td>
                            <td>{workshop.text}</td>
                            <td>{workshop.time}</td>
                            <td>
                                {/* <button onClick={() => handleAction(`/admin/workshopregistration/${workshop._id}`, 'GET')}>
                                    Get Details!
                                </button> */}
                                <PrimaryButton text1={"Registartions"} text2={"Get it!"} fnx={() => { getRegistrations(workshop._id) }} />
                            </td>
                            <td>
                                {/* <button onClick={() => handleAction(`/admin/workshopsection/edit/${workshop._id}`, 'GET')}>
                                    EDIT!
                                </button> */}
                                <PrimaryButton text1={"Edit"} text2={"Do it!"} fnx={() => { editWorkshop(workshop) }} />
                            </td>
                            <td>
                                <PrimaryButton text1={"Delete"} text2={"Le's Go!"} fnx={() => { deleteWorkshop(workshop._id) }} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default WorkshopTable;