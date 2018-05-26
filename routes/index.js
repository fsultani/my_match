const express = require('express')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs')
const jwt = require('jwt-simple')
const Cookies = require('js-cookie');
const path = require('path');
const JWT_SECRET = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex')
const multer = require('multer')

const router = express.Router()

const User = require('../models/user')
const Message = require('../models/message')
const Conversation = require('../models/conversation')

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user) {
      if (err) throw err;
      if (!user) {
        return done(null, false, {message: 'Unknown user'});
      }
      User.comparePassword(password, user.password, function(err, isMatch) {
        if (err) throw err;
        if(isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {message: 'Invalid password'});
        }
      })
    })
  }
));

// Set multer storage engine
const storageEngine = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`)
  }
})

// Initialize upload
const upload = multer({
  storage: storageEngine,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb)
  }
}).single('image')

// Check File Type
const checkFileType = (file, cb) => {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/
  
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  
  // Check mime
  const mimetype = filetypes.test(file.mimetype)

  mimetype && extname ? cb(null, true) : cb('Error: Images only')
}

router.post('/api/upload', (req, res) => {
  upload(req, res, err => {
    if (err) {
      res.json({ msg: err })
    } else {
      if (req.file == undefined) {
        res.json({ msg: "Error: No File Selected" })
      } else {
        res.json({ msg: "File Uploaded Successfully", file: `/uploads/${req.file.filename}` })
      }
    }
  })
})

router.put('/api/profile-info', (req, res) => {
  const token = req.headers['authorization']
  const decodedUser = jwt.decode(token, JWT_SECRET)
  User.findOneAndUpdate({ username: decodedUser.username}, { profilePicture: req.body.data }, (err, member) => {
    console.log('The member is\n', member)
    res.json({ member })
  })
})

router.get('/api/profile-info', (req, res, next) => {
  const token = req.headers['authorization']
  const decodedUser = jwt.decode(token, JWT_SECRET)
  User.findOne({ username: decodedUser.username}, (err, member) => {
    res.json({ member })
  })
})

router.get('/api/all-members', (req, res, next) => {
  const token = req.headers['authorization']
  const decodedUser = jwt.decode(token, JWT_SECRET)
  User.findOne({username: decodedUser.username}, (err, user) => {
    if (!user) {
      return res.status(403).send("Authentication failed. User not found.")
    } else {
      user.gender === 'male' ? (
        User.find({gender: 'female'}, (err, all) => {
          res.json({all: all})
        })
      ) : (
        User.find({gender: 'male'}, (err, all) => {
          res.json({all: all})
        })
      )
    }
  })
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err)
    if (!user) {
      return res.json(401, { error: 'message' })
    } else {
      // Return a token to the client once the user is authenticated
      const token = jwt.encode({ username: user.username}, JWT_SECRET)
      const decodedUser = jwt.decode(token, JWT_SECRET)
      Cookies.set('token', token)
      User.findOne({ username: decodedUser.username }, (err, member) => {
        res.json({ token: token, member: member })
      })
    }
  })(req, res, next)
})

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/');
  }
}

router.post('/register', function(req, res) {
  console.log("req.body\n", req.body)
  const name = req.body.userRegistrationForm.name
  const email = req.body.userRegistrationForm.email
  const password = req.body.userRegistrationForm.password
  const gender = req.body.userRegistrationForm.gender
  const birthMonth = req.body.userRegistrationForm.birthMonth
  const birthDate = req.body.userRegistrationForm.birthDate
  const birthYear = req.body.userRegistrationForm.birthYear

  req.checkBody('name', 'Name is required').notEmpty()
  req.checkBody('email', 'Email is required').notEmpty()
  req.checkBody('password', 'Password is required').notEmpty()
  req.checkBody('gender', 'Please select your gender').notEmpty()
  req.checkBody('birthMonth', 'Please select your birth month').notEmpty()
  req.checkBody('birthDate', 'Please select your birth date').notEmpty()
  req.checkBody('birthYear', 'Please select your birth year').notEmpty()
  
  const errors = req.validationErrors()
  // const errors = req.getValidationResult().then(res => {
  //   if (!res.isEmpty()) {
  //     const errors = res.array().map(err => {
  //       console.log("err\n", err)
  //     })
  //   }
  // })

  if (errors) {
    console.log("errors\n", errors)
    res.render('register', {
      errors: errors
    })
  } else {
    // if (password === confirm_password) {
    //   const newUser = new User ({
    //     name: name,
    //     last_name: last_name,
    //     username: username,
    //     email: email,
    //     password: password,
    //     gender: gender
    //   })

    //   User.createUser(newUser, (err, user) => {})
    
    //   req.flash('success_message', 'You are registered and can now log in!');
    //   res.redirect('/login');
    // } else {
    //   req.flash('error_message', 'Your passwords did not match.  Please try again.');
    //   res.redirect('/register')
    // }
  }
})

module.exports = router
