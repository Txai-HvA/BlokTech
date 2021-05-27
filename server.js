const express = require("express");
const slug = require("slug");
const multer = require("multer"); //Used for file uploads
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv").config();

//Allows to customize the way multer stores the files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "static/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}.jpg`);
    },
});
const upload = multer({ storage: storage }); //Calls multer function and use dest as property
//Source https://stackoverflow.com/questions/31592726/how-to-store-a-file-with-file-extension-with-multer

//Define variables
const port = 3000;
let db = null;
const userId = process.env.USERID;
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

// Nunjucks
const nunjucks = require("nunjucks");
nunjucks.configure("views", {
    autoescape: true,
    express: app,
});

// Connect to Database
async function connectDB() {
    const uri = process.env.DB_URI;
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

/* Homepage / Userlist page, which shows a list of users. 
The Filter menu shows genres and artists.
When a filter is applied, the page refreshes with the filter applied to the users.
*/
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

    const query = {...queryGenres, ...queryArtists };
    const options = { sort: { firstName: 1 } };
    const users = await db
        .collection("users")
        .find(query, options)
        .toArray()
        .catch((error) => {
            console.log(error);
        });
    const loggedInUser = await db
        .collection("users")
        .findOne(null, { ObjectId: userId })
        .catch((error) => {
            console.log(error);
        });

    //Suggested Users
    users.forEach((user) => {
        user.genres.forEach((userGenre) => {
            loggedInUser.genres.forEach((loggedInUserGenre) => {
                if (loggedInUserGenre == userGenre) {
                    user.suggested = true;
                }
            });
        });
    });

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

// Edit profile page, which the logged in user his/her info.
app.get("/editprofile", async(req, res) => {
    //Get user from database
    const query = { _id: ObjectId(userId) };
    const options = {};
    let user = await db
        .collection("users")
        .findOne(query, options)
        .catch((error) => {
            console.log(error);
        });

    res.render("editprofile.njk", { user, genres, artists });
});

// Edit profile page post method, where the data from the logged in user gets updated.
app.post("/editprofile", upload.single("avatar"), async(req, res) => {
    let genres = req.body.genres;
    let artists = req.body.artists;

    //Removes first element of array
    genres.shift();
    artists.shift();
    //Source https://www.w3schools.com/jsref/jsref_shift.asp

    req.body.genres = genres;
    req.body.artists = artists;

    //Update user in database
    await db
        .collection("users")
        .updateOne({ _id: ObjectId(userId) }, {
            $set: {
                slug: slug(req.body.firstName + "-" + req.body.lastName),
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                description: req.body.description,
                genres: req.body.genres,
                artists: req.body.artists,
            },
        })
        .catch((error) => {
            console.log(error);
        });

    //Get user from database
    const query = { _id: ObjectId(userId) };
    const options = {};
    let user = await db
        .collection("users")
        .findOne(query, options)
        .catch((error) => {
            console.log(error);
        });

    res.render("editprofile.njk", { title: "Succes!", user, genres, artists });
});

app.get("/users", (req, res) => {
    res.send("<h1>This wil become a list of users.</h1>");
});

app.get("/users/:_id/:slug", (req, res) => {
    res.send(`<h1>This wil become a profile page for ${req.params.slug}</h1>`);
});

//If no route applies, show 404 page
app.use(function(req, res) {
    res.status(404).render("404.njk");
});