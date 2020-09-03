

let express = require('express'),
    app = express();

let bodyparser = require('body-parser'),
    cookieparser = require('cookie-parser'),
    _ = require('underscore'),
    axios = require('axios').default,
    xml_js = require('xml-js'),
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

let WhiteList = ['http://127.0.0.1:8000'];

// app.use(cors({
//     origin: function (origin, cb) {
//         if (WhiteList.indexOf(origin) !== -1 || !origin) cb(null, true);
//         else cb('CORS Blocked', false);

//     }
// }));


let FaulttoStringArray = (fault) => {
    if (fault.length > 0) return _.pluck(fault, '_text').join(', ');
    else return fault._text;
}


let GetObjectValues = (obj, temp = {}) => {
    for (let property in obj) {
        if (obj.hasOwnProperty(property)) {
            if (typeof obj[property] === "object") GetObjectValues(obj[property], temp);
            else temp[property] = obj[property];
        }
    }
}


let defender = require('./config/defender');

app.get('/item', defender, function (req, res) {
    let avg_of_starts = 0, avg_of_transfers = 0, avg_of_arc_hours = 0;
    axios.get('https://lib-mtconnect-cartridge.azurewebsites.net/assets').then(result => {

        let data = JSON.parse(xml_js.xml2json(result.data, { compact: true })).
            MTConnectAssets.Assets.HyperthermCartridge;

        let DataArray = [];
        for (let i = 0; i < data.length; i++) {
            avg_of_starts += parseInt(data[i].OperationalData.NumberOfStarts._text);
            avg_of_transfers += parseInt(data[i].OperationalData.NumberOfTransfers._text);
            avg_of_arc_hours += parseInt(data[i].OperationalData.ArcTime._text);

            // Manufacturer	
            // Asset ID	
            // UUID	
            // Number Of Starts	
            // Number Of Transfers	
            // Manufacturing Date	
            // Part Number	
            // Timestamp

            DataArray.push([
                data[i]._attributes.manufacturer,
                data[i]._attributes.assetId,

                data[i].ManufacturingData.UUID._text,
                parseInt(data[i].OperationalData.EndOfLifeEventCount._text),
                parseInt(data[i].OperationalData.ArcTime._text),
                parseInt(data[i].OperationalData.PilotTime._text),
                parseInt(data[i].OperationalData.TransferTime._text),
                parseInt(data[i].OperationalData.NumberOfStarts._text),
                parseInt(data[i].OperationalData.NumberOfTransfers._text),
                data[i].ManufacturingData.ManufacturingDate._text,
                data[i].ManufacturingData.PartNumber._text,
                new Date(data[i]._attributes.timestamp),
                data[i]._attributes.serialNumber,
                data[i].ManufacturingData.ManufacturingTestStatus._text,

                data[i].OperationalData.Faults._attributes.faultCount > 0 ? FaulttoStringArray(data[i].OperationalData.Faults.Fault) : '-',
                data[i].ManufacturingData.CartridgeType._text,
                data[i]._attributes.deviceUuid,
                data[i].ManufacturingData.PartNumberRevision._text,
                data[i].ManufacturingData.CartridgeDesignRevision._text,

            ])
        }
        res.json({
            "data": DataArray,
            "chart": [avg_of_starts, avg_of_transfers, avg_of_arc_hours]
        });

    })

})



// app.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname, 'views', 'Account.html'));
// })

app.get('/:name', defender, function (req, res) {
    if (req.params.name == 'data') res.sendFile(path.join(__dirname, 'views', 'DataReplicated.html'));
    else res.sendFile(path.join(__dirname, 'views', req.params.name));
})

app.get('/', function (req, res) {
    if (req.cookies.token) res.redirect('/data');
    res.sendFile(path.join(__dirname, 'views', 'Account.html'));
})



app.get('/data', defender, function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'DataReplicated.html'));
})

//Login and Reg. Routes



let mongoose = require('mongoose');


mongoose.connect(config.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let sign_in = require('./routes/sign_in'),
    sign_up = require('./routes/sign_up'),
    logout = require('./routes/logout');

app.use([sign_in, sign_up, logout]);




app.listen(process.env.PORT || 8000, function () {
    console.log('Start...');
})