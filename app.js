  if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const ejsMate = require('ejs-mate');
const session = require('express-session');
const methodOverride = require('method-override');
const passport = require('passport');
const sessionOptions = {secret: 'thisisnotagoodsecret', resave: false, saveUninitialized: false};
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const User = require('./models/user'); 
const School = require('./models/school'); 
const ai = require('./ai');
const Chat = require('./models/chat');
const bcrypt = require('bcrypt');
const morgan = require('morgan');
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.engine('ejs', ejsMate);

// Set up session and passport
app.use(session({
    secret: 'batman',
    resave: true,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());



//Mongoose Connection
mongoose.connect("mongodb+srv://eberson501:eberson501@cluster0-re0hi.mongodb.net/classAI?retryWrites=true&w=majority",)
	.then(() => {
        console.log("Database Connected")
    })
    .catch(err => {
        console.log("Trouble connecting to Database")
        console.log(err)
    });

    
const sessionConfig = {
	name:'batman',
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
		// secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
// Passport local strategy for admin authentication
// passport.use(new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'password'
//   }, async (email, password, done) => {
//     try {
//       const admin = await Admin.findOne({ email });
//       if (!admin) {
//         return done(null, false, { message: 'Incorrect email or password.' });
//       }
//       const isMatch = await admin.comparePassword(password);
//       if (!isMatch) {
//         return done(null, false, { message: 'Incorrect email or password.' });
//       }
//       return done(null, admin);
//     } catch (error) {
//       return done(error);
//     }
//   }));
  
  // Serialize and deserialize admin for session management
//   passport.serializeUser((admin, done) => {
//     done(null, admin.id);
//   });
  
//   passport.deserializeUser(async (id, done) => {
//     try {
//       const admin = await Admin.findById(id);
//       done(null, admin);
//     } catch (error) {
//       done(error);
//     }
//   });
app.use(session(sessionConfig))
app.use(session(sessionOptions));
app.use(flash());
app.use(express.static('public'));
app.use(morgan('tiny'));
app.use(methodOverride('_method')); 
	


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 

  //Routes 
    app.get("/", function(req, res){
        res.render("beta");
    });
    app.get("/chat", function(req, res){
        res.render("chat");
    });
    app.get("/x", function(req, res){
        res.render("demo");
    });
    app.get("/y", function(req, res){
        res.render("x");
    });
    app.post("/new", async function(req, res){
        const text = req.body.text;
        const chat = await ai.myTutor(text);
        res.render('data', { 
            title: 'My AI Tutor', 
            tagline: 'use AI to accelerate your learning', 
            description: 'AI tutor aimed to help guide ad foster independent learning',
            question: text,
            answer: chat,
        
        });
    });
// AI Chat Routes 
    app.post("/sendmessage", async function(req, res){
        const text = req.body.prompt;
        const x = {
            "role": "user",
            "content": `${text}`
        }
        const chat = new Chat();
        chat.created = new Date();
        chat.history.push(x);
        const data = await ai.getGPT(text);
        chat.history.push(data);
        await chat.save();
        res.redirect(`/chat/${chat._id}`)
    });

    app.get('/chat/:id', async function(req, res) {
        try {
            const { id } = req.params;
            const chat = await Chat.findById(id);
            res.render("inbox", { chat });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send("An error occurred while fetching chat data.");
        }
    });
    app.post("/chat/:id/sendmessage", async function(req, res){
        const { id } = req.params;
        const chat = await Chat.findById(id);
        const text = req.body.prompt;
        const history = chat.history;
        const y =[];
        history.forEach( data => {
            const i = data.role;
            const j = data.content;
            const k = {
                "role": `${i}`,
                "content": `${j}` 
            } 
            y.push(k)
        });
        const x = {
            "role": "user",
            "content": `${text}`
        }
        y.push(x);
        chat.history.push(x);
        const data = await ai.getGPT(text);
        chat.history.push(data);
        await chat.save();
        res.redirect(`/chat/${chat._id}`)
    });

// Signup Route
app.get('/signup', (req, res) => {
    res.render('signup');
  });
  
  app.post('/signup', async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).send('User with this email already exists.');
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const username = email;
      const newUser = new User({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
      });
      const registeredUser = await User.register(newUser, password);
		console.log(registeredUser);
      await newUser.save();
      // Handle user registration, session creation, etc. as needed
      res.redirect('/login');
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).send('An error occurred while creating the user.');
    }
  });
  
  // Login Route
  app.get('/login', (req, res) => {
    res.render('login');
  });
  
  app.post('/login', 
	passport.authenticate('local', {failureMessage: true, failureFlash: true, failureRedirect: '/login'}),	 
	(req, res) => {
	res.render("chat")
});



    const port = 3000;
    const hostname = '0.0.0.0';
    
    // Define routes here
    
    app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    });