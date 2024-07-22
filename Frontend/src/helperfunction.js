import { toast } from "react-toastify";

function toastMessage(responseData) {
    if (responseData.success) {
        toast.success(responseData.message, {
            position: "top-center",
            autoClose: 5000
        });
    } else {
        toast.error(responseData.message, {
            position: "top-center",
            autoClose: 5000
        })
    }
}

function validatePhoneNumber(number){
    number = parseInt(number);
    if(number.length != 10) return false;
    return true;
}

function getTime(isoDate) {
    let dateFormat = new Date(isoDate);
    return `${dateFormat.getHours().toString().padStart(2, 0)}:${dateFormat.getMinutes().toString().padStart(2, 0)}`
}

function getTime12hrs(isoDate) {
    let dateFormat = new Date(isoDate);
    let interval = "AM";
    let hrs = dateFormat.getHours();
    let minutes = dateFormat.getMinutes();
    if (hrs >= 12) {
        interval = "PM";
        if (hrs > 12) hrs -= 12;
    }

    if (hrs == 0) hrs += 12;
    if (minutes < 10) minutes = '0' + minutes;
    if (hrs < 10) hrs = '0' + hrs;

    return `${hrs}:${minutes} ${interval}`;
}


const wrapAsync = (fn) => {
    fn().catch((err) => {
        throw err;
        console.log(err);
    }
    )
}


const getData = async (route) => {
    try {
        const url = `${import.meta.env.VITE_SERVER_ENDPOINT}/${route}`;

        const fetchUrl = await fetch(url, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        })
        let responseData = await fetchUrl.json();
        toastMessage(responseData);
        return responseData;
    }
    catch (error) {
        console.log(error);
        toastMessage(error);
        return false;
    }
}

const patchData = async (route, data) => {
    try {
        const url = `${import.meta.env.VITE_SERVER_ENDPOINT}/${route}`;

        const fetchUrl = await fetch(url, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        let responseData = await fetchUrl.json();
        toastMessage(responseData);
        return responseData;
    }
    catch (error) {
        console.log(error);
        toastMessage(error);
        return false;
    }

}


const uploadFormData = async (event, route, method) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    try {
        const url = `${import.meta.env.VITE_SERVER_ENDPOINT}/${route}`;
        const fetchUrl = await fetch(url, {
            method: method,
            credentials: "include",
            body: formData
        })
        let responseData = await fetchUrl.json();
        toastMessage(responseData);
        return responseData;
    }
    catch (error) {
        console.log(error);
        toastMessage(error);
        return false;
    }
}


const monitorActivity = async (data) => {
    try {
        const url = `${import.meta.env.VITE_SERVER_ENDPOINT}/traffic`;

        const fetchUrl = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
    }
    catch (error) {
        return false;
    }
}


const linkVisited = async (event, name) => {
    await monitorActivity({ LinkVisited: name || event.target.innerText })
}

const pageVisited = async (pageName) => {
    await monitorActivity({ pageVisited: pageName });
}

const actionPerformed = async (key, description) => {
    await monitorActivity({
        action: { key, description }
    });
}


export { toastMessage, getTime, getTime12hrs, wrapAsync, getData, patchData, uploadFormData, monitorActivity, linkVisited, pageVisited, actionPerformed ,validatePhoneNumber};