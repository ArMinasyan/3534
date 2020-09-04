let route = require('express').Router();
let defender = require('../config/defender');
let fs = require('fs'),
    _ = require('underscore'),
    axios = require('axios').default,
    xml_js = require('xml-js');

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

route.get('/item', defender, function (req, res) {
    let avg_of_starts = 0, avg_of_transfers = 0, avg_of_arc_hours = 0;
    axios.get('https://lib-mtconnect-cartridge.azurewebsites.net/assets').then(result => {

        let data = JSON.parse(xml_js.xml2json(result.data, { compact: true })).
            MTConnectAssets.Assets.HyperthermCartridge;

        let DataArray = [];
        for (let i = 0; i < data.length; i++) {
            avg_of_starts += parseInt(data[i].OperationalData.NumberOfStarts._text);
            avg_of_transfers += parseInt(data[i].OperationalData.NumberOfTransfers._text);
            avg_of_arc_hours += parseInt(data[i].OperationalData.ArcTime._text);

            DataArray.push([
                "",
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

        // let token = jwt.sign({ id: res.locals.id, time: Date.now() }, fs.readFileSync('./keys/Private.key'), { algorithm: "RS512" });
        //console.log(token);
        //res.cookie("token", token, {
        //    sameSite: true,
        //    httpOnly: true,
        //    maxAge: 10 * 36000
        // });
        res.json({
            "data": DataArray,
            "chart": [avg_of_starts, avg_of_transfers, avg_of_arc_hours]
        });

    })

})

module.exports = route;