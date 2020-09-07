

let express = require('express'),
    app = express();

let bodyparser = require('body-parser'),
    cookieparser = require('cookie-parser'),


    cors = require('cors'),
    path = require('path');


app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cookieparser());
app.use(express.static(path.join(__dirname, 'public')));

let config;
if (process.env.NODE_ENV.trim() == 'development') {
    config = require('./config.json').development;

} else config = require('./config.json').production

require('dotenv').config();

let WhiteList = ['http://127.0.0.1:8000'];

// app.use(cors({
//     origin: function (origin, cb) {
//         if (WhiteList.indexOf(origin) !== -1 || !origin) cb(null, true);
//         else cb('CORS Blocked', false);

//     }
// }));



let mongoose = require('mongoose');


mongoose.connect(config.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let sign_in = require('./routes/sign_in'),
    sign_up = require('./routes/sign_up'),
    logout = require('./routes/logout'),
    item = require('./routes/item'),
    confirm = require('./routes/confirm'),
    main = require('./routes/main');

app.use([sign_in, sign_up, logout, item, main, confirm]);



app.listen(process.env.PORT || 8000, function () {
    console.log('Start...');
})