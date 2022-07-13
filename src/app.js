require("dotenv").config();
const express = require("express");
const app = express();
require("./db/connection");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");

const Register = require("./models/register");
const { urlencoded } = require("express");

const port = process.env.PORT || 3000;

// console.log(process.env.SECRET_KEY);

const static_Path = path.join(__dirname, "../public");
const template_Path = path.join(__dirname, "../templates/views");
const partials_Path = path.join(__dirname, "../templates/partials");
// console.log(static_Path);
app.use(express.static(static_Path));
app.set("view engine", "hbs");
app.set("views", template_Path);
hbs.registerPartials(partials_Path);

app.use(express.json());
app.use(urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

//create a new user in database
app.post("/register", async (req, res) => {
  try {
    const password = req.body.pass;
    const cpassword = req.body.re_pass;
    if (password === cpassword) {
      const registerEmployee = new Register({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        age: req.body.age,
        password: password,
        confirmpasswrod: cpassword,
      });

      const token = await registerEmployee.generateAuthToken();
      console.log(token);

      await registerEmployee.save();
      res.status(200).render("login");
    } else {
      res.send("Password Not Matching");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.your_pass;

    const useremail = await Register.findOne({ email });
    console.log(useremail);

    const isMatch = await bcrypt.compare(password, useremail.password);
    console.log(isMatch);

    const token = await useremail.generateAuthToken();
    console.log("the token part", token);

    if (isMatch) {
      res.status(201).render("index");
    } else {
      res.send("invalid password");
    }
  } catch (error) {
    res.status(400).send("Invalid Login Details");
  }
});

app.listen(port, () => {
  console.log(`listning to the port at ${port}`);
});
