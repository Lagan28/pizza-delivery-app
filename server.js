require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const ejs = require('ejs')
const path = require('path')
const flash = require('express-flash')
const expressLayout = require('express-ejs-layouts')
const session = require('express-session')
const MongoDbStore = require('connect-mongo')
const passport = require('passport')

const PORT = process.env.PORT || 3000

//Database Connection
const url = 'mongodb://localhost/pizza';
mongoose.connect(url, {useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology: true, useFindAndModify:true});
const connection = mongoose.connection;
connection.once('open',()=>{
    console.log('DB Connected!');
}).catch(err=>{
    console.log('Connection to DB failed')
})

//session store
/*let mongoStore = new MongoDbStore({
    mongooseConnection: connection,
    collection: 'sessions'
})*/

//config for express-session
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
        client: connection.getClient()
    }),
    saveUninitialized: false,
    cookie: {maxAge: 1000*60*60*24} //time in ms, age of cookie, here 24 hours
}))

//Passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

//Assets
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false})) //for data visibility on the server database (here, used for the register functionality)
app.use(express.json())

//global middleware
app.use((req,res,next)=>{
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

//set Template Engine
app.use(expressLayout)
app.set('views', path.join(__dirname,'/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web')(app)

app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`)
})