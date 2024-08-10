import React, { useEffect, useState } from 'react';
import { PrimaryButton } from '../../reuseable/Button';
import { toastMessage } from '../../../helperfunction';
import { handleInputChangeObj } from '../CustomizationAssets/CustomizationFunction';

const MailNotification = ({ users }) => {

    const [mail, setMail] = useState({ title: "", message: "", htmlContent: "", mailUsers: [], users: "" })

    const handleSubmit = async (event) => {
        event.preventDefault();
        const url = `${import.meta.env.VITE_SERVER_ENDPOINT}/admin/notification/mail`;
        const fetchNotification = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify(mail)
        })

        const responseData = await fetchNotification.json();

        toastMessage(responseData);
    };

    const addUser = (event) => {
        if (event.key == 'Enter') {
            let users = event.target.value.split(",");
            users = users.map(user => user.trim())
            console.log(users);
            setMail(prev => ({ ...prev, mailUsers: [...prev.mailUsers, ...users], users: '' }))
        }
    }

    useEffect(() => {
        if (users) {
            setMail(prev => ({ ...prev, mailUsers: [...prev.mailUsers, ...users] }))
        }
    }, [users])

    useEffect(() => {
        async function generateAuth() {
            const grantAuth = `${import.meta.env.VITE_SERVER_ENDPOINT}/admin/notification/auth/gmail`;
            console.log(grantAuth);
            let authUrl = await fetch(grantAuth, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
            authUrl = await authUrl.json();
            console.log(authUrl);

            if (!authUrl.token) {
                window.open(authUrl.url, "_self");
            }
        }

        generateAuth();
    }, [])

    return (
        <section className="text-center create-notification">
            <h2 className='headline-1'>Create Mail Notification!</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <p>Title</p>
                    <input
                        className='input-field'
                        type="text"
                        value={mail.title}
                        name='title'
                        onChange={(e) => handleInputChangeObj(e, setMail)}
                        placeholder="Title"
                        required
                    />
                </div>
                <p>Message</p>
                <textarea
                    className='input-field'
                    value={mail.message}
                    name='message'
                    onChange={(e) => handleInputChangeObj(e, setMail)}
                    placeholder="Message for users to be notified on website and mail"
                    style={{ height: '8rem' }}
                />
                <p>HTML Content for MAIL</p>
                <textarea
                    className='input-field'
                    value={mail.htmlContent}
                    name='htmlContent'
                    onChange={(e) => handleInputChangeObj(e, setMail)}
                    placeholder="Provide Mail Body"
                    style={{ height: '8rem' }}
                />
                <p>Selected Users</p>
                <textarea
                    className='input-field'
                    value={mail.mailUsers}
                    onChange={(e) => handleInputChangeObj(e, setMail)}
                    name='mailUsers'
                    placeholder="Keep it empty if user is not to be notified by email."
                    style={{ height: '8rem' }}
                />
                <PrimaryButton text1={"Clear Selected Users"} text2={"Clear it!"} fnx={() => setMail(prev => ({ ...prev, mailUsers: [] }))} />
                <p>Add Users</p>
                <textarea
                    className='input-field'
                    onKeyDown={addUser}
                    onChange={(e) => handleInputChangeObj(e, setMail)}
                    value={mail.users}
                    name='users'
                    placeholder="Keep it empty if user is not to be notified by email."
                    style={{ height: '8rem' }}
                />
                <PrimaryButton text1={"Create Notification"} text2={"Create it!"} />
            </form>
        </section>
    );
};

export default MailNotification;
