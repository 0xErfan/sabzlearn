import { getURLValues } from "./utilities.js";
import { getWantedToken } from "./utilities.js";
import { getAllCourses } from "./utilities.js";

const $ = document;
const allSorts = Array.from($.querySelectorAll(".category__sorter-items li"))
const allFilters = Array.from($.querySelectorAll(".filter__toggler"))
const categorySorterMobile = $.querySelector(".category__sorter-mobile")
const latestCoursesWrapper = $.querySelector('#cat__courses-wrapper')
let savedListofCourses, savedListofCoursesCopy;

const filterCurses = filter => {
    switch (filter) {
        case "فقد دوره های رایگان":
            savedListofCoursesCopy = savedListofCoursesCopy.filter(course => course.price == 0)
            creatCourseTemplte(savedListofCoursesCopy)
            break;
    
        case "درحال پیش فروش":
            latestCoursesWrapper.innerHTML = ""
            latestCoursesWrapper.insertAdjacentHTML("afterbegin", "<h3 style='color: var(--p-colors);font-size: 2.5rem;width: 100%;display: flex;align-items: center;justify-content: center;'>دوره مورد نظر یافت نشد</h3>")
            break;
    
        case "دوره های خریداری شده":
            latestCoursesWrapper.innerHTML = ""
            latestCoursesWrapper.insertAdjacentHTML("afterbegin", "<h3 style='color: var(--p-colors);font-size: 2.5rem;width: 100%;display: flex;align-items: center;justify-content: center;'>دوره مورد نظر یافت نشد</h3>")
            break;
    }
}

const sortCourses = sort => {
    switch (sort) {
        case "پرمخاطب ها":
            savedListofCoursesCopy.sort((a, b) => b.registers - a.registers)
            creatCourseTemplte(savedListofCoursesCopy)
            break;

        case "گران ترین":
            savedListofCoursesCopy.sort((a, b) => b.price - a.price) 
            creatCourseTemplte(savedListofCoursesCopy)
            break;

        case "ارزان ترین":
            savedListofCoursesCopy.sort((a, b) => a.price - b.price)
            creatCourseTemplte(savedListofCoursesCopy)
            break;

        case "همه دور ها":
            allFilters.forEach(classes => {
                classes.classList.remove("filter__toggler--active")
                classes.lastChild.previousElementSibling.style.right = ".6rem"
            })
            creatCourseTemplte(savedListofCourses)
            break;
    }
}

allFilters.forEach(target => target.addEventListener("click", () => {

    if (target.className.includes("active")) {
        target.classList.remove("filter__toggler--active")
        target.lastChild.previousElementSibling.style.right = ".6rem"
        creatCourseTemplte(savedListofCourses)
        for (let i = 0; i < allSorts.length; i++) {
            if (i > 0) {
                allSorts[i].classList.remove("sort__items--active");
                continue;
            };
            allSorts[i].classList.add("sort__items--active")
        }
        savedListofCoursesCopy = savedListofCourses
        return;
    }

    allFilters.forEach(classes => {
        classes.classList.remove("filter__toggler--active")
        classes.lastChild.previousElementSibling.style.right = ".6rem"
    })

    target.classList.toggle("filter__toggler--active")
    target.lastChild.previousElementSibling.style.right = "3.3rem"

    filterCurses(target.parentElement.firstElementChild.innerHTML)
}))

allSorts.forEach(item => item.addEventListener("click", () => {

    if (item.className.includes("sort__items--active")) return

    allSorts.map(classes => classes.classList.remove("sort__items--active"));
    item.classList.add("sort__items--active")

    sortCourses(item.innerHTML)
}))

const getCategoryCourses = async () => {
    let categoryName;

    if (getURLValues("name")) {

        // categoryName = getURLValues("name")
        // const token = getWantedToken("SignT")
        // const l = await fetch(`http://localhost:4000/v1/courses/category/frontend`)
        // let dd = await l.json()

    } else if (getURLValues("search")) {

        categoryName = getURLValues("search")
        $.querySelector(".category__topic").innerHTML = `جستجو برای ${categoryName}`;
        getAllCourses()
            .then(res => {
                let filtered = res.filter(course => course.name.toLowerCase().includes(categoryName.toLowerCase()) || course.categoryID.toLowerCase().includes(categoryName.toLowerCase()))
                savedListofCourses = filtered;
                savedListofCoursesCopy = [...savedListofCourses]
                appendCourses(savedListofCourses)
            });

    } else if (getURLValues("all")) {
        $.querySelector(".category__topic").innerHTML = `تمام دوره ها(:`;
        getAllCourses()
        .then(res => {
            savedListofCourses = res;
            savedListofCoursesCopy = [...savedListofCourses]
            creatCourseTemplte(savedListofCourses)
        })
    }
}

const appendCourses = courses => {

    if (!courses.length) {
        
        latestCoursesWrapper.innerHTML = ""
        latestCoursesWrapper.insertAdjacentHTML("afterbegin", "<h3 style='color: var(--p-colors);font-size: 2.5rem;width: 100%;display: flex;align-items: center;justify-content: center;'>دوره ای یافت نشد</h3>")
    } else {
        creatCourseTemplte(courses)
    }
}

const creatCourseTemplte = details => {
    const latestCoursesWrapper = $.querySelector('#cat__courses-wrapper')
    latestCoursesWrapper.innerHTML = ""

    details.forEach(course => {
        let courseId = course.categoryID.includes("فرانت") ? "فرانت اند" : course.categoryID.includes("بک‌اند") ? "بک اند" : "پایتون"
        latestCoursesWrapper.insertAdjacentHTML("beforeend", `
            <link rel="stylesheet" href ="../components/latest-course/latest-course.css"/>
            <div class="col-12 col-sm-6 col-lg-4">
            <div class="latest__course">
            <a href="course.html?name=${course.shortName}" class="latest__course--img"><img src="http://localhost:4000/courses/covers/${course.cover}"></a>
            <div class="latest__course--body">
                <div class="latest___course--basin">${courseId}</div>
                <div class="shit">
                    <h4 class="latest__course--title">${course.name}</h4>
                    <div class="latest__course--details">مینی پروژه‌های کاربری با PHP یه دوره آموزشی گام به گام هست که برای توسعه‌دهندگان وب، به ویژه...</div>
                </div>
                <div class="latest__course--info">
                    <div class="latest__course--teacher">
                        <div class="latest__course--teacher--name"><svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>${course.creator}</div>
                        <div class="latest__course--duration"><svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>${Math.trunc(Math.random() * 100)}:${Math.trunc(Math.random() * 60)}</div>
                    </div>
                    <div class="latest__course--rate">${course.courseAverageScore}<svg fill="#F9A134" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg></div>
                </div>
                <div class="latest__course--footer">
                    <div class="latest__course--footer--users"><svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>${course.registers}</div>
                    <div class="latest__course--cost">${course.price == 0 ? "رایگان" : `${course.price.toLocaleString()} تومان`}</div>
                </div>
            </div>
        </div>
            </div>
        `)
    })
}

categorySorterMobile.addEventListener("change", () => sortCourses(categorySorterMobile.value))

window.addEventListener("load", () => {
    getCategoryCourses();
})