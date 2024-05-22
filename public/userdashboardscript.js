let analyticsElement = document.querySelectorAll("#analytics");
let dashboardElement = document.querySelectorAll("#dashboard");
let messagebroadcast = document.querySelectorAll("#messagebroadcast");
let overview = document.querySelector(".overview");
let analyticsdiv = document.querySelector(".activity");
let messagediv = document.querySelector(".messagebroadcastdiv");

function hideAll() {
    overview.classList.add("hide");
    analyticsdiv.classList.add("hide");
    messagediv.classList.add("hide");
}

function showSelected(parentDiv) {
    parentDiv.classList.remove("hide");
}

document.addEventListener("DOMContentLoaded", () => {
    hideAll();
    showSelected(overview);

    let params = new URLSearchParams(window.location.search);
    let section = params.get("section");

    if (section === "dashboard") {
        hideAll();
        showSelected(overview);
    } else if (section === "activity") {
        hideAll();
        showSelected(analyticsdiv);
    } else if (section === "notifications") {
        hideAll();
        showSelected(messagediv);
    }
});

dashboardElement.forEach((button) => {
    button.addEventListener("click", () => {
        hideAll();
        showSelected(overview);
    });
});

analyticsElement.forEach((button) => {
    button.addEventListener("click", () => {
        hideAll();
        showSelected(analyticsdiv);
    });
});

messagebroadcast.forEach((button) => {
    button.addEventListener("click", () => {
        hideAll();
        showSelected(messagediv);
    });
});



dashboardElement.forEach((button) => {
    button.addEventListener("click", () => {
        // overview.classList.remove("hide");
        // analyticsdiv.classList.add("hide");
        // messagediv.classList.add("hide");
        hideAll();
        showSelected(overview);
    })
})


analyticsElement.forEach((button) => {
    button.addEventListener("click", () => {
        // overview.classList.add("hide");
        // analyticsdiv.classList.remove("hide");
        // messagediv.classList.add("hide");
        hideAll();
        showSelected(analyticsdiv);
    })
})


messagebroadcast.forEach((button) => {
    button.addEventListener("click", () => {
        // overview.classList.add("hide");
        // analyticsdiv.classList.add("hide");
        // messagediv.classList.remove("hide");
        hideAll();
        showSelected(messagediv);
    })
})



let date = new Date();
let span = document.querySelectorAll("#clock");
date = date.toString();
date = date.slice(0, 15);
console.log(span);
span[0].innerHTML = date;
// span[1].value= date;


let userInputs = document.querySelectorAll("#user-input");
let fileInput = document.querySelector("#file-input");
let userFormButton = document.querySelector("#user-form-button");

for (let input of userInputs) {
    input.addEventListener("input", (event) => {
        console.log("called me?");
        userFormButton.classList.remove("hide");
    })
}