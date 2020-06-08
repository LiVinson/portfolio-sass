import data from "./skills.js";
import "../sass/main.scss"

//Add click event to each 'skills' button
window.addEventListener("load", function () {
    console.log("loaded!")
    console.log(data.skills[0])
    document.querySelectorAll(".btn-skills").forEach(item => {     
        item.addEventListener('click', getSkillDetails)
      })

    document.querySelector(".form__submit")
        .addEventListener("click", submitForm)
})

  //Click event: Retrieve details for selected skill
const getSkillDetails = function() {
    const skill = this.getAttribute("data-skill")
    // console.log(skill)
    const skillInfo = data.skills.find(item => item.skill === skill)
    console.log(skillInfo);
    displaySkillDetails(skillInfo)
}

//Display skill information to the dom
const displaySkillDetails = ({ skill, details, category} ) => {  
    //pickle - add error checking / checking for existing 
    const paragraphs = document.querySelectorAll("div.skills__details > p")
    console.log(paragraphs)
    if(paragraphs.length) {
        paragraphs.forEach(p => p.remove())
    }
    const heading = document.getElementsByClassName("skill__heading")[0]
    console.log(heading);
    heading.textContent = skill;
    details.forEach(para => {
        const paragraph = document.createElement("p");
        const node = document.createTextNode(para);
        paragraph.appendChild(node);
        paragraph.setAttribute("class", "paragraph")
        const element = document.getElementsByClassName("skills__details")[0];
        console.log(paragraph);
        console.log(element);
        element.appendChild(paragraph);
    })
}

const submitForm = (event) => {
    event.preventDefault()
    console.log("submitted")

    const name = document.getElementsByName("name")[0].value
    const email = document.getElementsByName("email")[0].value
    const message = document.getElementsByName("message")[0].value

    //grab data from form
    //send request to /contact
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/contact", true)
    xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
    
    const formData = `name=${name}&email=${email}&message=${message}`;
    console.log(formData)

    xhr.onreadystatechange = function() {
        console.log("state changed")
        if (xhr.readyState === XMLHttpRequest.DONE) {
            console.log("response received")
            var status=xhr.status;
            console.log(status)
        }
    }

    xhr.send( formData )
    
    //when response is received 
        //:display success message
        //display error message 
}

// Needed for Hot Module Replacement
if(typeof(module.hot) !== "undefined") {
    module.hot.accept() 
  }
