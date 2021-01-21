const bleno = require('@abandonware/bleno')
const PrimaryService = bleno.PrimaryService;
const Characteristic = bleno.Characteristic;
const Descriptor = bleno.Descriptor;

function start() {
    
    let uuid = '03482753-02f1-4696-87c0-54ed2393869f';
    let name = "BlenoDev";

    const nonceService = new PrimaryService({
        uuid: 'b71806ce-3eb8-4617-ba7e-2117ee1f8c88',
        characteristics: [
            new Characteristic({
                uuid: 'e61f2d91-f2db-4151-ba19-89caed0daa70',
                properties: ['write'],
                // onReadRequest: function (offset, callback) {
                //     callback(Characteristic.RESULT_SUCCESS, Buffer.from('test'));
                // },
                onWriteRequest: function (data, offset, withoutResponse, callback) {
                    console.log(data.toString());
                    callback(Characteristic.RESULT_SUCCESS);
                }
            })
        ]
    })

    bleno.on('stateChange', function (state) {
        if (state === 'poweredOn') {
            console.log('bluetooth powered on');
            bleno.startAdvertising(name, [uuid], function (err) {
                if (err) {
                    console.log(err);
                }
            });
        } else {
            bleno.stopAdvertising();
        }
    });

    bleno.on('advertisingStart', function (err) {
        if (!err) {
            console.log('Started advertising with uuid', uuid);

            console.log('Setting services...');
            bleno.setServices([
                nonceService
            ]);
        }
    });

    bleno.on('disconnect', function (state) {
        console.log('disconnect')
        console.log(state)
    })
}

module.exports.start = start