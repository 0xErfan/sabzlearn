import { getAllUserData, getAllCourses } from "../../../js/utilities.js"

const $ = document;

const isAdmin = () => {
    getAllUserData()
        .then(user => {
            if (user.ok) {
                return user.json()
            }
            throw new Error("1")
        })
        .then(user => {
            if (user.role != "ADMIN") {
                throw new Error("2")
            }
            $.querySelector(".admin_name").innerHTML = user.name
            $.querySelector(".log__welcome").innerHTML = user.name

            setMainPageDtails()
        })
        .catch((err) => err)
}

const setMainPageDtails = () => {
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
                <div class="flex justify-center ch:basis-1/2  overflow-hidden rounded-lg border border-white/20 hover:-translate-y-2 h-32 transition-all duration-300 cursor-pointer  shadow-xl">
                    <div class="flex flex-col justify-between p-3">
                        <p class=" line-clamp-3 text-sky-50">${course.name}</p>
                        <p class="text-green-600 text-xl">${course.price == 0 ? "رایگان" : (course.price).toLocaleString()}</p>
                    </div>
                    <img class="block h-auto" src="http://localhost:4000/courses/covers/${course.cover}">
                </div>
            `)
        })
    })
}

const menuHandler = () => {
    let menu = document.querySelector(".menu")
    let overlay = document.querySelector(".overlay")

    if (menu.className.includes("-right-64")) {

    } else {

    }
}


$.querySelector(".open__menu").addEventListener("click", () => menuHandler()) 

window.addEventListener("load", () => {
    isAdmin();
})