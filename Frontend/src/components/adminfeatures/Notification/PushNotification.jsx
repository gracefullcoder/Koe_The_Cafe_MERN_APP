import React, { useState } from 'react';
import { PrimaryButton } from '../../reuseable/Button';
import { toastMessage } from '../../../helperfunction';

const PushNotification = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = `${import.meta.env.VITE_SERVER_ENDPOINT}/admin/notification/pushnotification`;
    const fetchNotification = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'include',
      body: JSON.stringify({ title, message })
    })

    const responseData = await fetchNotification.json();

    console.log(responseData);
    console.log(fetchNotification);

    toastMessage(responseData);

    console.log('Form submitted:', { title, message });
  };

  return (
    <section className="text-center create-notification">
      <h2 className='headline-1'>Create Push Notification!</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <p>Title</p>
          <input
            className='input-field'
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
          />
        </div>
        <p>Message</p>
        <textarea
          className='input-field'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message for users to be notified on website and mail"
          style={{ height: '8rem' }}
        />
        <PrimaryButton text1={"Create Notification"} text2={"Create it!"} />
      </form>
    </section>
  );
};

export default PushNotification;
