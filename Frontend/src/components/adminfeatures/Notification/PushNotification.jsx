import React, { useState } from 'react';
import { PrimaryButton } from '../../reuseable/Button';
import { toastMessage } from '../../../helperfunction';

const PushNotification = () => {
  const [notification, setNotification] = useState({ title: '', message: '', icon: '', link: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = `${import.meta.env.VITE_SERVER_ENDPOINT}/pushnotification/send`;
    const fetchNotification = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'include',
      body: JSON.stringify(notification)
    })

    const responseData = await fetchNotification.json();

    console.log(responseData);
    console.log(fetchNotification);

    toastMessage(responseData);
  };

  const handleInputChange = (e) => {
    setNotification(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <section className="text-center create-notification">
      <h2 className='headline-1'>Create Push Notification!</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <p>Title</p>
          <input
            className='input-field'
            type="text"
            value={notification.title}
            onChange={handleInputChange}
            name='title'
            placeholder="Title"
            required
          />
        </div>
        <p>Message</p>
        <textarea
          className='input-field'
          value={notification.message}
          onChange={handleInputChange}
          name='message'
          placeholder="Message for users to be notified on website and mail"
          style={{ height: '8rem' }}
        />
        <p>Icon Link</p>
        <input
          className='input-field'
          type="text"
          value={notification.icon}
          onChange={handleInputChange}
          name='icon'
          placeholder="Icon Link"
        />
        <p>Redirect Link</p>
        <input
          className='input-field'
          type="text"
          value={notification.link}
          onChange={handleInputChange}
          name='link'
          placeholder="Link to open when user clicks notification"
          // required
        />
        <PrimaryButton text1={"Create Notification"} text2={"Create it!"} />
      </form>
    </section>
  );
};

export default PushNotification;
