import { getUserTokens, getAllUserData, getWantedToken, getURLValues } from "./utilities.js";
import { modalCall } from "./modal-call.js";

const $ = document
const lessonsWrapper = Array.from($.querySelectorAll(".lesson__topic-wrapper"))
const courseExps = $.querySelector(".course__exps")
const seeMoreBtn = $.querySelector(".see_more-btn")
const seeMoreText = $.querySelector(".see_more-btn p")
const seeMoreSvg = $.querySelector(".see_more-btn svg")
const addCommentBtn = $.querySelector(".course__time--comment")
const showNewCommentTemplate = $.querySelector(".add__new-comment")
const appendNewComment = $.querySelector(".add__comment")
const cancelComment = $.querySelector(".cancel__comment")
const cancelReplay = $.querySelector(".cancel__replay")
const addCommentValue = $.querySelector(".add__comment-area")
const addReplatValue = $.querySelector("#replay__area")
const commentReplayBtn = Array.from($.querySelectorAll(".user__comment-replay"))
const addReplayBtn = $.querySelector("#add_replay")
const formattedDate = `${new Date().getFullYear()}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}/${new Date().getDate().toString().padStart(2, '0')}`
const commentsWrapper = $.querySelector(".course__comments-wrapper")
const copyCourseLink = $.querySelector("#copy__course-link")
let appendRepComment = $.querySelector(".add__new-comment-replay")
let userInfos, topicElem, isExpanded;

const getCourseDetails = () => {

    let getLocationName = (location.href).slice((location.href).indexOf("name=")).slice(5)

    fetch(`http://localhost:4000/v1/courses/${getLocationName}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${getWantedToken("logInT")}`
        },
    })
    .then(res => res.json())
    .then(data => {
        setCourseDetails(data);
        console.log(data);
        getCourseComments(data.comments)
        getCourseSessions(data.sessions)
    })
}

const setCourseDetails = data => {

    $.querySelector("video").poster = `http://localhost:4000/courses/covers/${data.cover}`;
    $.querySelector(".course__content-cost").innerHTML = data.price != 0 ? data.price.toLocaleString() + " تومان" : "رایگان";
    $.querySelector("#course__status").innerHTML = data.status == "start" ? "درحال برگزاری" : "تکمیل شده";
    $.querySelector("#course-name").innerHTML = data.name
    $.querySelector("#course-path-name").innerHTML = data.name
    $.querySelector("#course__description").innerHTML = data.description
    $.querySelector("#course__support").innerHTML = data.support
    $.querySelector("#course__hoze").innerHTML = data.categoryID.title

    if (data.isUserRegisteredToThisCourse) {
        $.querySelector(".course__content-get p").innerHTML = "مشاهده دوره"
        $.querySelector(".course__content-get").style.backgroundColor = "var(--blue)"
    }

    for (let course of $.querySelectorAll("#users__count")) {
        course.innerHTML = data.courseStudentsCount
    }
}

const registerUserToCourse = () => {
    $.querySelector(".course__content-get p").innerHTML = "مشاهده دوره"
    $.querySelector(".course__content-get").style.backgroundColor = "var(--blue)"
    modalCall("ثبت نام انجام شد(:", 1)
}

const showCourseLessons = e => {

    e.target.tagName == "DIV" ? topicElem = e.target : topicElem = e.target.parentElement;
    let lessonsList = Array.from(topicElem.parentElement.children)

    topicElem.parentElement.classList.toggle("lesson__topic-wrapper--active")

    if (topicElem.parentElement.className.includes("lesson__topic-wrapper--active")) {
        for (let i = 0; i < lessonsList.length; i++) {
            if (!i) continue;
            lessonsList[i].style.display = "block"
            Array.from(topicElem.children).some(el => el.tagName == "svg" ? (el.style.transform = "rotate(180deg)") : null)
        }
    } else {
        for (let i = 0; i < lessonsList.length; i++) {
            if (!i) continue;
            lessonsList[i].style.display = "none"
            Array.from($.querySelectorAll(".lesson svg")).forEach(el => el.style.transform = "none")
        }
    }
}

const seeAllExp = () => {
    if (isExpanded) {
        seeMoreText.innerHTML = "مشاهده بیشتر"
        courseExps.style.setProperty("height", "61rem")
        seeMoreSvg.style.transform = "rotate(0deg)"
        isExpanded = false;
    } else {
        seeMoreText.innerHTML = "مشاهده کمتر"
        courseExps.style.setProperty("height", "auto")
        seeMoreSvg.style.transform = "rotate(180deg)"
        isExpanded = true;
    }
}

