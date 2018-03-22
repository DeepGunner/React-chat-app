// require('dotenv').config()
const db = require("../models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// U S E R * L O G I N * R E L A T E D
module.exports = function (app) {

    // Middleware
    app.use(async function (req, res, next) {
        var token = req.cookies.jwtID;
        if (token) {
            // console.log(token)
            jwt.verify(token, process.env.jwt_SECRET, async function (err, decoded) {
                if (err) {
                    next()
                }
                var user = await db.User.findOne({ username: decoded.username }, { password: 0 });
                if (user) {
                    req.user = user;
                    res.locals.user = user;
                }
                next()
            })
        } else {
            next()
        }
    });

    // New User Sign Up Routes
    // Present the User Sign Up page
    app.get('/signup', async (req, res) => {
        var error = req.query.error || '';
        res.render('authViews/signUp', { error });
    });
    // Create a new user, when the user submits
    // the user creation form
    app.post('/signup', async (req, res) => {
        var error;
        // confirm that user typed same password twice
        if (req.body.password !== req.body.passwordConfirmation) {
            error = "The passwords don't match. Please try again";
            res.redirect('/signup?error=' + encodeURIComponent(error));
        }
        // Check if the user has entered a user and password
        if (req.body.username && req.body.password) {
            var userObject = {
                username: req.body.username,
                password: req.body.password
            };
            db.User.create(userObject)
                .then(function (user) {
                    // create token
                    var token = jwt.sign({
                        userID: user._id,
                        username: user.username
                    }, process.env.jwt_SECRET, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                    // Redirect the user to homepage upon
                    res.cookie('jwtID', token, { httpOnly: true });
                    res.redirect('/');
                }, function (err) {
                    // In case of any validation errors present
                    // the sign up form again with relevant errors
                    error = err;
                    res.redirect('/signup?error=' + encodeURIComponent(error));
                });
        } else {
            // When the user attempts to submit the form with empty
            // values, present the sign up form again with a relevant
            // error message
            error = 'Please enter a username and password';
            res.redirect('/signup?error=' + encodeURIComponent(error));
        }
    });

    // User Login Routes
    // Present the user witht he log in page:
    app.get('/login', async function (req, res) {
        var error = req.query.error || '';
        if (req.user) {
            // If the user is already logged in, redirect
            // to the homepage
            var error = "You are already logged in! Quit playing games with my heart!"
            res.redirect('/?error=' + encodeURIComponent(error));
        } else {
            // Else, present the user with a login form
            var error;
            res.render('authViews/login', { error });
        }
    });
    // Log... in... the user:
    app.post('/login', async function (req, res) {
        var error;
        // Load the user profile from the DB, with the username as key
        var user = await db.User.findOne({ username: req.body.username });
        // Check if the user exists
        if (!user) {
            // If the user doesn't exist, display the login page again
            // with a relevant error message
            error = "The username doesn't exist! Try again.";
            res.redirect('/login?error=' + encodeURIComponent(error));
        } else {
            // Bcrypt checks if the user password matches with the 
            // hashed equivalent stored in the DB
            if (bcrypt.compareSync(req.body.password, user.password)) {
                // create token
                var token = jwt.sign({
                    userID: user._id,
                    username: user.username
                }, process.env.jwt_SECRET, {
                        expiresIn: 86400 // expires in 24 hours
                    });
                // Redirect the user to homepage upon
                res.cookie('jwtID', token, { httpOnly: true });
                // set the password to null,
                // so it's not available in the sessions cookie
                // user.password = null;
                // Store the user in the session:
                // req.session.user = user;
                res.redirect('/');
            } else {
                // If the password doesn't match, display the login page again
                // with a relevant error message
                error = "The password that you've entered is incorrect! Try again.";
                res.redirect('/login?error=' + encodeURIComponent(error));
            }
        }
    });

    // User Logout Route
    app.post('/logout', async function (req, res) {

        // So, I eplicitly delete the cookie from the user's browser
        res.clearCookie('jwtID');
        // Redirect the user to the homepage
        res.redirect('/login');
    });
}