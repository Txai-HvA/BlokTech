const express = require("express");
const app = express();
const port = 3000;
const nunjucks = require("nunjucks");

//
nunjucks.configure("views", {
    autoescape: true,
    express: app,
});

app.use(express.json()); //NEW
app.use(express.urlencoded()); //NEW

let data = {
    users: [{
            name: "John Doe",
            image: "/images/john.jpg",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            genres: ["Metal", "Rock"],
            suggested: true,
        },
        {
            name: "Jan Jansen",
            image: "/images/jan.jpg",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            genres: ["Dance-pop", "House", "Pop", "Trance"],
            suggested: true,
        },
        {
            name: "Jane Roe",
            image: "/images/jane.jpg",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            genres: ["Reggae", "Rock"],
            suggested: false,
        },
        {
            name: "Richard Roe",
            image: "/images/richard.jpg",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            genres: ["Dance-pop", "EDM"],
            suggested: false,
        },
    ],
};

const genres = ["Dance-pop", "Rock", "Metal", "Pop", "Jazz"];

app.get("/", function(req, res) {
    //Include
    res.render("home.njk", data);
});

app.get("/editprofile", function(req, res) {
    //Include
    res.render("editprofile.njk", [data, genres]);
});

app.post("/editprofile", function(req, res) {
    console.log(req.body);

    let user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        description: req.body.description,
    };
    data.users.push(user);

    console.log(data.users);

    res.render(user, { title: "Succes", genres });
});

//Middleware
app.use(express.static("static"));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/users", (req, res) => {
    res.send("<h1>This wil become a list of users and filters</h1>");
});

app.get("/users/:userId/:slug", (req, res) => {
    res.send(`<h1>This wil become a profile page for ${req.params.slug}</h1>`);
});

//Middleware
app.use(function(req, res) {
    res.status(404).render("404.njk");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});