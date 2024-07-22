import React, { useState, useEffect } from 'react';
import WorkshopTable from './WorkshopTable.jsx';
import WorkshopRegistrations from './WorkshopRegistrations.jsx';
import WorkshopForm from './WorkshopForm.jsx';
import { PrimaryButton } from '../../reuseable/Button.jsx';
import {Filter} from '../../Filter/Filter.jsx';

function ManageWorkshop() {
  const [currentWorkshops, setCurrentWorkshops] = useState([]);
  const [pastWorkshops, setPastWorkshops] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [workshopEdit, setWorkshopEdit] = useState({ title: "", label: "", text: "", date: "", time: "" });
  const [select, setSelect] = useState({ details: false, add: true, edit: "", registrations: false });
  const [filter, setFilter] = useState("Current");

  useEffect(() => {
    const getWorkshops = async () => {
      const url = `${import.meta.env.VITE_SERVER_ENDPOINT}/admin/workshopsection`;
      const fetchWorkshops = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      });
      const workshopData = await fetchWorkshops.json();
      if (fetchWorkshops.ok) {
        setCurrentWorkshops(workshopData.currWorkshops);
        setPastWorkshops(workshopData.pastWorkshops);
      }
    }

    getWorkshops();
    console.log(currentWorkshops, pastWorkshops);
  }, [select.edit, select.add])


  return (
    <section className="text-center">
      <div className="title"><i className="uil uil-tachometer-fast-alt"></i><span className="text">Manage Workshops</span></div>

      <div className="customize-method">
        <PrimaryButton text1={"Create a new Workshop"} text2={"Let's Create!"} fnx={() => (setSelect({ details: false, add: true, edit: "", registrations: false }))} />
        <PrimaryButton text1={"Active Workshops"} text2={"Have a look!"} fnx={() => (setSelect({ details: true, add: false, edit: "", registrations: false }))} />
      </div>

      {select.registrations && <WorkshopRegistrations registrationsState={[registrations, setRegistrations]} />}

      {select.edit.length != 0 &&
        <>
          <p className='section-subtitle headline-1'>Update Workshop</p>
          <WorkshopForm workshopState={[workshopEdit, setWorkshopEdit]} selectState={[select, setSelect]} />
        </>
      }


      {select.add &&
        <>
          <p className='section-subtitle headline-1'>Create Workshop</p>
          <WorkshopForm workshopState={[workshopEdit, setWorkshopEdit]} selectState={[select, setSelect]} />
        </>}

      {select.details &&
        <>
          <Filter filter={{ options: ["All", "Current", "Past"], select: filter }} setState={setFilter} />
          {(filter == "All" || filter == "Current") &&
            <>
              <h2 className="headline-1 section-title">Current Workshops</h2>
              <WorkshopTable workshops={currentWorkshops} setWorkshops={setCurrentWorkshops} setStates={[setCurrentWorkshops, setRegistrations, setSelect, setWorkshopEdit]} />
            </>}


          {(filter == "All" || filter == "Past") &&
            <>
              <h2 className="headline-1 section-title">Past Workshops</h2>
              <WorkshopTable workshops={pastWorkshops} setWorkshops={setPastWorkshops} setStates={[setPastWorkshops, setRegistrations, setSelect, setWorkshopEdit]} />
            </>}
        </>}

    </section>
  )
}

export default ManageWorkshop;