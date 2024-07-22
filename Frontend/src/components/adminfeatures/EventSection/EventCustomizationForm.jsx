import React from 'react'
import { PrimaryButton } from '../../reuseable/Button';
import { handleInputChangeObj, handleFileChange } from '../CustomizationAssets/CustomizationFunction';

function EventCustomizeForm({ slideState, selectState, submitFnx }) {

    const [eventCard, setEventCard] = slideState;
    const [select, setSelect] = selectState;


    const cancelSelection = (event) => {
        event.preventDefault();
        setSelect("");
    }


    return (
        <form id="addfield" className="customize-form" encType="multipart/form-data" onSubmit={submitFnx}>
            <label htmlFor="name" className="formlabel text-center">{select === "add" ? "Add a New Slide" : "Edit Slide!"}</label>
            <input type="date" className='input-field' onChange={(event) => { handleInputChangeObj(event, setEventCard) }} value={eventCard.date} id="name" name="date" placeholder="Date" />
            <input type="text" className='input-field' onChange={(event) => { handleInputChangeObj(event, setEventCard) }} value={eventCard.subtitle} name="subtitle" placeholder="subtitle" />
            <input type="text" className='input-field' onChange={(event) => { handleInputChangeObj(event, setEventCard) }} value={eventCard.title} name="title" placeholder="title" />
            <input type="text" className='input-field' onChange={(event) => { handleInputChangeObj(event, setEventCard) }} value={eventCard.detailsLink} name="detailsLink" placeholder="Event Details Link" />
            <input type="file" className='input-field' id="myFile" name="myFile" onChange={(event) => { handleFileChange(event, setEventCard) }} value={eventCard.myFile} />

            <div className='customize-btns'>
                <PrimaryButton
                    text1={select === "add" ? "Add It!" : "Edit Slide!"}
                    text2={"Let'S Go!"}
                    fnx={null}
                />
                <PrimaryButton
                    text1={"Cancel It!"}
                    text2={"Let's Do!"}
                    fnx={cancelSelection}
                />
            </div>
        </form>
    )
}

export default EventCustomizeForm;