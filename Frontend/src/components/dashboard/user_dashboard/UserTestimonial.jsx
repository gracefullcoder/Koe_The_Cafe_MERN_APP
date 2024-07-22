import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { toastMessage } from '../../../helperfunction';

function UserTestimonial() {
    const { testimonial } = useOutletContext();
    const { userTestimonial, setUserTestimonial } = testimonial;
    const [makeChange, setMakeChange] = useState(false);
    console.log(userTestimonial);

    function toggleUpdation() {
        setMakeChange((prev) => (!prev));
    }

    function handleTestimonialChange(event) {
        setUserTestimonial((prevData) => ({ ...prevData, [event.target.name]: event.target.value }));
    }

    async function handleTestimonial(event) {
        event.preventDefault();
        const testimonialUrl = `${import.meta.env.VITE_SERVER_ENDPOINT}/dashboard/testimonial/${userTestimonial._id}`;
        const fetchTestimonial = await fetch(testimonialUrl, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ review: userTestimonial.review, suggestion: userTestimonial.suggestion })
        });
        const responseData = await fetchTestimonial.json();

        if (fetchTestimonial.ok) setMakeChange(false);
        toastMessage(responseData);
    }

    async function handleTestimonialDeletion(event) {
        event.preventDefault();
        const testimonialUrl = `${import.meta.env.VITE_SERVER_ENDPOINT}/dashboard/testimonial/${userTestimonial._id}`;
        const fetchTestimonial = await fetch(testimonialUrl, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
        });
        const responseData = await fetchTestimonial.json();

        if (fetchTestimonial.ok) {
            setMakeChange(false);
            setUserTestimonial(null);
        }
        toastMessage(responseData);
    }

    return (
        <div>
            <h1 className="activity-heading">Testimonial</h1>

            {userTestimonial ? (<div className="user-activity" id="testimonial">
                <div className="activity-box testimonial-box">
                    <form className='testimonial-form'>
                        <div className="activity-detail-field">
                            <h3 className="activity-detail-label">Review:</h3>
                            <textarea id="testimonial-input" name="review" value={userTestimonial.review}
                                onChange={handleTestimonialChange}
                                disabled={!makeChange}
                                required></textarea>
                        </div>
                        <div className="activity-detail-field">
                            <h3 className="activity-detail-label">Suggestion:</h3>
                            <textarea id="testimonial-input"
                                name="suggestion" value={userTestimonial.suggestion} onChange={handleTestimonialChange}></textarea>
                        </div>
                        {makeChange && (
                            <div className="update-button">
                                <button
                                    className="buttonuser btn btn-secondary"
                                    role="button"
                                    onClick={handleTestimonial}
                                    disabled={!makeChange}
                                >
                                    <span className="text text-1">Update</span>
                                    <span className="text text-2">Update</span>
                                </button>
                                <button
                                    className="buttonuser btn btn-secondary"
                                    role="button"
                                    onClick={handleTestimonialDeletion}
                                >
                                    <span className="text text-1">Delete</span>
                                    <span className="text text-2">Delete</span>
                                </button>
                            </div>
                        )}
                    </form>

                    {!makeChange && (
                        <button
                            className="buttonuser btn btn-secondary"
                            role="button"
                            onClick={toggleUpdation}
                        >
                            <span className="text text-1">Make Changes!</span>
                            <span className="text text-2">Make Changes!</span>
                        </button>
                    )}
                </div>
            </div>) : (
                <div className="no-activity text-center">
                    <a href="/testimonial">ADD Testimonial!</a>
                </div>)}
        </div>
    )
}

export default UserTestimonial