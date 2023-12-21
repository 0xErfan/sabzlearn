const modalMsg = document.querySelector(".form__modal");
const $ = document;
let setInt;
let setTim;

function stopInt() {
    !setInt ? null : clearInterval(setInt)
}

function setTimeO() {
    !setTim ? null : clearTimeout(setTim)
}

const timeoutTimes = () => {

    let widthLength = 100

    setInt = setInterval(() => {
        $.querySelector(".form__linetime").style.width = `${widthLength -= 0.1}%`
    }, 1)

    setTim = setTimeout(function () {
        modalMsg.style.cssText = "opacity: 0; left: -32rem;";
        clearInterval(setInt)
    }, 4000)
}

function modalCall(message, stats = 0) {


    $.querySelector(".form__details-msg").innerHTML = message;

    if (stats) {
        $.querySelector(".form__svg svg").style.backgroundColor = "var(--cost-color)"
        $.querySelector(".form__linetime").style.backgroundColor = "var(--cost-color)"
        $.querySelector(".form__status--msg").innerHTML = "موفق"
    } else {
        $.querySelector(".form__svg svg").style.backgroundColor = "var(--pink)"
        $.querySelector(".form__linetime").style.backgroundColor = "var(--pink)"
        $.querySelector(".form__status--msg").innerHTML = "خطا"
    }

    modalMsg.style.cssText = "opacity: 1; left: 1.5rem;";

    stopInt()
    setTimeO()
    timeoutTimes()
}

export { modalCall }