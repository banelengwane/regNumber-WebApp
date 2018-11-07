let express = require('express');
let exphbs = require('express-handlebars');
let bodyParser = require('body-parser');
let Moment = require('moment');
let flash = require('express-flash');
let session = require('express-session');
let routes = require('./routes/regRoutes');
let pg = require('pg');
let Pool = pg.Pool;

// should we use a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://lsizani@localhost/registrations';

const pool = new Pool({
    connectionString,
    ssl: useSSL
});

let app = express();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

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
