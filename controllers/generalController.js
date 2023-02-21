const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("general/home", {
        title: "Home Page"
    });
});

router.get("/contact-us", (req, res) => {
    res.render("general/contact-us", {
        title: "Contact Us"
    });
});

router.post("/contact-us", (req, res) => {
    console.log(req.body);

    const { firstName, lastName, email, message } = req.body;

    let passedValidation = true;
    let validationMessages = {};

    if (typeof firstName !== "string" || firstName.trim().length === 0) {
        passedValidation = false;
        validationMessages.firstName = "You must specify a first name.";
    }
    else if (typeof firstName !== "string" || firstName.trim().length <= 2) {
        passedValidation = false;
        validationMessages.firstName = "The first name should be at least 2 characters long.";
    }


    if (passedValidation) {
        // Continue and submit contact us form.
        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

        const msg = {
            to: "nick.romanidis@gmail.com",
            from: "nick.romanidis@senecacollege.ca",
            subject: "Contact Us Form Submission",
            html:
                `Visitor's Full Name: ${firstName} ${lastName}<br>
                Visitor's Email Address: ${email}<br>
                Visitor's message: ${message}<br>
                `
        };

        sgMail.send(msg)
            .then(() => {
                res.send("Success, validation passed and email has been sent");
            })
            .catch(err => {
                console.log(err);

                res.render("general/contact-us", {
                    title: "Contact Us",
                    validationMessages,
                    values: req.body
                });
            });

        // res.render("general/home", {
        //     title: "Home Page"
        // });
    }
    else {
        res.render("general/contact-us", {
            title: "Contact Us",
            validationMessages,
            values: req.body
        });
    }
});

module.exports = router;