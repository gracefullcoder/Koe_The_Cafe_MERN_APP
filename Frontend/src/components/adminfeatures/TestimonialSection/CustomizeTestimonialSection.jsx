import React, { useState, useEffect } from 'react'
import SectionTable from '../CustomizationAssets/SectionTable';
import { getSectionData, deleteSectionData } from '../CustomizationAssets/CustomizationFunction';
function CustomizeTestimonialSection() {
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        const getTestimonials = getSectionData("admin/testimonialsection", setTestimonials);
        getTestimonials;
    }, [])

    const deleteTestimonial = (testimonialId) => { deleteSectionData(testimonialId, "admin/testimonialsection", setTestimonials) };

    const generateEditForm = () => { console.log("not now") };

    return (
        <section className="customization-section">
            <p className='text-center headline-1'>What Users Say!</p>
            <SectionTable
                tableHead={["Suggestion", "Review", "Name", "Edit", "Delete"]}
                tableBody={testimonials}
                deleteFnx={deleteTestimonial}
                editFnx={generateEditForm}
            />
        </section>
    )
}

export default CustomizeTestimonialSection