const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const db = require('./db')

module.exports = session({
    store: new pgSession({
        pool: db
    }),
    secret: 'myfoodfy',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 3600 * 1000   //30 dias
    }
})