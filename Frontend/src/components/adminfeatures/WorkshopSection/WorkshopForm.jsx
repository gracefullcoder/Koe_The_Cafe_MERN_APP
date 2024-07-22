import React from 'react'
import { toastMessage } from '../../../helperfunction';
import { PrimaryButton, SecondaryButton } from '../../reuseable/Button';
import { monitorActivity } from '../../../helperfunction';

function WorkshopForm({ workshopState, selectState }) {
    const [workshopEdit, setWorkshopEdit] = workshopState;
    const [select, setSelect] = selectState;
    function handleInputChange(event) {
        setWorkshopEdit((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        monitorActivity({action:"Workshop Registration Attempted!"});
        const url = `${import.meta.env.VITE_SERVER_ENDPOINT}/admin/workshopsection${select.add ? "" : `/edit/${select.edit}`}`;
        const fetchWorkshop = await fetch(url, {
            method: select.add ? "POST" : "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(workshopEdit)
        });

        const responseData = await fetchWorkshop.json();
        console.log(responseData);
        if (fetchWorkshop.ok) {
            setSelect({ details: true, edit: "", add: false, registrations: false });
            setWorkshopEdit({ title: "", label: "", text: "", date: "", time: "" })
        };
        toastMessage(responseData);
    }

    return (
        <form id="addfield" className="addfield" onSubmit={handleSubmit}>
            <input type="text" className='input-field' id="name" name="label" placeholder="label" value={workshopEdit.label} onChange={handleInputChange} />
            <input type="text" className='input-field' name="title" placeholder="title" value={workshopEdit.title} onChange={handleInputChange} />
            <input type="text" className='input-field' name="text" placeholder="Description of the workshop" value={workshopEdit.text} onChange={handleInputChange} />
            <p>Enter the Date of the workshop</p>
            <input type="date" className='input-field' id="date" name="date" value={workshopEdit.date.toString().slice(0, 10)} onChange={handleInputChange} />
            <p>Enter the time of the workshop</p>
            <input type="time" className='input-field' name="time" required value={workshopEdit.time} onChange={handleInputChange} />
            <PrimaryButton text1={"Edit!"} text2={"Submit!"} fnx={handleSubmit} />
        </form>
    )
}

export default WorkshopForm