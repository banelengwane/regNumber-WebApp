const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const Moment = require('moment');
const flash = require('express-flash');
const session = require('express-session');
const routes = require('./routes/regRoutes');
const pg = require('pg');
const Pool = pg.Pool;

// should we use a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:coder123@localhost/registrations';

const pool = new Pool({
    connectionString,
    ssl: useSSL
});

let app = express();

const Registrator = require('./registration_number');
const registrations = Registrator(pool);
const regRoutes = routes(registrations);

// setting up handlebars
let myhbp = exphbs.create({
    defaultLayout: 'main',
    helpers: {
        'time': function () {
            return Moment(this.timestamp).fromNow();
        }
    }
});

app.engine('handlebars', myhbp.engine);
app.set('view engine', 'handlebars');

app.use(session({
    secret: 'This is My long String that is used for session in http',
    resave: false,
    saveUninitialized: true
}));

// initialise the flash middleware
app.use(flash());

// parse application/x-www.form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application-json
app.use(bodyParser.json());

// adding public folder
app.use(express.static('public/'));

app.get('/', regRoutes.one);

app.post('/regs', regRoutes.regs);

app.get('/clear', regRoutes.clear);

app.post('/regs:town', regRoutes.filtering);

let PORT = process.env.PORT || 3016;

app.listen(PORT, function () {
    console.log('App started on Port, ', PORT);
});
