const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
//const library = require("./public/js/email.js");

app.use(express.static("public"));

app.listen(3000);

/*
console.log(library.getListExceed5years());

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'Gravely2021@gmail.com',
        pass: 'qkgebwqxvsnbldui'
    }
});

// email
function exceed5years(adminEmail, deceased){
    var mailOptions = {
        from: 'Gravely2021@gmail.com',
        to: adminEmail,
        subject: 'Gravely: a deceased has reached its exhumation date.',
        html: '<h4>Hello Dear subscriber!</h4><p>The grave of '+ deceased +' has exceeded 5 years. You may now perform exhumation and transfer the deceased to other location.</p>'
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log("Email sent: " + info.response);
        }
    });
}

function exhumNextMonth(adminEmail, deceased){
    var mailOptions = {
        from: 'Gravely2021@gmail.com',
        to: adminEmail,
        subject: 'Gravely: a deceased will reach its exhumation deadline.',
        html: '<h4>Hello Dear subscriber!</h4><p>The grave of '+ deceased +' will reach 5 years next month. Prepare to perform exhumation and transfer the deceased to other location.</p>'
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log("Email sent: " + info.response);
        }
    });
}

function deathAnniv(adminEmail, deceased){
    var mailOptions = {
        from: 'Gravely2021@gmail.com',
        to: adminEmail,
        subject: 'Gravely: Death anniversary.',
        html: '<h4>Hello Dear subscriber!</h4><p>Today marks the death anniversary of '+ deceased +'. Offer prayers for deceased.</p>'
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log("Email sent: " + info.response);
        }
    });
}

//exceed5years("ezradaelmondigo@gmail.com", "James albert");
*/

