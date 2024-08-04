const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

const username = process.env.mongodb_username;
const password = process.env.mongodb_password;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.igwtikx.mongodb.net/registrationformdb`);

const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const Registration = mongoose.model("Registration", registrationSchema);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/index.html');
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existinguser = await Registration.findOne({ email: email });
        if (existinguser) {
            const registrationData = new Registration({
                name,
                email,
                password
            });
            await registrationData.save();
            res.redirect("/success");
        }
        else {
            console.log("user already exist")
            res.redirect("/error");
        }

        
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
});

app.get("/success", (req, res) => {
    res.sendFile(__dirname + '/pages/success.html');
});

app.get("/error", (req, res) => {
    res.sendFile(__dirname + '/pages/error.html');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
