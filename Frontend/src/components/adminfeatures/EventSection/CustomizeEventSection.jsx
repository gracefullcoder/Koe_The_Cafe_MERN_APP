import React, { useEffect, useState } from 'react';
import SectionTable from '../CustomizationAssets/SectionTable';
import CustomizationMethod from "../CustomizationAssets/CustomizationMethod";
import Event from "../../event/Event.jsx";
import { getSectionData, addSectionData, deleteSectionData, editSectionData } from "../CustomizationAssets/CustomizationFunction.js";
import EventCustomizationForm from "./EventCustomizationForm.jsx";

function CustomizeEventSection() {
    const [events, setEvents] = useState([]);
    const [select, setSelect] = useState("");
    const [preview, setPreview] = useState(false);
    const [eventCard, setEventCard] = useState({ date: '', title: '', subtitle: '', detailsLink: '', image: "https://ik.imagekit.io/vaibhav11/Koe_Cafe/events/event-2_x9NQFVJZT.jpg", myFile: "" });

    useEffect(() => {
        const getEvents = async () => { await getSectionData("admin/eventsection", setEvents) };
        getEvents()
    }, [])

    const addNewEvent = async (event) => {
        const result = await addSectionData(event, "admin/eventsection", setEventCard);
        if (result.success == true) {
            setEvents((previewEvents) => [...previewEvents, result.newData]);
            setEventCard({ date: '', title: '', subtitle: '', detailsLink: '', image: "https://ik.imagekit.io/vaibhav11/Koe_Cafe/events/event-2_x9NQFVJZT.jpg", myFile: "" });
        }
    };

    const deleteEvent = (slideId) => { deleteSectionData(slideId, "admin/eventsection", setEvents) };

    const editEvent = async (event) => {
        event.preventDefault();
        await editSectionData(event, eventCard._id, "admin/eventsection/edit", setEvents)
        setPreview(false);
    };

    function generateEditForm(eventDetail) {
        setEventCard({ ...eventDetail, myFile: '' });
        setPreview(true);
    }


    return (
        <section className='customize-section'>
            <CustomizationMethod title={"Customize Event Section"} setSelect={setSelect} setPreview={setPreview}
                onAdd={{ setState: setEventCard, data: { date: '', title: '', subtitle: '', detailsLink: '', image: "https://ik.imagekit.io/vaibhav11/Koe_Cafe/events/event-2_x9NQFVJZT.jpg", myFile: "" } }} />

            {select === "preview" && <Event events={events} />}

            {select === "add" &&
                <>
                    <Event events={[{ ...eventCard }]} />
                    <EventCustomizationForm title={'Add a new Event'} selectState={[select, setSelect]} slideState={[eventCard, setEventCard]} submitFnx={addNewEvent} />
                </>
            }
            {
                select === "edit" &&
                <>
                    {preview &&
                        <>
                            <Event events={[eventCard]} />
                            <EventCustomizationForm title={'Edit Event!'} selectState={[select, setSelect]} slideState={[eventCard, setEventCard]} submitFnx={editEvent} />
                        </>
                    }
                    <SectionTable
                        tableHead={["Date", "Image", "Subttile", "Title", "Event link", "Edit Event", "Delete Event"]}
                        tableBody={events}
                        deleteFnx={deleteEvent}
                        editFnx={generateEditForm}
                    />
                </>
            }
        </section>
    )
}

export default CustomizeEventSection;