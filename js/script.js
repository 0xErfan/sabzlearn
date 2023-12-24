import { getAllCourses, getWantedToken } from "./utilities.js";
import { LatestCourses } from "../components/latest-course/latest-course.js"
import { NewCourses } from "../components/new-courses/new-courses.js"
import { modalCall } from "./modal-call.js";
let allArticles = Array.from(document.querySelectorAll(".documents__box-link"))
const $ = document


const gotoCourse = path => {
    if (!getWantedToken("logInT").length) {
        modalCall("برای دسترسی به اطلاعات دوره ابتدا وارد حساب خود شوید!", 0)
        return;
    }
    location.href = `course.html?name=${path}`
}

const renderMainCourses = () => {
    const latestCoursesWrapper = $.querySelector('.latest__courses--wrapper')
    getAllCourses()
        .then(courses => {
            courses.slice(1, 9).forEach(course => {
                let courseId = course.categoryID.includes("فرانت") ? "فرانت اند" : course.categoryID.includes("بک‌اند") ? "بک اند" : "پایتون"
                latestCoursesWrapper.insertAdjacentHTML("beforeend", `
                <latest-course img-src="http://localhost:4000/courses/covers/${course.cover}">
                    <div slot="basin">${courseId}</div>
                    <div onclick="gotoCourse('${course.shortName}')" slot="title">${course.name}</div>
                    <div class="latest__course-details" slot="details">مینی پروژه‌های کاربری با PHP یه دوره آموزشی گام به گام هست که برای توسعه‌دهندگان وب، به ویژه...</div>
                    <div slot="t-name">${course.creator}</div>
                    <div slot="duration">۲۲:۱۰</div>
                    <div slot="users">${course.registers}</div>
                    <div slot="rate">${course.courseAverageScore}.0</div>
                    <div slot="cost">${course.price == 0 ? "رایگان" : `${course.price.toLocaleString()} تومان`}</div>
                </latest-course>
            `)
            })
        })
}

const getRoadmapsCount = () => {
    let frontendRoadsCount = 0
    let securityRoadsCount = 0
    let pythonRoadsCount = 0
    let softSkillsRoadsCount = 0

    getAllCourses()
        .then(res => {
            res.forEach(course => {
                if (course.categoryID.includes("فرانت")) {
                    frontendRoadsCount += 1
                } else if (course.categoryID.includes("امنیت")) {
                    securityRoadsCount += 1
                } else if (course.categoryID.includes("پایتون")) {
                    pythonRoadsCount += 1
                } else {
                    softSkillsRoadsCount += 1
                }
            })
            $.querySelector(".frontend__roads--course--count").innerHTML = frontendRoadsCount
            $.querySelector(".security__roads--course--count").innerHTML = securityRoadsCount
            $.querySelector(".python__roads--course--count").innerHTML = pythonRoadsCount
            $.querySelector(".softskills__roads--course--count").innerHTML = softSkillsRoadsCount
        })

}

const getSwiperCourses = () => {

    let latestCoursesWrapper = $.querySelector(".mySwiper")
    getAllCourses()
        .then(courses => {
            courses.slice(1, 9).forEach(course => {
                let courseId = course.categoryID.includes("فرانت") ? "فرانت اند" : course.categoryID.includes("بک‌اند") ? "بک اند" : "پایتون"
                latestCoursesWrapper.insertAdjacentHTML("beforeend", `
                <swiper-slide>
                    <new-course img-src="http://localhost:4000/courses/covers/${course.cover}" class="col-12 col-md-6 col-xl-4">
                        <div slot="basin">${courseId}</div>
                        <div onclick="gotoCourse('${course.shortName}')" slot="title">${course.name}</div>
                        <div class="latest__course-details" slot="details">مینی پروژه‌های کاربری با PHP یه دوره آموزشی گام به گام هست که برای توسعه‌دهندگان وب، به ویژه...</div>
                        <div slot="t-name">${course.creator}</div>
                        <div slot="duration">۲۲:۱۰</div>
                        <div slot="users">${course.registers}</div>
                        <div slot="rate">${course.courseAverageScore}.0</div>
                        <div slot="cost">${course.price == 0 ? "رایگان" : course.price.toLocaleString() + " تومان"}</div>
                    </new-course>
                </swiper-slide>
        `)
            })
        })
}

window.addEventListener("load", () => {
    renderMainCourses()
    getRoadmapsCount()
    getSwiperCourses()
})

allArticles.forEach(el => el.addEventListener("click", () => modalCall("مقاله خوانده شد😙", 1)))
Array.from(document.querySelectorAll(".all__courses")).map(el => el.innerHTML.includes("دوره ها") ? el.addEventListener("click", () => el.href = "/category.html?all=allCourses") : null)
window.gotoCourse = gotoCourse
window.customElements.define("latest-course", LatestCourses)
window.customElements.define("new-course", NewCourses)

// while (true) {
//     let arr = []
//     let count = 0
//     let userRow = +prompt("Witch row you bet on? (1, 3)") - 1

//     if (userRow + 1 > 3) {
//         alert("I Said Between 1,3 idiot! ")
//         continue;
//     }

//     for (let i = 0; i < 3; i++) {
//         arr[i] = [Math.floor(Math.random() * 4)]
//         for (let j = 0; j < 3; j++) {
//             arr[i][j] = Math.floor(Math.random() * 4);
//         }
//     }

//     arr[userRow].reduce((f, s) => {
//         f == s ? count += 1 : null
//         return s;
//     })

//     console.log(arr[userRow])

//     count == arr[userRow].length - 1 ? console.log("You Won!!!") :
//         console.log("You Losed")
//     let ask = confirm("Wanna Try Again? (y/n)")
    
//     if (!ask) break;

//     arr = []
//     count = 0
// }