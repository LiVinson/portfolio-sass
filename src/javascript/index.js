import "../sass/main.scss"
import "../files/Vinson_Lisa_Resume.pdf"
import "../img/_sprite.svg"
import validateInput from "./validation.js"

// Needed for Hot Module Replacement
if (typeof module.hot !== "undefined") {
  // console.log("hot")
  module.hot.accept()
}

window.addEventListener("load", function () {
  // console.log("loaded")

  //Attach scroll click events to nav
  scrollTo()
  const submitBtn = document.querySelector(".form__submit")
  submitBtn.addEventListener("click", submitForm)

  const hamburger = document.querySelector(".hamburger__container")
  hamburger.addEventListener("click", function() {
    
    if(this.dataset.status === "closed") {
      hamburger.setAttribute("data-status", "open")
      console.log("clicked", this.dataset.status)
    } else {
      hamburger.setAttribute("data-status", "closed")
      console.log("clicked", this.dataset.status)
    }
  })
})

//Grabs all elements with scroll class (nav links). Attach a scrollAnchors click event
const scrollTo = () => {
  const links = document.querySelectorAll(".scroll")
  links.forEach((each) => (each.onclick = scrollAnchors))
}

//Called when nav item clicked.
function scrollAnchors(e, respond = null) {
  //returns the distance from the top of specified element
  const distanceToTop = (el) => Math.floor(el.getBoundingClientRect().top)

  e.preventDefault()
  //Gets href of the nav item selected. Matches to an id of a section on the page
  var targetID = respond
    ? respond.getAttribute("href")
    : this.getAttribute("href")
  //Find item on page with matching id
  const targetAnchor = document.querySelector(targetID)
  //checks to make sure element with id referenced in anchor tag href exists. If not, returns and nothing happens
  if (!targetAnchor) return
  const originalTop = distanceToTop(targetAnchor) //distance to element with selected id
  //Amount window should scroll and how (smooth)
  window.scrollBy({ top: originalTop, left: 0, behavior: "smooth" })
  const checkIfDone = setInterval(function () {
    const atBottom =
      window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 2
    //If target element is reached or you've reached bottom of the page, focus on that element. Add history for that location to the window.
    if (distanceToTop(targetAnchor) === 0 || atBottom) {
      targetAnchor.tabIndex = "-1"

      window.history.pushState("", "", targetID)
      clearInterval(checkIfDone)
    }
  }, 100)

  //After scrolling to a section, if this was done via open hamburger menu, close it.
  const hamburger = document.querySelector(".hamburger__container")
  //Once scroll is complete, determine if nav has class of "open" (mobile only) and change it to status of closed
  if(hamburger.dataset.status === "open") {
    hamburger.setAttribute("data-status", "closed")
  }
}



const submitForm = (event) => {
  event.preventDefault()
  // console.log("submitted")

  //get form data and paragraph that will display confirmation/error
  const name = document.getElementsByName("name")[0].value
  const email = document.getElementsByName("email")[0].value
  const message = document.getElementsByName("message")[0].value
  const feedback = document.getElementsByClassName("form__feedback")[0]

  //clear any previous messages
  feedback.textContent = ""
  // const { validateInput } = data
  //add additional validation

  if (!validateInput("name", name)) {
    feedback.textContent =
      "Please provide a valid name between 1 and 100 characters"
    return
  }
  if (!validateInput("email", email)) {
    feedback.textContent =
      "Please provide a valid email address between 1 and 100 characters."
    return
  }
  if (!validateInput("message", message)) {
    feedback.textContent =
      "Please provide a message between 1 and 1000 characters"
    return
  }
  document.querySelector(".form__submit").disabled = true

  //send request to /contact
  const xhr = new XMLHttpRequest()
  xhr.open("POST", "/contact", true)
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")

  const formData = `name=${name}&email=${email}&message=${message}`

  xhr.onreadystatechange = function () {
    // console.log("state changed")
    if (xhr.readyState === XMLHttpRequest.DONE) {
      // console.log("response received")
      var status = xhr.status
      // console.log(status)
      if (status >= 200 && status <= 299) {
        feedback.textContent = `Your message was sent! I will get back to you at ${email} as soon as possible.`
        document.querySelector(".form").reset()
      } else {
        feedback.textContent =
          "Uh oh! There was a problem sending your message. Please try again or send an email to contact@lisavinson.com."
        document.querySelector(".form__submit").disabled = false
      }
    }
  }

  xhr.send(formData)
}