const addNewComment = (text, date, role, type, parent, id = "") => {

    text = text.replace(/\n/g, "<br>")

    if (!text.trim()) {
        modalCall("ابتدا فیلد را پر کن دا", 0)
        return;
    }

    let getTarget = $.querySelector(".comment__target")

    if (type != "ans") {
        getTarget.insertAdjacentHTML("beforeend", `
                <div class="user__comment-wrapper user__comment-wrapper--ans">
                <div class="user__comment-profile">
                    <img src="img/footer-user-img.png" class="user__commetn-profile-img">
                    <div class="user__comment-role">${role == "USER" ? "کاربر" : "ادمین"}</div>
                </div>
                <div class="user__comment-content">
                    <div class="user__comment-text-topic">
                        <div class="user__comment-name">
                            <p>${userInfos.name}</p>
                            <p>${date}</p>
                        </div>
                    </div>
                    <div class="user__comment-topic-mobile">
                        <div class="user__comment-topic-wrapper">
                            <img src="img/footer-user-img.png" class="user__commetn-profile-img">
                            <div class="user__comment-profile-mobile">
                                <p>${userInfos.name}</p>
                                <div class="user__comment-role-mobile">
                                    <p>${role == "USER" ? "کاربر" : "ادمین"}</p>
                                    <p>${date}</p>
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

        modalCall("نظر شما ثبت شد", 1)

        // let body = {body: text}

        // fetch(`http://localhost:4000/v1/comments/answer/${id.trim()}`, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         Authorization: `Bearer ${getWantedToken("logInT")}`
        //     },
        //     body: JSON.stringify(body)
        // })
        // .then(res => {
        //     if (res.status.ok) {
        //         console.log(res);
        //         modalCall("نظر شما ثبت شد", 1)
        //         addCommentValue.value = ""
        //         addReplatValue.value = ""
        //         showNewCommentTemplate.style.display = "none"
        //         appendRepComment.style.display = "none"
        //         Array.from($.querySelectorAll(".user__comment-content")).map(el => el.classList.remove("comment__target"))
        //         return res.json()
        //     }
        // })


    } else {
        parent.insertAdjacentHTML("beforeEnd", `
        <div class="user__comment-wrapper">
        <div class="user__comment-profile">
            <img src="img/footer-user-img.png"
                class="user__commetn-profile-img"></img>
            <div class="user__comment-role">${role == "USER" ? "کاربر" : "ادمین"}</div>
        </div>
        <div class="user__comment-content">
            <div class="user__comment-text-topic">
                <div class="user__comment-name">
                    <p>${userInfos.name}</p>
                    <p>${date}</p>
                </div>
                <svg class="user__comment-replay" fill="none"
                    viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
            </div>
            <div class="user__comment-topic-mobile">
                <div class="user__comment-topic-wrapper">
                    <img src="img/footer-user-img.png"
                        class="user__commetn-profile-img"></img>
                    <div class="user__comment-profile-mobile">
                        <p>${userInfos.name}</p>
                        <div class="user__comment-role-mobile">
                            <p>${role == "USER" ? "کاربر" : "ادمین"}</p>
                            <p>${date}</p>
                        </div>
                    </div>
                </div>
                <svg class="user__comment-replay" fill="none"
                    viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
            </div>
            <div class="user__comment-text">
                ${text}
            </div>
        </div>
    </div>
`)
        let sendCommentObj = {
            "body": text,
            "courseShortName": getURLValues("name"),
            "score": 5
        }

        fetch("http://localhost:4000/v1/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getWantedToken("logInT")}`
            },
            body: JSON.stringify(sendCommentObj)
        })
        .then(res => {
            if (res.status == 201) {
                modalCall("نظر شما ثبت شد", 1)
                addCommentValue.value = ""
                addReplatValue.value = ""
                showNewCommentTemplate.style.display = "none"
                appendRepComment.style.display = "none"
                Array.from($.querySelectorAll(".user__comment-content")).map(el => el.classList.remove("comment__target"))
                return res.json()
            }
        })
        .then(data => console.log(data))
    }
}

commentReplayBtn.map(el => el.addEventListener("click", async comment => {
    let getElementWrapper, userNameToReplay;

    comment.target.tagName == "svg" ? getElementWrapper = comment.target.parentElement : getElementWrapper = comment.target.parentElement.parentElement;
    userNameToReplay = getElementWrapper.querySelector(".user__comment-profile-mobile p") ? getElementWrapper.querySelector(".user__comment-profile-mobile p").innerHTML : 
    getElementWrapper.querySelector(".user__comment-name p").innerHTML

    showNewCommentTemplate.style.display = "none"
    appendRepComment.style.display = "block"

    $.querySelector("#newCommentUserName-replay").innerHTML = await userInfos.name
    $.querySelector("#rep__to-who").innerHTML = `در پاسخ به ${userNameToReplay}`

    addReplayBtn.addEventListener("click", async () => addNewComment(addReplatValue.value, formattedDate, userInfos.role, "rep", getElementWrapper.parentElement))
}))

