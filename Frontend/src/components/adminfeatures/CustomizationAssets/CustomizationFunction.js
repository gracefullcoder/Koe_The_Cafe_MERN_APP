import { toastMessage } from "../../../helperfunction";

// async function handleInputChange(event, setState) {
//     setState((prevSlide) => ([{ ...prevSlide[0], [event.target.name]: event.target.value }]));
//     console.log("did it");
// }

// async function handleFileChange(event, setSlide) {
//     handleInputChange(event, setSlide);

function handleInputChange(event, setState) {
    setState((prevSlide) => ([{ ...prevSlide[0], [event.target.name]: event.target.value }]));
}

function handleInputChangeObj(event, setState) {
    setState((prev) => ({ ...prev, [event.target.name]: event.target.value }));
}

async function handleFileChange(event, setSlide) {
    handleInputChangeObj(event, setSlide);
    const previewImage = new FormData();
    previewImage.append('myFile', event.target.files[0]);
    const previewUrl = `${import.meta.env.VITE_SERVER_ENDPOINT}/admin/preview`;

    try {
        const fetchApi = await fetch(previewUrl, {
            method: 'POST',
            credentials: 'include',
            body: previewImage
        });

        if (fetchApi.ok) {
            const imageData = await fetchApi.json();
            console.log(imageData);
            setSlide((prevSlide) => ({ ...prevSlide, image: imageData.image }));
        } else {
            console.error('Failed to fetch preview image:', fetchApi.statusText);
        }
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
}



async function getSectionData(apiRoute, setState) {
    try {
        let url = `${import.meta.env.VITE_SERVER_ENDPOINT}/`.concat(apiRoute);
        const fetchSliders = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })

        if (fetchSliders.ok) {
            let slidersData = await fetchSliders.json();
            setState(slidersData);
            console.log(slidersData)
        }
    }
    catch (error) {
        toastMessage(error);
    }
}

async function addSectionData(event, apiRoute) {
    event.preventDefault();
    let formData = new FormData(event.target);
    console.log(event.target);
    try {
        const url = `${import.meta.env.VITE_SERVER_ENDPOINT}/${apiRoute}`
        const fetchUrl = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            body: formData
        })
        console.log(fetchUrl);
        const responseData = await fetchUrl.json();
        toastMessage(responseData);
        return responseData;
    }
    catch (error) {
        console.log(error);
        toastMessage(error)
        return { success: false };
    }
}

async function deleteSectionData(slideId, apiRoute, setState) {
    try {
        let url = `${import.meta.env.VITE_SERVER_ENDPOINT}/${apiRoute}/${slideId}`;

        console.log(url);
        const fetchUrl = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })

        const responseData = await fetchUrl.json();
        if (fetchUrl.ok) {
            toastMessage(responseData);
            setState((prevSlides) => (
                prevSlides.filter((slide) => slide._id != slideId)
            ))
        }
    }
    catch (error) {
        console.log(error);
        toastMessage(error)
    }
}


async function editSectionData(event, slideId, apiRoute, setSectionState) {
    // event.preventDefault();
    console.log(event.target)
    try {
        let formData = new FormData(event.target);
        console.log(formData);
        const url = `${import.meta.env.VITE_SERVER_ENDPOINT}/${apiRoute}/${slideId}`;
        console.log(url);
        const fetchUrl = await fetch(url, {
            method: "PATCH",
            credentials: "include",
            body: formData
        })

        const responseData = await fetchUrl.json();
        console.log(responseData.updatedData, slideId)
        if (fetchUrl.ok) {
            setSectionState((prevSlides) => (
                prevSlides.map((prev) => {
                    if (prev._id == slideId) {
                        console.log("in", prev._id);
                        return responseData.updatedData;
                    } else {
                        return prev;
                    }
                }
                )))
        }
        toastMessage(responseData);
        return responseData;
    }
    catch (err) {
        console.log(err);
        toastMessage(err);
        return { success: false };
    }
}

export { handleFileChange, handleInputChange, handleInputChangeObj, getSectionData, addSectionData, deleteSectionData, editSectionData };