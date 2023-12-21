import { modalCall } from "./modal-call.js";
import { checkUserTheme } from "./utilities.js";

const $ = document;

const logInAccessToken = (token) => {
    let now = new Date();
    now.setTime(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    $.cookie = `logInT=${token}; expires=${now}; path=/`
}

const accepted = (token) => {
    modalCall(" ورود موفقیت امیز بود", 1)
    logInAccessToken(token[1]);
    let allInputs = $.querySelectorAll(".signin__body div input");
    for(let input of allInputs) {input.value = ""};
    setTimeout(() => {
        location.href = "http://127.0.0.1:5500/index.html"
    }, 4000)
}

const loginInputsValue = (event) => {
    event.preventDefault();

    let userName = $.querySelector(".username").value.trim();
    let userPass = $.querySelector(".userpass").value.trim();

    if(!userName || !userPass) {
        modalCall("لطفا اطلاعات خواسته شده را وارد کنید(:");
    } else {
        let userData = {
            identifier: userName,
            password: userPass,
        }

        fetch("http://localhost:4000/v1/auth/login", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(userData)
        })
        .then(res => {
            switch(res.status) {
                case 401: modalCall("نام کاربری یا رمز عبور صحیح نیست"); return 0;
                case !201: modalCall("لطفا دوباره تلاش کنید!"); return 0;
            }
            return res.json()
        })
        .then(data => {
            if (!data) return
            let getResponse = Object.entries(data)[0]
            accepted(getResponse)
        })
        .catch ((err) => modalCall(err))  
    }
}

$.querySelector(".submit__input").addEventListener("click", () => loginInputsValue(event))
window.addEventListener("load", checkUserTheme())