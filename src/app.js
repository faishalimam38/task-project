const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs")

require("./db/conn");
const Register = require("./models/registers");


const port = process.env.PORT || 80;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));
app.set("view engine", "hbs")
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
    res.render("index")
});

app.get("/register", (req, res) => {
    res.render("register")
})

app.get("/login", (req, res) => {
    res.render("login")
})



// create a new user in our database

app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password === cpassword) {
            const registerEmployee = new Register({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                work: req.body.work,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword
            })

            const token = await registerEmployee.generateAuthToken()
            console.log("the token part" + token);

            const registerd = await registerEmployee.save();
            res.status(201).render("index")

        } else {
            res.send("password not match")
        }
    } catch (error) {
        res.status(400).send(error)
    }
})


// for login check

app.post("/login", async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password

        const useremail = await Register.findOne({ email: email })

        const isMatch = await bcrypt.compare(password, useremail.password)

        
        const token = await useremail.generateAuthToken()
        console.log("the token part" + token);

        if (isMatch) {
            res.status(201).render('index')
        } else {
            res.send('invalid login details')
        }

    } catch (error) {
        res.status(400).send("invalid login details")
    }
})




app.listen(port, () => {
    console.log(`server listening at port no ${port}`);
})