addCommentBtn.addEventListener("click", async () => {
    //checks user login
    if (!getWantedToken("logInT")) {
        modalCall("لطفا ابتدا وارد سایت شوید", 0)
        return
    }
    appendRepComment.style.display = "none"
    showNewCommentTemplate.style.display = "block"
    $.querySelector("#newCommentUserName").innerHTML = await userInfos.name
    showNewCommentTemplate
})

commentsWrapper.addEventListener("click", async e => {

    let getRepBtn;
    e.target.classList[0] == "user__comment-replay" ? getRepBtn = e.target :
    e.target.id == "rep-btn" ? getRepBtn = e.target.parentElement : null

    if (getRepBtn) {
        if (!getWantedToken("logInT")) {
            modalCall("لطفا ابتدا وارد سایت شوید", 0)
            appendRepComment.style.display = "none"
            e.preventDefault()
            return;
        }
        
        let target = getRepBtn.parentElement.parentElement
        target.classList.add("comment__target") 
        let returnedCom = getRepBtn.parentElement.parentElement.parentElement
        commentsWrapper.scrollIntoView({ behavior: "smooth" });
        showNewCommentTemplate.style.display = "none"
        appendRepComment.style.display = "block"
    
        $.querySelector("#newCommentUserName-replay").innerHTML = await userInfos.name
        $.querySelector("#rep__to-who").innerHTML = `در پاسخ به ${returnedCom.querySelector(".user__comment-name p").innerHTML}`

        addReplayBtn.addEventListener("click", async () => {
            addNewComment(addReplatValue.value, formattedDate, userInfos.role, "rep", target, returnedCom.id)
        })
    }
})

