import data from "../files/skills.js";

//Add click event to each 'skills' button
window.addEventListener("load", function () {
    console.log("loaded")
    document.querySelectorAll(".btn-skills").forEach(item => {
       
        item.addEventListener('click', getSkillDetails)
      })
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

