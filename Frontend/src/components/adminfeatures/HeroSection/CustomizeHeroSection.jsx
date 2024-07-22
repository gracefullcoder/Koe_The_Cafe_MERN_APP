import React, { useEffect, useState } from 'react';
import HeroSection from '../../herosection/HeroSection';
import HeroCustomizeForm from './HeroCustomizeForm';
import { toastMessage } from '../../../helperfunction';
import CustomizationMethod from '../CustomizationAssets/CustomizationMethod';
import SectionTable from '../CustomizationAssets/SectionTable';
import { getSectionData, addSectionData, deleteSectionData, editSectionData } from "../CustomizationAssets/CustomizationFunction.js";

function CustomizeHeroSection() {
    const [heroSliders, setHeroSliders] = useState([]);
    const [slide, setSlide] = useState({ label: '', title: '', text: '', image: "https://ik.imagekit.io/vaibhav11/Koe_Cafe/herosection/heroslider_3_pUfcGsINZ.jpg", myFile: "" })
    const [select, setSelect] = useState("");
    const [preview, setPreview] = useState(false);

    useEffect(() => {
        const getHeroSliders = () => { getSectionData("admin/herosection", setHeroSliders) };
        getHeroSliders()
    }, [])

    const addNewSlider = async (event) => {
        const result = await addSectionData(event, "admin/herosection", setSlide)
        if (result.success) {
            setHeroSliders((prev) => [...prev, result.newData]);
            setSlide({ label: '', title: '', text: '', image: "https://ik.imagekit.io/vaibhav11/Koe_Cafe/herosection/heroslider_3_pUfcGsINZ.jpg", myFile: "" })
        }
    };

    const deleteSlide = (slideId) => { deleteSectionData(slideId, "admin/herosection", setHeroSliders) }

    const editHeroSlide = async (event) => {
        event.preventDefault();
        const result = await editSectionData(event, slide._id, "admin/herosection/edit", setHeroSliders, setSlide);
        if (result.success) {
            setSlide({ label: '', title: '', text: '', image: "https://ik.imagekit.io/vaibhav11/Koe_Cafe/herosection/heroslider_3_pUfcGsINZ.jpg", myFile: "" })
        }
        setPreview(false);
    };

    function generateEditForm(slide) {
        setSlide({ ...slide, myFile: "" });
        setPreview(true);
    }

    return (
        <section className='customize-section'>

            <CustomizationMethod title={"Customize Hero Section"} setSelect={setSelect} setPreview={setPreview}
                onAdd={{ setState: setSlide, data: { label: '', title: '', text: '', image: "https://ik.imagekit.io/vaibhav11/Koe_Cafe/herosection/heroslider_3_pUfcGsINZ.jpg", myFile: "" } }} />

            {select === "preview" && <HeroSection heroSliders={heroSliders} />}

            {select === "add" &&
                <>
                    <HeroSection heroSliders={[slide]} />
                    <HeroCustomizeForm select={select} title={'Add a new Slider'} slideState={[slide, setSlide]} selectState={[select, setSelect]} submitFnx={addNewSlider} />
                </>
            }
            {
                select === "edit" &&
                <>
                    {preview &&
                        <>
                            <HeroSection heroSliders={[slide]} ></HeroSection>
                            <HeroCustomizeForm title={'Edit Slide!'} selectState={[select, setSelect]} slideState={[slide, setSlide]} submitFnx={editHeroSlide} />
                        </>
                    }
                    <SectionTable
                        tableHead={["Lable", "Title", "Description", "Image Url", "Edit Slider", "Delete Slider"]}
                        tableBody={heroSliders}
                        deleteFnx={deleteSlide}
                        editFnx={generateEditForm}
                    />
                </>
            }
        </section>
    )
}

export default CustomizeHeroSection