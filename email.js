const nodemailer = require("nodemailer");

//Email test
function main(){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'Gravely2021@gmail.com',
            pass: 'qkgebwqxvsnbldui'
        }
    });
    
    var mailOptions = {
        from: 'Gravely2021@gmail.com',
        to: 'ezradaelmondigo@gmail.com', // whill change
        subject: 'Sending email using nodemailer',
        html: '<h4>Hello world!</h4>'
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log("Email sent: " + info.response);
        }
    });
}

module.exports = main;


