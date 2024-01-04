import { modalCall } from "../../../js/modal-call.js";
import { getWantedToken } from "../../../js/utilities.js";

const $ = document;

const courseName = $.querySelector("#course__name")
const coursDescription = $.querySelector("#course__description")
const coursPrice = $.querySelector("#course__price")
const courseShortName = $.querySelector("#course__shortName")
const courseStatus = $.querySelector("#course__status")
const courseCategory = $.querySelector("#course__category")
const courseCover = $.querySelector("#course__cover-input")
const addNewCourseBtn = $.querySelector("#add__course-btn")

let createdCover;

const addCourse = () => {

    let getCatID;

    try {
        fetch("http://localhost:4000/v1/category")
        .then(data => data.json())
        .then(data => getCatID = data.find(category => category.title == courseCategory.value))
        .then(() => {
            let courseObj = {
                name: courseName.value.trim(),
                description: coursDescription.value.trim(),
                shortName: courseShortName.value.trim(),
                categoryID: getCatID._id,
                price: coursPrice.value.trim(),
                support: "گروه تلگرامی",
                status: courseStatus.value.includes("درحال") ? "start" : "finish",
                cover: createdCover,
            }

            for (let entry of Object.entries(courseObj)) { if (!entry[1] || !entry[1].length) throw new Error() }

            fetch("http://localhost:4000/v1/courses", {
                method: "POST",
                Headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${getWantedToken("logInT")}`
                },
                body: JSON.stringify(courseObj)
            })
            .then(data => {
                data.json();
            })
        })
    } catch(err) { modalCall("اطلاعات دوره را بصورت کامل وارد کنید!") } 
}

courseCover.addEventListener("change", function () { createdCover = URL.createObjectURL(this.files[0]) })

addNewCourseBtn.addEventListener("click", () => addCourse())