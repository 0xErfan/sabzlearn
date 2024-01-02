import { getAllUserData, getAllCourses } from "../../../js/utilities.js"

const $ = document;
const menu = document.querySelector(".menu")
const overlay = document.querySelector(".overlay")
const openMenu = $.querySelector(".open__menu")
const closeMenu = $.querySelector(".close__menu")
const notifWrapper = $.querySelector(".notif")
const notifBell = $.querySelector(".bell")

const isAdmin = () => {
    
    getAllUserData().then(user => {
        if (user.ok) {
            return user.json()
        }
        throw new Error("1")
    })
    .then(user => {
        console.log(user);
        if (user.role != "ADMIN") {
            throw new Error("2")
        }
        $.querySelector(".admin_name").innerHTML = user.name
        $.querySelector(".log__welcome").innerHTML = user.name

        setMainPageDetails()
    })
    .catch(() => location.href = "http://127.0.0.1:5500/index.html")
}

const setMainPageDetails = () => {
    const courseContainer = $.querySelector(".courses__wrapper")
    let users = 0, sales = 0;

    getAllCourses().then(data => {

        data.forEach(course => {
            users += course.registers
            sales += course.registers * course.price
        })

        $.querySelector(".users__count").innerHTML = users
        $.querySelector(".sales__count").innerHTML = sales.toLocaleString() + "t"
        $.querySelector(".product__count").innerHTML = data.length

        courseContainer.innerHTML = ""

        data.sort((a, b) => b.registers - a.registers).slice(0, 6).forEach(course => {
            courseContainer.insertAdjacentHTML("beforeend", `
                <div class="flex justify-between overflow-hidden rounded-lg border border-white/20 hover:-translate-y-2 h-32 transition-all duration-300 cursor-pointer shadow-xl">
                    <div class="flex flex-col justify-between p-3 pr-0 basis-1/3">
                        <p class=" line-clamp-3 text-sky-50">${course.name}</p>
                        <p class="text-green-600 text-xl">${course.price == 0 ? "رایگان" : (course.price).toLocaleString()}</p>
                    </div>
                    <div class="block basis-2/3 h-full  overflow-hidden">
                        <img class="size-full object-cover" src="http://localhost:4000/courses/covers/${course.cover}">
                    </div>
                </div>
            `)
        })
    })
}

const menuHandler = () => {

    if (menu.className.includes("menu__open")) {

        menu.classList.remove("menu__open")
        overlay.classList.remove("show")

    } else {

        overlay.classList.add("show")
        menu.classList.add("menu__open")
    }
}

const notification = (data) => {
    console.log(data);
}

notifBell.addEventListener("mouseenter", function () { this.lastChild.previousSibling.classList.add("notif__active") })

notifWrapper.addEventListener("mouseleave", function () { this.classList.remove("notif__active") })

openMenu.addEventListener("click", () => menuHandler())
closeMenu.addEventListener("click", () => menuHandler())
overlay.addEventListener("click", () => menuHandler())

window.addEventListener("load", () => {
    isAdmin();
})