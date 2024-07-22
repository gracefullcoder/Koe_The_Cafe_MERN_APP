import React, { useEffect, useState } from 'react';
import SpecialityCustomizeForm from "./SpecialityCustomizeForm";
import CustomizationMethod from '../CustomizationAssets/CustomizationMethod.jsx';
import Specialities from '../../specialities/Specialities';
import SectionTable from '../CustomizationAssets/SectionTable';
import { getSectionData, addSectionData, deleteSectionData, editSectionData } from "../CustomizationAssets/CustomizationFunction.js";

function CustomizeSpecialitySection() {
    const [specialitySlides, setSpecialitySlides] = useState([]);
    const [select, setSelect] = useState("");
    const [preview, setPreview] = useState(false);
    const [slide, setSlide] = useState({ label: '', title: '', text: '', image: "https://ik.imagekit.io/vaibhav11/Koe_Cafe/specialities/pizza_qQnHXS4wlQ.jfif", myFile: "" });

    useEffect(() => {
        const getSpecialitySlides = async () => { await getSectionData("admin/specialitysection", setSpecialitySlides) };
        getSpecialitySlides();
    }, [])


    const deleteSlide = (slideId) => { deleteSectionData(slideId, "admin/specialitysection", setSpecialitySlides) };

    const addNewSlider = async (event) => {
        const result = await addSectionData(event, "admin/specialitysection", setSlide)

        if (result.success == true) {
            setSpecialitySlides((previewEvents) => [...previewEvents, result.newData]);
            setSlide({ label: '', title: '', text: '', image: "https://ik.imagekit.io/vaibhav11/Koe_Cafe/specialities/pizza_qQnHXS4wlQ.jfif", myFile: "" });
        }
    };


    const editSpecialitySlide = async (event) => {
        event.preventDefault();
        const result = await editSectionData(event, slide._id, "admin/specialitysection/edit", setSpecialitySlides, setSlide);

        if (result.success) {
            setSlide({ label: '', title: '', text: '', image: "https://ik.imagekit.io/vaibhav11/Koe_Cafe/specialities/pizza_qQnHXS4wlQ.jfif", myFile: "" });
        }
        setPreview(false);
    };

    function generateEditForm(slide) {
        setSlide({ ...slide, myFile: '' });
        setPreview(true);
    }


    return (
        <section className='customize-section'>
            <CustomizationMethod title={"Customize Speciality Section"} setSelect={setSelect} setPreview={setPreview}
                onAdd={{ setState: setSlide, data: { label: '', title: '', text: '', image: "https://ik.imagekit.io/vaibhav11/Koe_Cafe/specialities/pizza_qQnHXS4wlQ.jfif", myFile: "" } }} />

            {select === "preview" && <Specialities specialSliders={specialitySlides} />}

            {select === "add" &&
                <>
                    <Specialities specialSliders={[slide]} ></Specialities>
                    <SpecialityCustomizeForm select={select} title={'Add a new Speciality'} slideState={[slide, setSlide]} selectState={[select, setSelect]} submitFnx={addNewSlider} />
                </>
            }
            {
                select === "edit" &&
                <>
                    {preview &&
                        <>
                            <Specialities specialSliders={[slide]} />
                            <SpecialityCustomizeForm title={'Edit Slide!'} selectState={[select, setSelect]} slideState={[slide, setSlide]} submitFnx={editSpecialitySlide} />
                        </>
                    }
                    <SectionTable
                        tableHead={["Lable", "Title", "Description", "Image", "Edit Slider", "Delete Slider"]}
                        tableBody={specialitySlides}
                        deleteFnx={deleteSlide}
                        editFnx={generateEditForm}
                    />
                </>
            }
        </section>
    )
}

export default CustomizeSpecialitySection