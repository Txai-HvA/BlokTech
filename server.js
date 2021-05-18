const express = require("express");
const slug = require("slug");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv").config();

// Define variables
const port = 3000;
let db = null;
const userId = "609ef6b1cdeab94a7478ecf1";
const genres = [
    "Dance",
    "Rock",
    "Metal",
    "Pop",
    "Jazz",
    "Reggae",
    "House",
    "Trance",
    "EDM",
];
const artists = [
    "Rick Astley",
    "Nickelback",
    "Metallica",
    "deadmau5",
    "Tiesto",
];

//Middleware
app.use(express.static("static"));
app.use(express.json());
app.use(express.urlencoded()); //Als je gaat werken met file uploads, dan moet je nog iets anders gaan toevoegen

// nunjucks
const nunjucks = require("nunjucks");
nunjucks.configure("views", {
    autoescape: true,
    express: app,
});

// Connect to Database
async function connectDB() {
    const uri = process.env.DB_URI;
    console.log(uri);
    // make connection to database
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    try {
        await client.connect();
        //If connnection is succesful, search for database
        db = await client.db(process.env.DB_NAME);
    } catch (error) {
        console.log(error);
    }
}

// Start server

app.listen(port, () => {
    console.log(`Example app listening at ${port}`);
    connectDB()
        .then(() => {
            console.log("Connected to MongoDB successfully!");
        })
        .catch((error) => {
            console.log(error);
        });
});

//Routes

app.get("/", async(req, res) => {
    let queryGenres = {};
    if (req.query.genres && Array.isArray(req.query.genres)) {
        //If genres are selected, at them to the query
        queryGenres = { genres: { $in: req.query.genres } };
    } else if (req.query.genres && !Array.isArray(req.query.genres)) {
        //If req.query.genres isn't an array, change it to an array and at them to the query
        queryGenres = { genres: { $in: [req.query.genres] } };
    }

    let queryArtists = {};
    if (req.query.artists && Array.isArray(req.query.artists)) {
        //If artists are selected, at them to the query
        queryArtists = { artists: { $in: req.query.artists } };
    } else if (req.query.artists && !Array.isArray(req.query.artists)) {
        //If req.query.artists isn't an array, change it to an array and at them to the query
        queryArtists = { artists: { $in: [req.query.artists] } };
    }
    console.log(queryArtists);

    const query = {...queryGenres, ...queryArtists };
    const options = { sort: { firstName: 1 } };
    const users = await db.collection("users").find(query, options).toArray();

    //To stored checked genres & artists
    const selectedGenres = req.query.genres || [];
    const selectedArtists = req.query.artists || [];

    res.render("home.njk", {
        users,
        genres,
        artists,
        selectedGenres,
        selectedArtists,
    });
});

app.get("/editprofile", async(req, res) => {
    //Get user from database
    const query = { _id: ObjectId(userId) };
    const options = {};
    let user = await db.collection("users").findOne(query, options);

    res.render("editprofile.njk", { user, genres, artists });
});

app.post("/editprofile", async(req, res) => {
    //Update user in database
    const result = await db.collection("users").updateOne({ _id: ObjectId(userId) }, {
        $set: {
            slug: slug(req.body.firstName + "-" + req.body.lastName),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            description: req.body.description,
            genres: req.body.genres,
            artists: req.body.artists,
        },
    });

    //Get user from database
    const query = { _id: ObjectId(userId) };
    const options = {};
    let user = await db.collection("users").findOne(query, options);

    res.render("editprofile.njk", { title: "Succes!", user, genres, artists });
});

app.get("/users", (req, res) => {
    res.send("<h1>This wil become a list of users and filters</h1>");
});

app.get("/users/:userId/:slug", (req, res) => {
    res.send(`<h1>This wil become a profile page for ${req.params.slug}</h1>`);
});

//If no route applies, show 404 page
app.use(function(req, res) {
    res.status(404).render("404.njk");
});