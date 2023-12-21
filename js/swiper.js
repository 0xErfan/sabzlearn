const $ = document
const newCoursesScroll = $.querySelector(".latest__courses--wrapper--edited");
const rightArrow = $.querySelector(".right__arrow");
const leftArrow = $.querySelector(".left__arrow");
let isMouseDown, pageX, scrollLeftElem, childWidth;

const mouseOverF = e => {
    if(!isMouseDown) return;
    newCoursesScroll.scrollLeft = scrollLeftElem - (e.pageX - pageX)
};

const mouseDownF = e => {
    isMouseDown = true
    pageX = e.pageX;
    scrollLeftElem = newCoursesScroll.scrollLeft;
    newCoursesScroll.classList.add("dragging")
};

const mouseUpF = () => {
    newCoursesScroll.classList.remove("dragging")
    isMouseDown = false
};

const rightArr = () => {
    childWidth = newCoursesScroll.children[1].offsetWidth + 10
    newCoursesScroll.scrollLeft == 0 ? rightArrow.style.opacity = "0" : null
    leftArrow.style.cssText = "opacity: 1"
    newCoursesScroll.scrollLeft += childWidth
};

const leftArr = () => {
    childWidth = newCoursesScroll.children[1].offsetWidth + 10
    rightArrow.style.cssText = "opacity: 1"
    newCoursesScroll.scrollLeft == -2100 ? leftArrow.style.opacity = "0" : null
    newCoursesScroll.scrollLeft -= childWidth
};

newCoursesScroll.addEventListener("mousemove", mouseOverF);
newCoursesScroll.addEventListener("mousedown", mouseDownF);
newCoursesScroll.addEventListener("mouseleave", mouseUpF);
rightArrow.addEventListener("click", rightArr);
leftArrow.addEventListener("click", leftArr);
$.addEventListener("mouseup", mouseUpF);