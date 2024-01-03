import { modalCall } from "../../../js/modal-call.js";
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
            if (user.role != "ADMIN") {
                throw new Error("2")
            }
            $.querySelector(".admin_name").innerHTML = user.name
            $.querySelector(".log__welcome").innerHTML = user.name

            setMainPageDetails()
            notification()
        })
        .catch((err) => console.log(err))
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
                        <p class="text-green-600 text-xl">${course.price == 0 ? "رایگان" : (course.price).toLocaleString() + "t"}</p>
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

const updateNotifs = (arr, elem) => {
    elem.closest(".notif_wrapper").remove()
    arr.splice(arr.findIndex(item => elem.closest(".notif_wrapper").querySelector(".notif__message").innerHTML == item), 1)
    modalCall("با موفقیت حذف شد!", 1)
    notification(arr)
}

const notification = (data) => {

    const notifWrapper = $.querySelector(".notif")
    let arr = data ?? ["سلام پشتیبانی نود را چک کنید", "نه", "قسمت دوم جی اس مشکل داره", "دوره را اپدیت کنید"]

    if (!arr.length) {

        notifWrapper.insertAdjacentHTML("beforeend", `
            <h4 style="text-align: center; color: red; height: 100%; display: flex; align-items: center; justify-content: center;">پیامی یافت نشد!</h4>
        `)
        notifBell.classList.remove("bell_active")

    } else {

        notifBell.classList.add("bell_active");
        notifWrapper.innerHTML = ""

        arr.forEach((body) => {
            notifWrapper.insertAdjacentHTML("beforeend", `
                <div class="notif_wrapper flex space-y-2 items-center justify-between ">
                    <div class="notif__message w-3/4 line-clamp-1">${body}</div>
                    <div class="flex items-center gap-1 ch:px-2 ch:rounded-md ch:transition-all ch:duration-200 text-white">
                        <button class="show__notif bg-green-600 hover:bg-green-700">نمایش</button>
                        <button class="seen__notif bg-red-600 hover:bg-red-700">خوندم</button>
                    </div>
                </div>
            `)
        })

        const showNotif = Array.from($.querySelectorAll(".show__notif"))
        const seenNotif = Array.from($.querySelectorAll(".seen__notif"))
        

        showNotif.forEach(showBtn => {
            showBtn.addEventListener("click", function () {
                let confirmMessage = this.closest(".notif_wrapper").querySelector(".notif__message").innerHTML
                confirm(confirmMessage + "\n \n آیا پیام را حذف میکنید؟") ? updateNotifs(arr, this) : null
            })
        })
        
        seenNotif.forEach(btn => btn.addEventListener("click", function () { updateNotifs(arr, this) }))
    }
}

notifBell.addEventListener("mouseenter", function () { this.lastChild.previousSibling.classList.add("notif__active") })

notifWrapper.addEventListener("mouseleave", function () { this.classList.remove("notif__active") })

openMenu.addEventListener("click", () => menuHandler())
closeMenu.addEventListener("click", () => menuHandler())
overlay.addEventListener("click", () => menuHandler())

window.addEventListener("load", () => {
    isAdmin();
})