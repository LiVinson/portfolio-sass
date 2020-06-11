import data from "./skills.js"
import "../sass/main.scss"
// import "../img"
import "../files/Vinson_Lisa_Resume.pdf"

// Needed for Hot Module Replacement
if (typeof module.hot !== "undefined") {
  console.log("hot")
  module.hot.accept()
}


window.addEventListener("load", function () {
  console.log("loaded")
  const skillIcon = document.querySelector("div.skill__icon")

  //Check if any skills are hidden. If no - no action

  //If some are hidden, check if skill Icon is inview port.

  //In view:
  scrollTo()

  this.window.addEventListener("scroll", (event) => {
    console.log("scrolling...")
    if (elementInViewport(skillIcon)) {
      const skills = document.querySelectorAll(".skill.hidden")

      if (skills) {
        //remove hidden class, add fade-in
        skills.forEach((skill) => toggleClass(skill))
      }
    }
  })
})

function scrollTo() {
	const links = document.querySelectorAll('.scroll');
	links.forEach(each => (each.onclick = scrollAnchors));
}

function scrollAnchors(e, respond = null) {
  //returns the distance from the top of specified element 
  const distanceToTop = el => Math.floor(el.getBoundingClientRect().top);
  
	e.preventDefault();
	var targetID = (respond) ? respond.getAttribute('href') : this.getAttribute('href');
  const targetAnchor = document.querySelector(targetID);
  //checks to make sure element with id referenced in anchor tag href exists
	if (!targetAnchor) return;
	const originalTop = distanceToTop(targetAnchor);
	window.scrollBy({ top: originalTop, left: 0, behavior: 'smooth' });
	const checkIfDone = setInterval(function() {
		const atBottom = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 2;
		if (distanceToTop(targetAnchor) === 0 || atBottom) {
			targetAnchor.tabIndex = '-1';
			targetAnchor.focus();
			window.history.pushState('', '', targetID);
			clearInterval(checkIfDone);
		}
	}, 100);
}

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
  element.classList.add(addClass)
  element.classList.remove(removeClass)
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