const express = require("express");
const app = express();
const port = 3000;
const nunjucks = require("nunjucks");

//
nunjucks.configure("views", {
    autoescape: true,
    express: app,
});

app.get("/", function(req, res) {
    //Include
    let users = {
        suggestedUsers: [{
                name: "John Doe",
                image: "/images/john.jpg",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                genres: ["Metal", "Rock"],
            },
            {
                name: "Jan Jansen",
                image: "/images/jan.jpg",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                genres: ["Dance-pop", "House", "Pop", "Trance"],
            },
        ],
        resultUsers: [{
                name: "Jane Roe",
                image: "/images/jane.jpg",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                genres: ["Reggae", "Rock"],
            },
            {
                name: "Richard Roe",
                image: "/images/richard.jpg",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                genres: ["Dance-pop", "EDM"],
            },
        ],
    };

    res.render("home.njk", users);
});

app.get("/profile", function(req, res) {
    res.render("profile.njk");
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
app.use(function(req, res, next) {
    res.status(404).render("404.njk");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});