const getCourseSessions = sessions => {
    let sessionsWrapper = $.querySelector(".lesson")
    if (sessions.length) {
        sessions.forEach((sess, ind) => {
            console.log(sess);  
            sessionsWrapper.insertAdjacentHTML("beforeend", `
                <div class="lesson__detail">
                    ${
                        sess.free ?
                        `
                        <a href=session.html?id=${sess._id}&title=${getURLValues("name")} class="lesson__detail-wrapper" id="${sess._id}">
                            <div class="lesson__detail-number">${ind + 1}</div>
                            <div class="lesson__detail-text">${sess.title}</div>
                        </a>
                        `
                        :
                        `
                        <div class="lesson__detail-wrapper">
                            <div class="lesson__detail-number">${ind + 1}</div>
                            <div class="lesson__detail-text">${sess.title}</div>
                        </div>
                        `
                    }
                    <div class="lesson__detail-status">
                        <div class="lesson__detail-cost">${sess.free ? "جلسه رایگان" : "جلسه پولی"}</div>
                        <div class="lesson__detail-duration">
                            <p id="lesson__status">${sess.time}</p>
                            ${
                                sess.free ?  
                                    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"></path>
                                    </svg>`
                                :
                                `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" data-slot="icon" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                              `
                            }

                        </div>
                    </div>
                </div>
            `)
        })
    } else {
        sessionsWrapper.innerHTML = ""
        sessionsWrapper.insertAdjacentHTML("beforeend", `
            <h3 style="color: var(--p-colors); padding: 2rem; font-size: 2.5rem;width: 100%;display: flex;align-items: center;justify-content: center;">تا کنون جلسه ای بازگزاری نشده!</h3>
        `)
    }

}














































const getCourseComments = comments => {
    let commentsArray = [...comments]

    if (!comments.length) {
        commentsWrapper.insertAdjacentHTML("beforeend", `
            <h3 style="color: var(--p-colors);font-size: 2.5rem;width: 100%;display: flex;align-items: center;justify-content: center;">تا کنون کامنتی ثبت نشده!</h3>
        `)
        return;
    }

    comments.map(comment => {
        if (!comment.answerContent) {
            commentsWrapper.insertAdjacentHTML("beforeend", `
            <div class="user__comment-wrapper" id="${comment._id}">
            <div class="user__comment-profile">
                <img src="img/footer-user-img.png"
                    class="user__commetn-profile-img"></img>
                <div class="user__comment-role">${comment.creator.role == "ADMIN" ? "ادمین" : "کاربر"}</div>
            </div>
            <div class="user__comment-content">
                <div class="user__comment-text-topic">
                    <div class="user__comment-name">
                        <p>${comment.creator.username}</p>
                        <p>${(comment.createdAt).slice(0, 10)}</p>
                    </div>
                    <svg class="user__comment-replay" fill="none"
                        viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor">
                        <path id="rep-btn" stroke-linecap="round" stroke-linejoin="round"
                            d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                </div>
                <div class="user__comment-topic-mobile">
                    <div class="user__comment-topic-wrapper">
                        <img src="img/footer-user-img.png"
                            class="user__commetn-profile-img"></img>
                        <div class="user__comment-profile-mobile">
                            <p>${comment.creator.username}</p>
                            <div class="user__comment-role-mobile">
                                <p>${comment.creator.role == "ADMIN" ? "ادمین" : "کاربر"}</p>
                                <p>${(comment.createdAt).slice(0, 10)}</p>
                            </div>
                        </div>
                    </div>
                    <svg class="user__comment-replay" fill="none"
                        viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor">
                        <path id="rep-btn" stroke-linecap="round" stroke-linejoin="round"
                            d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                </div>
                <div class="user__comment-text">
                    ${comment.body}
                </div>
            </div>
        `)
    } else {
        commentsWrapper.insertAdjacentHTML("beforeend", `
            <div class="user__comment-wrapper" id="${comment._id}">
            <div class="user__comment-profile">
                <img src="img/footer-user-img.png"
                    class="user__commetn-profile-img"></img>
                <div class="user__comment-role">${comment.creator.role == "ADMIN" ? "ادمین" : "کاربر"}</div>
            </div>
            <div class="user__comment-content">
                <div class="user__comment-text-topic">
                    <div class="user__comment-name">
                        <p>${comment.creator.username}</p>
                        <p>${(comment.createdAt).slice(0, 10)}</p>
                    </div>
                    <svg class="user__comment-replay" fill="none"
                        viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor">
                        <path id="rep-btn" stroke-linecap="round" stroke-linejoin="round"
                            d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                </div>
                <div class="user__comment-topic-mobile">
                    <div class="user__comment-topic-wrapper">
                        <img src="img/footer-user-img.png"
                            class="user__commetn-profile-img"></img>
                        <div class="user__comment-profile-mobile">
                            <p>${comment.creator.username}</p>
                            <div class="user__comment-role-mobile">
                                <p>${comment.creator.role == "ADMIN" ? "ادمین" : "کاربر"}</p>
                                <p>${(comment.createdAt).slice(0, 10)}</p>
                            </div>
                        </div>
                    </div>
                    <svg class="user__comment-replay" fill="none"
                        viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor">
                        <path id="rep-btn" stroke-linecap="round" stroke-linejoin="round"
                            d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                </div>
                <div class="user__comment-text">
                    ${comment.body}
                </div>


                <div class="col-12">
                    <div class="user__comment-wrapper user__comment-wrapper--ans">
                        <div class="user__comment-profile">
                            <img src="img/footer-user-img.png"
                                class="user__commetn-profile-img"></img>
                            <div class="user__comment-role">${comment.answerContent.creator.role == "ADMIN" ? "ادمین" : "کاربر"}</div>
                        </div>
                        <div class="user__comment-content">
                            <div class="user__comment-text-topic">
                                <div class="user__comment-name">
                                    <p>${comment.answerContent.creator.name}</p>
                                    <p>${(comment.answerContent.createdAt).slice(0, 10)}</p>
                                </div>
                            </div>
                            <div class="user__comment-topic-mobile">
                                <div class="user__comment-topic-wrapper">
                                    <img src="img/footer-user-img.png"
                                        class="user__commetn-profile-img"></img>
                                    <div class="user__comment-profile-mobile">
                                        <p>${comment.answerContent.creator.name}</p>
                                        <div class="user__comment-role-mobile">
                                            <p>$${comment.answerContent.creator.role == "ADMIN" ? "ادمین" : "کاربر"}</p>
                                            <p>${(comment.answerContent.createdAt).slice(0, 10)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="user__comment-text">
                                ${comment.answerContent.body}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `)
    }
})
}

copyCourseLink.addEventListener("click", () => {
    let linkTextToCopy = copyCourseLink.parentElement.querySelector(".course__link-address").innerHTML;
    navigator.clipboard.writeText(linkTextToCopy)
    modalCall("لینک کپی شد!", 1)
})

addCommentValue.addEventListener("keydown", e => e.key == "Enter" ? (addCommentValue.value += "\n", e.preventDefault()) : null)
appendNewComment.addEventListener("click", () => addNewComment(addCommentValue.value, formattedDate, userInfos.role, "ans", commentsWrapper))
cancelComment.addEventListener("click", () => showNewCommentTemplate.style.display = "none")
cancelReplay.addEventListener("click", () => appendRepComment.style.display = "none")
seeMoreBtn.addEventListener("click", () => seeAllExp())
lessonsWrapper.forEach(topic => topic.addEventListener("click", e => showCourseLessons(e)))
$.querySelector(".course__content-get").addEventListener("click", () => registerUserToCourse())

window.addEventListener("load", () => {
    getCourseDetails()
    getAllUserData().then(res => res.json()).then(data => userInfos = data)
})