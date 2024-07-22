import React from 'react'
import { PrimaryButton } from '../../reuseable/Button';
import { handleFileChange, handleInputChange, handleInputChangeObj } from '../CustomizationAssets/CustomizationFunction';


function SpecialityCustomizeForm({ slideState, selectState, submitFnx }) {

    const [slide, setSlide] = slideState;
    const [select, setSelect] = selectState;

    const cancelSelection = (event) => {
        event.preventDefault();
        setSelect("");
    }


    return (
        <form id="addfield" className="customize-form" encType="multipart/form-data" onSubmit={submitFnx}>
            <label htmlFor="name" className="formlabel text-center">{select === "add" ? "Add a New Slide" : "Edit Slide!"}</label>
            <input type="text" className='input-field' onChange={(event) => { handleInputChangeObj(event, setSlide) }} value={slide.label} id="name" name="label" placeholder="label" required />
            <input type="text" className='input-field' onChange={(event) => { handleInputChangeObj(event, setSlide) }} value={slide.title} name="title" placeholder="title" required />
            <input type="text" className='input-field' onChange={(event) => { handleInputChangeObj(event, setSlide) }} value={slide.text} name="text" placeholder="Description" required />
            <input type="file" className='input-field' id="myFile" name="myFile" onChange={(event) => { handleFileChange(event, setSlide) }} value={slide.myFile} />
            <div className='customize-btns'>
                <PrimaryButton
                    text1={select === "add" ? "Add It!" : "Edit Slide!"}
                    text2={"Let'S Go!"}
                    fnx={null}
                    type="submit"
                />
                <PrimaryButton
                    text1={"Cancel It!"}
                    text2={"Let's Do!"}
                    fnx={cancelSelection}
                    type="submit"
                />
            </div>
        </form>
    )
}

export default SpecialityCustomizeForm;