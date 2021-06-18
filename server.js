if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require("express");
var cors = require('cors')
const app = express();
const bcrypt = require('bcrypt');
const passport = require("passport");
const flash = require('express-flash');
const session = require('express-session');
const initializePassport = require('./passport-config');
const methodOverride = require('method-override');
app.use(cors());
const bodyParser = require("body-parser");
const db = require("./db/employee");
const dbAdmin = require("./db/admin");

var allAdmins;
async function getAllAdmins(){
    allAdmins = await dbAdmin.getAllAdmins();
    //console.log("all admins", allAdmins);
    return allAdmins;
}
var email, id;


initializePassport(
    passport,
    async email => {
        const admins = await getAllAdmins()
        //console.log("allAdmins in initializePasssport", allAdmins)
        email = admins.find(admin => admin.email === email)
        return email;
        },
    async id => {
        const admins = await getAllAdmins()
        //console.log("allAdmins in initializePasssport", allAdmins)
        id = admins.find(admin => admin.id === id)
        return id;
        }
);




//const initialize = require('./passport-config');
const users = [];

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false}));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(express.static('static'));

app.get('/login', checkNotAuthenticated, (req, res)=> {
    console.log("get logOut");
    res.render('login.ejs')
});

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));


// app.post('/login', checkNotAuthenticated, (req, res) => {
//     try{
//         console.log("req.body", req.body)
//         allAdmins = getAllAdmins();
//         initializePassport(
//             passport,
//             email => {
//                 return allAdmins.find(admin => admin.email === req.body.email);
//             },
//             id => allAdmins.find(admin => admin.id === req.body.id)
//         );
//         res.redirect('/');
//     } catch {
//         res.redirect("/login");
//     }
// });

app.post('/register', checkNotAuthenticated, async (req, res) => {
    
    try {
        
        console.log("I'm in try")
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        console.log("hashedpassword is",hashedPassword);
        await dbAdmin.createAdmin({
            username: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            id: Date.now().toString()
        }).then(async () => {

            await dbAdmin.getAllAdmins().then(
                row => console.log("admins after insertion", row));
                
            res.redirect('/login');
        }).catch((error) => {
            console.error(error);
        });
        
    } catch {
        console.log("error");
        res.redirect('/register');
    }
    console.log("users",users);
});

app.post("/employees", async (req, res) => {
    const results = await db.createEmployee(req.body);
    res.status(201).json({ id: results[0] });
});

app.get("/employees", async (req, res) => {
    const employees = await db.getAllEmployees();
    res.status(200).json({ empList: employees });
});

app.patch("/employees/:id", async (req, res) => {
    var emp = {
        id: req.body.id,
        employeecode: req.body.employeecode,
        employeename: req.body.employeename,
        employeeemail: req.body.employeeemail,
        isactive: req.body.isactive 
    };
     const id = await db.updateEmployee(req.params.id, emp);
     res.status(200).json({ id });
});

app.delete("/employees/:id", async (req, res) => {
    console.log("id is: " + req.params.id);
    await db.deleteEmployee(req.params.id);
    res.status(200).json({ success: true});
});

app.get("/", checkAuthenticated, async (req, res) => {
    console.log("In /. Sending main.html.");
    res.sendFile('main.html', { root: __dirname });
})

app.get('/logout', (req, res) => {
    req.logout();
    req.user=null

    res.redirect('/login');
})

function checkAuthenticated(req, res, next){
    console.log("Im in checkAuthenticated function");
    if(req.isAuthenticated()) {
        console.log("Im isAuthenticated!! in checkAuthenticated")
        return next();
    }
    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    console.log("Im in checkNotAuthenticated function");
    if( req.isAuthenticated()) {
        console.log("Im isAuthenticated!! in checkNotAuthenticated")
        return res.redirect('/');
    }
    console.log("Im next()!! in checkNotAuthenticated")
    next()
}


app.listen(1338, () => console.log("server is running on port 1338"));
 