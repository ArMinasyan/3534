

let express = require('express'),
    app = express();

let bodyparser = require('body-parser'),
    _ = require('underscore'),
    axios = require('axios').default,
    xml_js = require('xml-js'),
    cors = require('cors'),
    path = require('path');


app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use(express.static(path.join(__dirname, 'public')));

let WhiteList = ['http://127.0.0.1:8000'];

app.use(cors({
    origin: function (origin, cb) {
        if (WhiteList.indexOf(origin) !== -1 || !origin) cb(null, true);
        else cb('CORS Blocked', false);
    }
}));


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




app.get('/item', function (req, res) {
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
                parseInt(data[i].OperationalData.EndOfLifeEventCount._text),
                data[i].OperationalData.Faults._attributes.faultCount > 0 ? FaulttoStringArray(data[i].OperationalData.Faults.Fault) : '-',
                data[i].ManufacturingData.CartridgeType._text,
                data[i]._attributes.deviceUuid,
                data[i].ManufacturingData.PartNumberRevision._text,
                data[i].ManufacturingData.CartridgeDesignRevision._text,

            ])

            // DataArray.push([

            //-     data[i]._attributes.manufacturer, 
            //-     data[i]._attributes.serialNumber,
            //-     new Date(data[i]._attributes.timestamp),
            //-     data[i]._attributes.deviceUuid,
            //-     data[i]._attributes.assetId,
            //     data[i].ManufacturingData.Description._text,
            //-     data[i].ManufacturingData.UUID._text,
            //-     data[i].ManufacturingData.PartNumber._text, 
            //-     data[i].ManufacturingData.PartNumberRevision._text,
            //-     data[i].ManufacturingData.CartridgeType._text,
            //-     data[i].ManufacturingData.CartridgeDesignRevision._text,
            //-     data[i].ManufacturingData.ManufacturingDate._text,
            //-     data[i].ManufacturingData.ManufacturingTestStatus._text,
            //      data[i].OperationalData.Description._text,
            //-     parseInt(data[i].OperationalData.ArcTime._text),
            //-     parseInt(data[i].OperationalData.PilotTime._text),
            //-     parseInt(data[i].OperationalData.TransferTime._text),
            //-     parseInt(data[i].OperationalData.NumberOfStarts._text),
            //-     parseInt(data[i].OperationalData.NumberOfTransfers._text),
            //-     data[i].OperationalData.Faults._attributes.faultCount > 0 ? FaulttoStringArray(data[i].OperationalData.Faults.Fault) : '',
            //-     parseInt(data[i].OperationalData.EndOfLifeEventCount._text)
            // ])
            //  DataArray.push(temp);
            //temp.splice(0);
            // temp.splice(0);
        }

        // console.log(DataArray);
        res.json({
            "data": DataArray,
            "chart": [avg_of_starts, avg_of_transfers, avg_of_arc_hours]
        });

        //fs.writeFileSync('./test.txt', DataArray);
        // console.log(DataArray);
    })

})



app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'DataReplicated.html'));
})
app.get('/:name', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', req.params.name));
})



//Login and Reg. Routes
let { body, validationResult } = require('express-validator');
let user = require('./models/user');
let bcrypt = require('bcrypt');
let mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/3534", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
let validation = [
    body('email').trim().not().isEmpty().withMessage('Email field is required').isEmail().withMessage('Enter valid email address'),
    body('password').trim().not().isEmpty().withMessage('Password field is requires'),
    body('confirm_password').trim().not().isEmpty().withMessage('Confirm password field is required').custom((val, { req }) => {
        if (val != req.body.password) throw new Error('Password confirmation does not match password');
        else return true
    })
]

app.post('/registration', validation, function (req, res) {
    let vr = validationResult(req);
    if (!vr.isEmpty()) res.send(vr.errors[0]);
    else {
        user.findOne({ email: req.body.email }, function (err, result) {
            if (result) res.json({ "msg": "Username already exist" }); else {
                let User = new user({
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, 10),
                });
                User.save(function (err, doc) {
                    if (!err && doc) res.json({ "msg": "Account successfuly created" });
                })
            }

        })
    }
})

app.listen(process.env.PORT || 8000, function () {
    console.log('Start...');
})