import { modalCall } from "../js/modal-call.js"

const $ = document

const isLoginF = () => {
    const signBtn = $.querySelector(".sign")
    const logBtn = $.querySelector(".log")
    const userProfleInfo = $.querySelector(".user__profile")
    const goToLoginBtn = $.querySelector(".regular__user")
    let fullUserInfo;

    let cookies = $.cookie
    cookies.includes(";") ? null : cookies += ";"
    cookies = cookies.split(";")

    let findLoginCookie = cookies.filter(cookie => {
        if (cookie.includes("logInT")) {
            return cookie
        }
    })

    if (!findLoginCookie[0] || findLoginCookie[0].length < 10) {
        signBtn.style.display = "block"
        logBtn.style.display = "block"
        goToLoginBtn.setAttribute("style", "display: block;")
        userProfleInfo.style.display = "none"
    } else {
        fetch("http://localhost:4000/v1/auth/me", {
            headers: {
                "Authorization": `Bearer ${findLoginCookie[0].replace("logInT=", "").trim()}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setUserInfo(data)
                fullUserInfo = data
                signBtn.style.display = "none"
                logBtn.style.display = "none"
                goToLoginBtn.setAttribute("style", "display: none !important;")
                userProfleInfo.style.display = "block"
                $.querySelector(".user__theme").style.marginLeft = "0"
            })
    }
}

const setUserInfo = (data) => {
    const nameOfUser = $.querySelector(".nameofuser")
    nameOfUser.innerHTML = data.username
}

const getAllCourses = async () => {
    const res = await fetch("http://localhost:4000/v1/courses")
    const courses = await res.json()
    return courses;
}

const changeToDark = () => {

    $.documentElement.style.setProperty("--primary-bg-color", "#1C1C28")
    $.documentElement.style.setProperty("--p-colors", "#94A3B8")
    $.documentElement.style.setProperty("--pure-white", "#28293D")
    $.documentElement.style.setProperty("--topic-texts-color", "#fff")
    $.documentElement.style.setProperty("--primary-product-color", "#3D3A39")
    $.documentElement.style.setProperty("--course-hoze", "#FACC15")
    $.documentElement.style.setProperty("--scroller-color", "#afafaf52")
    $.documentElement.style.setProperty("--lessons-color", "#0000009e")
    $.documentElement.style.setProperty("--user-comment", "#32334D")
    $.documentElement.style.setProperty("--comment-ans", "#4A4B6D")
    $.documentElement.style.setProperty("--change-theme", "")


    $.querySelector(".change__theme-btn") ? $.querySelector(".change__theme-btn").children[0].innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>` : null
    $.querySelector(".user__theme") ? $.querySelector(".user__theme").children[0].innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>` : null
    $.querySelector(".topic__img img") ? $.querySelector(".topic__img img").src = "img/boy-dark.svg" : null
    $.querySelector("#header") ? $.querySelector("#header").style.cssText = "background-color: inherit; border-bottom: .1rem solid #94a3b83b" : null
    $.querySelector('.topic__text--details') ? $.querySelector('.topic__text--details').style.color = "var(--topic-texts-color)" : null
    $.querySelector(".header__useracount") ? Array.from($.querySelector(".header__useracount").children).splice(-2, 3).forEach(child => {
        child.style.border = ".1rem solid var(--pure-white)"
    }) : null;
    
    localStorage.setItem("userTheme", "dark")
}

const changeToLight = () => {

    $.querySelector(".change__theme-btn").children[0].innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"></path></svg>`
    $.querySelector(".user__theme").children[0].innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"></path></svg>`
    $.querySelector(".topic__img img") ? $.querySelector(".topic__img img").src = "img/boy-light.svg" : null
    
    $.documentElement.style.setProperty("--primary-bg-color", "#F3F4F6")
    $.documentElement.style.setProperty("--p-colors", "#64768B")
    $.documentElement.style.setProperty("--pure-white", "#fff")
    $.documentElement.style.setProperty("--topic-texts-color", "#3F3F46")
    $.documentElement.style.setProperty("--primary-product-color", "#E6F6FD")
    $.documentElement.style.setProperty("--course-hoze", "#0EA5E9")
    $.documentElement.style.setProperty("--scroller-color", "#a3a3a3")
    $.documentElement.style.setProperty("--lessons-color", "#33363c4d")
    $.documentElement.style.setProperty("--user-comment", "#F3F4F6")
    $.documentElement.style.setProperty("--comment-ans", "#E5E7EB")
    $.documentElement.style.setProperty("--change-theme", "#0EA5E9")

    if ($.querySelector("#header")) {
        $.querySelector("#header").style.cssText = "background-color: inherit; border-bottom: .1rem solid #94a3b83b"
    }

    if ($.querySelector('.topic__text--details')) {
        $.querySelector('.topic__text--details').style.color = "var(--topic-texts-color)"
    }

    Array.from($.querySelector(".header__useracount").children).splice(-2, 3).forEach(child => {
        child.style.border = "none"
    })

    localStorage.setItem("userTheme", "light")
}

const checkUserTheme = () => {
    let getTheme = localStorage.getItem("userTheme")
    getTheme == "light" ? changeToLight() : changeToDark()
}

const changeTheme = () => {
    let getTheme = localStorage.getItem("userTheme")
    if (!getTheme) {
        localStorage.setItem("userTheme", "dark");
        changeTheme();
        return;
    }

    getTheme == "light" ? changeToDark() : changeToLight()
}

const getUserTokens = () => {
    let userT = $.cookie
    return userT
}

const getWantedToken = type => {
    let userTokens =  getUserTokens().split(";").filter(token => token.includes(`${type}`))
    return userTokens[0].replace(`${type}=`, "").trim()
}

const getURLValues = tag => {
    let tagValue = new URLSearchParams(window.location.search).get(tag)
    return tagValue
}

const searchTheWord = word => {
    if (!word) {
        modalCall("ابتدا فیلد جستجو را پر کنید")
        return;
    }
    location.href = `category.html?search=${word}`
}

const getAllUserData = () => {
    let token = getWantedToken("logInT")
    return fetch("http://localhost:4000/v1/auth/me", {
        method:"GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

const isUesrRegistered = async key => {

    let response = await fetch(`http://localhost:4000/v1/courses/${getURLValues(key)}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${getWantedToken("logInT")}`
        },
    })

    if (response.ok) {
        let data = await response.json()
        return data
    } else {
        return new Error("course not found")
    }
}

export {
    isLoginF,
    setUserInfo,
    getAllCourses,
    changeToDark,
    changeToLight,
    checkUserTheme,
    changeTheme,
    getUserTokens,
    getURLValues,
    getWantedToken,
    searchTheWord,
    getAllUserData,
    isUesrRegistered,
}