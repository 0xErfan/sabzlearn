import { checkUserTheme } from "./utilities.js"
import { modalCall } from "./modal-call.js";

const $ = document;

const signInAccessToken = (token) => {
    let userToken = Object.entries(token)[1][1];
    let currentTime = new Date();
    currentTime.setTime(currentTime.getTime() + 7 * 24 * 60 * 60 * 1000);
    $.cookie = `SignT=${userToken}; expires=${currentTime}; path=/`
}

const successSingIn = (token) => {
    modalCall("ثبت نام موفقیت امیز بود", 1)
    signInAccessToken(token);
    let allInputs = $.querySelectorAll(".signin__body div input");
    for (let input of allInputs) { input.value = "" };
    setTimeout(() => {
        location.href = "http://127.0.0.1:5500/log_in.html"
    }, 4000)
}

const unsucessSignIn = () => {
    modalCall("نام کاربری یا ایمیل قبلا استفاده شده است")
}

const checkInputs = e => {
    e.preventDefault()

    let userName = $.querySelector(".username").value;
    let uesrPhone = $.querySelector(".userphone").value;
    let userEmail = $.querySelector(".useremail").value;
    let userPass = $.querySelector(".userpass").value;

    if (userName.trim().length == 0 || uesrPhone.trim().length == 0 || userEmail.trim().length == 0 || userPass.trim().length == 0) {
        modalCall("لطفا اطلاعات خواسته شده را وارد کنید(:")
    } else {
        let newUser = {
            name: userName,
            username: userName,
            email: userEmail,
            phone: uesrPhone,
            password: userPass,
            confirmPassword: userPass,
        };

        fetch("http://localhost:4000/v1/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        })
        .then(res => {
            res.status == 201 ? null : res.status == 409 ? unsucessSignIn() : modalCall("خطایی رخ داده است مجدد تلاش کنید!")
            return res.json()
        })
        .then(data => {
            Object.entries(data)[0][0] == "message" ? null : successSingIn(data)
        })
        .catch(() => {
            modalCall("از اتصال به ایرنترنت مطمان شویدد!")
        })
    }
}

$.querySelector(".submit__input").addEventListener("click", event => checkInputs(event));
window.addEventListener("load", checkUserTheme())