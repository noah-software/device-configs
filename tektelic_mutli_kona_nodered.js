let deviceId = msg.payload.end_device_ids.dev_eui;
let value = 0;
let collectionName = '6189ac52-21c1-47d2-9c1f-e29e514b006f';

if(msg.payload.uplink_message && msg.payload.uplink_message.decoded_payload) {
    if(msg.payload.uplink_message.decoded_payload.bytes &&
        msg.payload.uplink_message.decoded_payload.bytes.length === 18) {
        // http://support.nke-watteco.com/smartplug/
        // https://gist.github.com/fincha/b6484b7931e8f828fdc752b09e4e1e14
        
    }
    else if('bytes' in msg.payload.uplink_message.decoded_payload
        && 'acceleration_x' in msg.payload.uplink_message.decoded_payload) {
        
        // tektelic devices (move, humidity, etc)
        Object.keys(msg.payload.uplink_message.decoded_payload).forEach(key => {
            if(key === "humidity" || key === "moisture"
                 || key === "temperature" || key === "closed") {
                node.send({
                    topic: `${collectionName}/lora/0/${deviceId}/${key}`,
                    payload: {
                        val: msg.payload.uplink_message.decoded_payload[key],
                        ts: Date.now()
                    }
                })
            }
            
            
        });
    }
    // TODOL what kind of device is this???
    else if(msg.payload.uplink_message.decoded_payload.bytes) {
        value = parseInt(msg.payload.uplink_message.decoded_payload.bytes, 10);
        
        return {
            topic: `${collectionName}/lora/0/${deviceId}/current_state`,
            payload: {
                val: value,
                ts: Date.now()
            }
        }
    } else {
        // elsys
        // steckdose (custom formatter)
        Object.keys(msg.payload.uplink_message.decoded_payload).forEach(key => {
            if(key === "data" || key === "zclheader") {
                return;
            }
            
            node.send({
                topic: `${collectionName}/lora/0/${deviceId}/${key}`,
                payload: {
                    val: msg.payload.uplink_message.decoded_payload[key],
                    ts: Date.now()
                }
            })
        });
        
    }
}
