import React from 'react'
import { PrimaryButton } from '../../reuseable/Button'
function CustomizationMethod({ title, setPreview, setSelect, onAdd }) {

    const previewData = () => {
        setSelect("preview");
    }

    const getAddForm = () => {
        onAdd.setState(onAdd.data);
        setSelect("add");
    }

    const getEditTable = () => {
        setSelect("edit");
        setPreview(false);
    }

    return (
        <>
            <p className='text-center headline-1'>{title}</p>
            <div className='customize-method'>
                <PrimaryButton text1={'Preview Slider'} text2={'Preview It!'} fnx={previewData}></PrimaryButton>
                <PrimaryButton text1={'Add New Slider'} text2={"Let's Add"} fnx={getAddForm}></PrimaryButton>
                <PrimaryButton text1={'Edit Old Slider'} text2={"Let's Edit"} fnx={getEditTable}></PrimaryButton>
            </div>
        </>
    )
}

export default CustomizationMethod