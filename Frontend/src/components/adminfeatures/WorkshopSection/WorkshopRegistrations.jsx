import React from 'react'
import { PrimaryButton } from '../../reuseable/Button';
import { deleteSectionData } from '../CustomizationAssets/CustomizationFunction';

function WorkshopRegistrations({ registrationsState }) {

    const [registrations, setRegistrations] = registrationsState;
    
    const deleteRegistration = async (registrationId) => {
        deleteSectionData(registrationId,"admin/workshopregistration",setRegistrations);
    }

    return (
        <section className="text-center table-container">
            <h2 className="headline-1">HAVE A LOOK ON REGISTRATIONS</h2>
                <table className="details-table">
                    <thead>
                        <tr>
                            <th scope="col">Index</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone Number</th>
                            <th scope="col">Message</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registrations.map((registration, index) => (
                            <tr key={registration._id}>
                                <td>{index + 1}</td>
                                <td>{registration.user.fullname}</td>
                                <td>{registration.user.username}</td>
                                <td>{registration.phoneNumber}</td>
                                <td>{registration.message}</td>
                                <td>
                                    {/* <form id="signupForm" className="signup-form" method="post" action={`/admin/Workshopregistration/${registration._id}?_method=DELETE`}>
                                        <button type="button" className="btn btn-primary" onClick={() => handleDelete(registration._id)}>
                                            <span className="text text-1">DELETE</span>
                                        </button>
                                    </form> */}
                                    <PrimaryButton text1={"DELETE!"} text2={"Remove!"} fnx={() => deleteRegistration(registration._id)}/>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        </section>
    )
}

export default WorkshopRegistrations