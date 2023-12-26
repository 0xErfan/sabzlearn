import { modalCall } from "./modal-call.js"
import { isLoginF, checkUserTheme, changeTheme, searchTheWord, getAllCourses } from "./utilities.js"

const $ = document
const navigationBtn = $.querySelector(".navigation")
const mobileMenu = $.querySelector(".menu")
const closeMenuBtn = $.querySelector(".close__menu")
const userProfile = $.querySelector(".user__profile")
const userInfo = $.querySelector('.show__data')
const exitFromAccount = $.querySelector(".exit__account")
const secondSearchBox = $.querySelector(".header__searhboxmenu--lg")

let headerCoursesList = $.querySelector(".header__courses--list")
let menuCourseWrapper = $.querySelector(".menu__course--wrapper")
let userTheme = $.querySelector(".user__theme")
let changeThemeBtn = $.querySelector(".change__theme-btn svg")
let searchBtnLgValue = $.querySelector("#searchBtnLgValue")
let searchBtnXlValue = $.querySelector("#searchBtnXlValue")
let pcMenuSearch = $.querySelector("#header__searhbox--inputmenu")


const clickAnimation = data => {
    data.style.paddingRight = "1.5rem"
    data.style.setProperty("--display", "block")

    setTimeout(() => {
        location.href = data.getAttribute("href")
    }, 500)
}

const getCourses = () => {
    // get all course names to check if course is available(backend problems)
    getAllCourses().then(allcourses => {

        let allCoursesArray = []
        allcourses.forEach(courses => allCoursesArray.push(courses.shortName))

        fetch("http://localhost:4000/v1/menus")
        .then(res => res.json())
        .then(data => {
            for(let i = 0; i < data.length; i++) {
    
                let courseTemplate = $.createElement("div")
    
                if (data[i].submenus.length == 0) {
                    courseTemplate.className = "frontend frontend__edit"
                    courseTemplate.innerHTML = `
                        <a onclick="notAvailable()">${data[i].title}</a>
                        <div class="courses__frontend"></div>
                    `
                } else {
                    courseTemplate.className = "frontend"
                    courseTemplate.innerHTML = `
                    <div class="course__titles-wrapper">
                        <svg class="course__items-svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                        <h4>${data[i].title}</h4>
                    </div>
                    <div class="courses__frontend">
                        <ul id="course__items${i}">
        
                        </ul>
                    </div>
                    `
                }
    
                headerCoursesList.appendChild(courseTemplate)
    
                for(let j = 0; j < data[i].submenus.length; j++) {
    
                    let courseListTemplate = $.createElement("li")
                    courseListTemplate.className = "front__courses"
                    
                    if (allCoursesArray.includes((data[i].submenus[j].href).replace("/course-info/", ""))) {
                        let coursePath = (data[i].submenus[j].href).replace("/course-info/", "course.html?name=")
                        courseListTemplate.innerHTML = `<a href="${coursePath}">${data[i].submenus[j].title}</a>`
                    } else {
                        courseListTemplate.innerHTML = `<a onclick="notAvailable()">${data[i].submenus[j].title}</a>`
                    }

                    $.querySelector(`#course__items${i}`).append(courseListTemplate)
                }
            }
    
            for(let i = 0; i < data.length; i++) {
    
                let courseTemplate = $.createElement("li")
    
                if (data[i].submenus.length == 0) {
                    let coursePath = (data[i].href).replace("/category-info/", "course.html?name=")
                    courseTemplate.innerHTML = `
                    <a class="course__items" href="${coursePath}">${data[i].title}</a>
                `
                } else {
                    courseTemplate.innerHTML = `
                    <span class="course__items">${data[i].title}
                        <svg class="course__items-svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </span>
                    <div class="course__items--wrapper" id="course__items--wrapper${i}"></div>
                `
                }
    
                menuCourseWrapper.appendChild(courseTemplate)
    
                for(let j = 0; j < data[i].submenus.length; j++) {
    
                    let courseListTemplate = $.createElement("div")
                    let courseAddress = (data[i].submenus[j].href).replace("course-info/", "course.html?name=")
                    
                    courseListTemplate.innerHTML = `<div class="courses__link" href="${courseAddress}">${data[i].submenus[j].title}</div>`
                    $.querySelector(`#course__items--wrapper${i}`).append(courseListTemplate)
                }
            }
    
            let courseItemsWrapper = $.querySelectorAll(".course__items")
            let coursesLink = $.querySelectorAll(".courses__link")
    
            for(let course of courseItemsWrapper) {
                course.addEventListener("click", course => {
                    course.target.children[0].classList.toggle("course__items-svg--active")
                    course.target.nextSibling.nextSibling.classList.toggle("show")
                })
            }
    
            for(let course of coursesLink) {
                course.addEventListener("click", () => {
                    clickAnimation(course)
                })
            }
        })

    })

}

$.querySelector("#searchBtn").addEventListener("click", () => {
    if (secondSearchBox?.style.display == "flex") {
        secondSearchBox.style.display = ""
    } else {
        secondSearchBox.style.display = "flex"
    }
})

const notAvailable = () => modalCall("این دره درحال حاضر در دسترس نیست(از فرانت انتخاب کنید html css bs vue js ...)!", 0)

$.querySelector("#searchBtnLg").addEventListener("click", () => searchTheWord(searchBtnLgValue.value.trim()))
$.querySelector("#searchBtnXl").addEventListener("click", () => searchTheWord(searchBtnXlValue.value.trim()))
$.querySelector("#searchBtnXll").addEventListener("click", () => searchTheWord(pcMenuSearch.value.trim()))
$.querySelector("#searchBtnLgValue").addEventListener("keydown", e => e.key == "Enter" ? searchTheWord(searchBtnLgValue.value.trim()) : null)
$.querySelector("#searchBtnXlValue").addEventListener("keydown", e => e.key == "Enter" ? searchTheWord(searchBtnXlValue.value.trim()) : null)

pcMenuSearch.addEventListener("keydown", e => e.key == "Enter" ? searchTheWord(pcMenuSearch.value.trim()) : null)

userTheme.addEventListener("click", () => changeTheme())

changeThemeBtn.addEventListener("click", () => changeTheme())

navigationBtn.addEventListener("click", () => mobileMenu.style.cssText = `opacity: 1; right: 0; filter: none`)

closeMenuBtn.addEventListener("click", () => mobileMenu.style.cssText = "right: -30rem; opacity: 0;")

userProfile.addEventListener("click", () => userInfo.classList.toggle("show__data--show"))

exitFromAccount.addEventListener("click", () => { $.cookie = `logInT= ; epires=${new Date().setFullYear(-2)}; path=/`, location.reload()})

window.addEventListener("click", e => {
    e.clientX > window.innerWidth - 280 ? null : mobileMenu.style.cssText = "right: -30rem; opacity: 0;"

    if (e.target.className == "user__profile" || e.target.className == "info__toggler") return

    userInfo.innerHTML.includes(e.target.outerHTML) ? null : userInfo.classList.remove("show__data--show")
})

window.notAvailable = notAvailable

window.addEventListener("load", () => {
    isLoginF()
    getCourses()
    checkUserTheme()
})