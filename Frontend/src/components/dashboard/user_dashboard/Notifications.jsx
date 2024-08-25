import React, { useEffect, useRef, useState } from 'react'
import { generateToken, messaging } from '../../../firebase.js';
import { onMessage, getToken } from 'firebase/messaging';
import { toast } from 'react-toastify';
import { Filter } from '../../Filter/Filter.jsx';
import { useAuthContext } from '../../../context/AuthContext.jsx';

function Notifications() {

    let [notifications, setNotifications] = useState({
        newNotification: [], oldNotification: []
    });

    let [NotificationFilter, setNotificationFilter] = useState("Current Notifications");

    const { user, setUser } = useAuthContext();

    const tokenGenerated = useRef(false);


    useEffect(() => {
        const grantPermission = async () => {
            const token = await getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY });
            const hasToken = `${import.meta.env.VITE_SERVER_ENDPOINT}/pushnotification/token`;
            const fetchTokenDetails = await fetch(hasToken, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ token: token })
            })
            const tokenDetails = await fetchTokenDetails.json();
            
            if (!tokenDetails.token) {
                await generateToken(user._id);
                setUser((prevData) => ({ ...prevData, notification: { ...prevData.notification, pushMessage: 'accept' } }))
            }

            tokenGenerated.current = true;
        };
        !tokenGenerated.current && grantPermission();
    }, []);

    useEffect(() => {
        onMessage(messaging, (payload) => {
            toast(`${payload.notification.body}`);
        });
    })

    useEffect(() => {
        const getNotifications = async () => {
            const notificationsUrl = `${import.meta.env.VITE_SERVER_ENDPOINT}/dashboard/notifications/${user._id}`;
            const fetchNotifications = await fetch(notificationsUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            let response = await fetchNotifications.json();
            // toastMessage(response);


            if (fetchNotifications.ok) {
                const total = response.Notifications.length;
                const numOfUnreads = user.notification.notificationsRemaining;
                let newNotification = response.Notifications.slice(total - numOfUnreads);
                let oldNotification = response.Notifications.slice(0, total - numOfUnreads);

                setNotifications({
                    newNotification: newNotification, oldNotification: oldNotification
                });
            }
        }

        getNotifications();

        return (() => {
            setUser((prevData) => {
                if (user.notification.notificationsRemaining > 0) {
                    toast.info("Marked all notifications as read!", {
                        position: 'top-center',
                        autoClose: 5000
                    });
                }
                return { ...prevData, notification: { ...prevData.notification, notificationsRemaining: 0 } }
            })
        });
    }, [])

    function updateNotification(event, index) {
        setNotifications((prevData) => {
            const newNotification = prevData.newNotification;
            const markedMessage = newNotification.splice(index, 1);
            const oldNotification = prevData.oldNotification;
            oldNotification.push(markedMessage[0])
            return { newNotification: newNotification, oldNotification: oldNotification }
        })
    }


    return (

        <div>
            <div className="notification" id="notifications">
                <div className="title">
                    <i className="fa-regular fa-message"></i>
                    <span className="text">User Notifications</span>
                </div>

                <div className="notification-data">
                    <h1 className="notification-heading">My Notifications</h1>

                    <Filter filter={{ select: NotificationFilter, options: ['Current Notifications', 'Past Notifications', "All Notifications"] }} setState={setNotificationFilter} />
                    {
                        (NotificationFilter == "Current Notifications" || NotificationFilter == "All Notifications") && <div className="notification new-notification">
                            <p className="heading">New Notifications</p>
                            {(notifications.newNotification && notifications.newNotification.length != 0) ?
                                (
                                    notifications.newNotification.map((notification, index) => (
                                        <div className="notification-content" key={notification._id}>
                                            <span className='mark-as-read' onClick={(event) => { updateNotification(event, index) }}>
                                                <i className="fa-regular fa-square-check"></i>
                                                &nbsp; mark as read
                                            </span>
                                            <span className='date'>
                                                {notification.createdAt.toString().slice(0, 10)}
                                            </span>
                                            <p className="notification-title">
                                                {notification.title}
                                            </p>
                                            <p>
                                                {notification.message}
                                            </p>

                                        </div>
                                    ))

                                ) : (<p className='no-activity'>No New Notification!</p>)
                            }
                        </div>}

                    {
                        (NotificationFilter == "Past Notifications" || NotificationFilter == "All Notifications") && <div className="notification old-notification">

                            <p className="heading">Past Notifications : </p>
                            {(notifications.oldNotification.length != 0) ?
                                (
                                    notifications.oldNotification.map((notification, index) => (
                                        <div className="notification-content" key={notification._id}>

                                            <span className='date'>
                                                {notification.createdAt.toString().slice(0, 10)}
                                            </span>
                                            <p className="notification-title">
                                                {notification.title}
                                            </p>
                                            <p>
                                                {notification.message}
                                            </p>

                                        </div>
                                    ))

                                ) : (<p className='no-activity'>No Past Notification!</p>)
                            }

                        </div>}
                </div>
            </div>
        </div>
    )
}

export default Notifications;