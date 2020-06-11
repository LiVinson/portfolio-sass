import data from "./skills.js"
import "../sass/main.scss"

// //Add click event to each 'skills' button
// window.addEventListener("load", function () {
//     console.log("loaded!")
//     console.log(data.skills[0])
//     document.querySelectorAll(".btn-skills").forEach(item => {
//         item.addEventListener('click', getSkillDetails)
//       })

//     document.querySelector(".form__submit")
//         .addEventListener("click", submitForm)
// })

//   //Click event: Retrieve details for selected skill
// const getSkillDetails = function() {
//     const skill = this.getAttribute("data-skill")
//     // console.log(skill)
//     const skillInfo = data.skills.find(item => item.skill === skill)
//     console.log(skillInfo);
//     displaySkillDetails(skillInfo)
// }

// //Display skill information to the dom
// const displaySkillDetails = ({ skill, details, category} ) => {
//     //pickle - add error checking / checking for existing
//     const paragraphs = document.querySelectorAll("div.skills__details > p")
//     console.log(paragraphs)
//     if(paragraphs.length) {
//         paragraphs.forEach(p => p.remove())
//     }
//     const heading = document.getElementsByClassName("skill__heading")[0]
//     console.log(heading);
//     heading.textContent = skill;
//     details.forEach(para => {
//         const paragraph = document.createElement("p");
//         const node = document.createTextNode(para);
//         paragraph.appendChild(node);
//         paragraph.setAttribute("class", "paragraph")
//         const element = document.getElementsByClassName("skills__details")[0];
//         console.log(paragraph);
//         console.log(element);
//         element.appendChild(paragraph);
//     })
// }

window.addEventListener("load", function () {
  console.log("loaded")
  const skillIcon = document.querySelector("div.skill__icon")

  //Check if any skills are hidden. If no - no action

  //If some are hidden, check if skill Icon is inview port.

  //In view: 

  this.window.addEventListener("scroll", (event) => {
    console.log("scrolling...")
    if (elementInViewport(skillIcon)) {
      const skills = document.querySelectorAll(".skill.hidden")

      if (skills) {
        //remove hidden class, add fade-in
        skills.forEach(skill => toggleClass(skill))
      }
    }
  })
})

const elementInViewport = (element) => {
  //Gets position of element
  const bounding = element.getBoundingClientRect()
  console.log(bounding)

  // If in the viewport, position from the top and left >= 0,
  //  distance from the right <= total width of the viewport
  // and it’s distance from the bottom <= height of the viewport.
  if (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.right <=
      (window.innerWidth || document.documentElement.clientWidth) &&
    bounding.bottom <=
      (window.innerHeight || document.documentElement.clientHeight)
  ) {
    console.log("In the viewport!")
    return true
  } else {
    console.log("Not in the viewport")
    return false
  }
}

const toggleClass = (element, removeClass, addClass) => {
    
    element.classList.add("fade-in")
    element.classList.remove("hidden")
}
const submitForm = (event) => {
  event.preventDefault()
  console.log("submitted")

  const name = document.getElementsByName("name")[0].value
  const email = document.getElementsByName("email")[0].value
  const message = document.getElementsByName("message")[0].value

  //grab data from form
  //send request to /contact
  const xhr = new XMLHttpRequest()
  xhr.open("POST", "/contact", true)
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")

  const formData = `name=${name}&email=${email}&message=${message}`
  console.log(formData)

  xhr.onreadystatechange = function () {
    console.log("state changed")
    if (xhr.readyState === XMLHttpRequest.DONE) {
      console.log("response received")
      var status = xhr.status
      console.log(status)
    }
  }

  xhr.send(formData)

  //when response is received
  //:display success message
  //display error message
}

// Needed for Hot Module Replacement
if (typeof module.hot !== "undefined") {
  module.hot.accept()
}
