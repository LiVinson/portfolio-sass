
export default (req, res) => {
    
 return confirmInput(req,res,sendEmail)

}
//verifies that all form data is valid before calling sendEmail
function confirmInput(req, res, next){

  try {
    const { name, email, message } = req.body
    if(validateInput("name", name) && validateInput("email", email) && validateInput("message", message)){
      next()
    } else {
      res.sendStatus(400)
    }
  } catch (error) {
    res.sendStatus(error.responseCode || 500)    
  } 
}


//Called if form input is valid. Gets email and pw from .env and sends form data w/ nodemailer
async function sendEmail(req, res) {
  try {
    //Create an instance of transporter object
    const { name, email, message } = req.body
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME, //
        pass: process.env.EMAIL_PASSWORD, //
      },
    })

    const mailOptions = {
      from: email, // sender address
      to: process.env.EMAIL_USERNAME, // list of receivers
      subject: `${name} visited your portfolio!`, // Subject line
      text: email + " sent the following: \n" + message, // plain text body
    }

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions)
    res.sendStatus(200)
  } catch (error) {

    res.sendStatus(error.responseCode || 500)
  }
}
