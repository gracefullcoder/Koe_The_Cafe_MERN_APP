import React from 'react'
import { PrimaryButton } from '../../reuseable/Button'
function CustomizeTable({ heroSliders, deleteSlide, slideState, previewState }) {
    const [slide, setSlide] = slideState;

    function generateEditForm(sliderId) {
        setSlide(heroSliders.filter((slide) => slide._id == sliderId));
        setPreview(true);
    }

    return (
        <div className='table-container'>
            <table className="details-table">
                <thead>
                    <tr>
                        <th scope="col">LABEL</th>
                        <th scope="col">TITLE</th>
                        <th scope="col">Description</th>
                        <th scope="col">Image URL</th>
                        <th scope="col">Delete Slider</th>
                        <th scope="col">Edit Slider</th>
                    </tr>
                </thead>
                <tbody>
                    {heroSliders.map(
                        (heroSlider, index) => (
                            <tr key={index}>
                                <td>
                                    {heroSlider.label}
                                </td>
                                <td>
                                    {heroSlider.title}
                                </td>
                                <td>
                                    {heroSlider.text}
                                </td>
                                <td>
                                    <h1><a href={heroSlider.image} target="_blank" style={{ color: "greenyellow" }} >View!</a></h1>
                                </td>
                                <td>
                                    <PrimaryButton text1={'Edit'} text2={"Let's Edit"} fnx={() => { generateEditForm(heroSlider._id) }} />
                                </td>
                                <td>
                                    <PrimaryButton text1={'Delete'} text2={"Let's Delete"} fnx={() => { deleteSlide(heroSlider._id) }} />
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default CustomizeTable