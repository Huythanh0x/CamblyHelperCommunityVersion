import { getLessonFromStudentId, fetchTutorDataFromTutorId, getCurrentMainStudentId } from '../data/api_request_helper.js';

const scheduledLessonList = document.querySelector("#scheduledLessonList");
const progressBarLessonEl = document.querySelector(".loading-container-lesson")

export async function mainDisplayLesson() {
    progressBarLessonEl.style.opacity = 1
    //TODO find all lesson
    let lessonObject = await getLessonFromStudentId(getCurrentMainStudentId())
    if (lessonObject != undefined) {
        insertLessonToLessonTab(accountObject, lessonObject)
    } else {
        showMessage("THER IS NO INCOMING LESSON")
    }
    progressBarLessonEl.style.opacity = 0
}

async function insertLessonToLessonTab(accountObject, lessonObject) {
    let tutorObject = await fetchTutorDataFromTutorId(lessonObject.tutorId)
    const avatarEl = document.createElement("img");
    avatarEl.classList.add("avatar");
    avatarEl.setAttribute("src", tutorObject.src);
    avatarEl.addEventListener(
        "click",
        (function () {
            sendFavouriteAccountMessage(tutorObject.url)
        }))
    const nameEl = document.createElement("h3");
    nameEl.innerText = tutorObject.name;
    //lesson time group
    const lessonTimeGroup = document.createElement("div");
    lessonTimeGroup.classList.add("lesson-time");
    let lessonTimeEl = document.createElement("span")
    lessonTimeEl.innerHTML = new Date(lessonObject.scheduledStartAt).toLocaleString()
    lessonTimeGroup.appendChild(lessonTimeEl)
    //name-lesson group
    const nameLessonGroupEl = document.createElement("div");
    nameLessonGroupEl.classList.add("name-lesson-group")
    nameLessonGroupEl.appendChild(nameEl)
    nameLessonGroupEl.appendChild(lessonTimeGroup)
    //avatar name group
    const avatarNameGroupEl = document.createElement("div");
    avatarNameGroupEl.classList.add("avatar-group");
    avatarNameGroupEl.appendChild(avatarEl);
    avatarNameGroupEl.appendChild(nameLessonGroupEl);
    //login button
    const loginBtn = document.createElement("button");
    loginBtn.classList.add("login-btn");
    loginBtn.innerHTML = "Login";
    loginBtn.addEventListener(
        "click",
        (function (url) {
            return function () {

                if (accountObject != null) {
                    sendFavouriteAccountMessage(tutorObject.url)
                } else {
                    alert("LIST ACCOUNTS IS EMPTY")
                }
            };
        })(tutorObject.url)
    )
    const btnGroupEl = document.createElement("div");
    btnGroupEl.appendChild(loginBtn)
    //li
    const li = document.createElement("li");
    li.classList.add("lesson-item");
    li.appendChild(avatarNameGroupEl);
    li.appendChild(btnGroupEl);
    if (tutorObject.isOnline) {
        li.style.backgroundColor = "lightgreen";
    }

    scheduledLessonList.appendChild(li);
}

function sendFavouriteAccountMessage(tUrl) {
    chrome.runtime.sendMessage({ message: "navigate_to_favourite_tutor", tutorUrl: tUrl }, function (response) { });
}

function showMessage(message) {
    var emptyTag = document.createElement("h1");
    emptyTag.innerText = message;
    scheduledLessonList.appendChild(emptyTag);
}