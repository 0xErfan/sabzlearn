import { modalCall } from "./modal-call.js";
import { getURLValues, getWantedToken, getAllUserData, isUesrRegistered } from "./utilities.js";
const $ = document;
let quesValue = $.querySelector(".add__comment-area")
let userData;

const getSessionDetails = async () => {
    if (!getURLValues("id") || !getURLValues("title")) {
        location.href = "index.html"
        return;
    }

    try {
        let response = await fetch(`http://localhost:4000/v1/courses/${getURLValues("title")}/${getURLValues("id")}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getWantedToken("logInT")}`
            }
        })

        if (!response.ok) {
            throw new Error("course not found")
        } else {
            let data = await response.json()
            setSessionDetails(data.session, data.sessions)
            appendOtherSessions(data.sessions)
        }
    } catch(err) {
        modalCall(err)
    }
}

const setSessionDetails = async (session, sessions) => {
    fetch(`http://localhost:4000/v1/courses/${getURLValues("title")}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${getWantedToken("logInT")}`
        }
    })
    .then(res => {
        if (res.ok) return res.json()
    })
    .then(data => {

        let hour = 0, min = 0, sec = 0;

        sessions.map(time => {
            min += +time.time.slice(0, 2)
            sec += +time.time.slice(3)
        })

        while(min >= 60) {
            min -= 60
            hour += 1
        }

        while(sec >= 60) {
            sec -= 60
            min += 1
        }

        hour = hour < 10 ? `0${hour}` : hour
        min = min < 10 ? `0${min}` : min

        let getLength = sessions.findIndex(mems => mems._id == session._id)
        $.head.querySelector("title").innerHTML = data.name
        getAllUserData().then(res => res.json()).then(data => {$.querySelector("#newCommentUserName").innerHTML = data.username, userData = data})
        $.querySelector("#course-path-name").innerHTML = data.name
        $.querySelector(".idn--comment").innerHTML = data.name
        $.querySelector("#session__title").innerHTML = session.title
        $.querySelector("#session__number").innerHTML = getLength + 1
        $.querySelector(".course__content-video").src = `http://localhost:4000/courses/covers/b36e8afba55d2275896e1fbda77ec47f7981e20c230f3470f8678b2fc6160515.mp4`
        $.querySelector("#session__download-link").href = "http://localhost:4000/courses/covers/b36e8afba55d2275896e1fbda77ec47f7981e20c230f3470f8678b2fc6160515.mp4"
        $.querySelector("#session__download-link").download = data.name
        Array.from($.querySelectorAll("#course__s")).forEach(el => el.innerHTML = sessions.length)
        Array.from($.querySelectorAll("#users__count")).forEach(el => el.innerHTML = `${hour}:${min}`)
    })
}

const appendOtherSessions = sessions => {

    const sessionsContainer = $.querySelector(".sessions__container")
    let userCondition;
    isUesrRegistered("title")
    .then(data => {
        userCondition = data.isUserRegisteredToThisCourse
        sessionsContainer.insertAdjacentHTML("beforeend", `
        <div class="lesson session__lessons">
            <div class="lesson__topic-wrapper">
                <p class="lesson__topic">فصل اول</p>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-6 h-6" style="transform: none;">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75"></path>
                </svg>
            </div>

            <ul class="sessions__wrapper sessions__wrapper--show">

            </ul>
        </div>
    `)
    sessions.map(sess => {
        $.querySelector(".sessions__wrapper").insertAdjacentHTML("beforeend", `
            <li class="lesson__detail" style="display: flex;">

                ${
                    sess.free || userCondition ? `
                        <a href="session.html?id=${sess._id}&title=${getURLValues("title")}" class="lesson__detail-wrapper" id="${sess._id}">
                            <div class="lesson__detail-number"></div>
                            <div class="lesson__detail-text">${sess.title}</div>
                        </a>
                    `
                    :
                    `
                        <div onclick="showModal()" class="lesson__detail-wrapper" id="${sess._id}">
                            <div class="lesson__detail-number"></div>
                            <div class="lesson__detail-text">${sess.title}</div>
                        </div>
                    `
                }

                <div class="lesson__detail-status">
                    <div class="lesson__detail-duration">
                        <div id="lesson__status">${sess.time}</div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            stroke-width="1.5" stroke="currentColor" class="w-6 h-6"
                            style="transform: none;">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z">
                            </path>
                        </svg>

                    </div>
                </div>
            </li>
        `)
    })


    let lessonNumbers = Array.from($.querySelectorAll(".lesson__detail-number"))
    lessonNumbers.some(el => {
        if (el.parentElement.id == getURLValues("id")) {
            el.classList.add("lesson__detail-number--active")
            return true;
        }
    })

    let sessionLeaders = Array.from($.querySelectorAll(".lesson__topic-wrapper"))
    sessionLeaders.forEach(ul => {
        ul.addEventListener("click", () => {
            ul.nextElementSibling.classList.toggle("sessions__wrapper--show")
            if (ul.nextElementSibling.className.includes("sessions__wrapper--show")) {
                ul.querySelector("svg").style.transform = "rotate(180deg)"
            } else {
                ul.querySelector("svg").style.transform = "rotate(0deg)"
            }
        })
    })
    })
}

const addNewComment = (text) => {
    let formattedDate = `${new Date().getFullYear()}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}/${new Date().getDate().toString().padStart(2, '0')}`
    text = text.replace(/\n/g, "<br>")

    if (!text.trim()) {
        modalCall("ابتدا فیلد را پر کن دا", 0)
        return;
    }

    let getTarget = $.querySelector(".course__comments-wrapper")

    getTarget.insertAdjacentHTML("beforeend", `
    <div class="user__comment-wrapper user__comment-wrapper--ans">
    <div class="user__comment-profile">
        <img src="img/footer-user-img.png" class="user__commetn-profile-img">
        <div class="user__comment-role">${userData.role == "USER" ? "کاربر" : "ادمین"}</div>
    </div>
    <div class="user__comment-content">
        <div class="user__comment-text-topic">
            <div class="user__comment-name">
                <p>${userData.name}</p>
                <p>${formattedDate}</p>
            </div>
        </div>
        <div class="user__comment-topic-mobile">
            <div class="user__comment-topic-wrapper">
                <img src="img/footer-user-img.png" class="user__commetn-profile-img">
                <div class="user__comment-profile-mobile">
                    <p>${userData.name}</p>
                    <div class="user__comment-role-mobile">
                        <p>${userData.role == "USER" ? "کاربر" : "ادمین"}</p>
                        <p>${formattedDate}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="user__comment-text">
            ${text}
        </div>
    </div>
</div>
`)
quesValue.value = ""
modalCall("پرسش شما ثبت شد!", 1)
}

$.querySelector(".add__comment").addEventListener("click", () => addNewComment(quesValue.value))
const showModal = () => modalCall('این قسمت دوره پولی است ابتدا دوره را خریداری کنید(؛', 0)
window.showModal = showModal

window.addEventListener("load", () => {
    getSessionDetails()
})