let deviceId = msg.payload.end_device_ids.dev_eui;
let value = 0;
let collectionName = 'd3eb315f-e53b-4676-af35-3f6dd62a1308';

if(msg.payload.uplink_message && msg.payload.uplink_message.decoded_payload) {
    if(msg.payload.uplink_message.decoded_payload.bytes &&
        msg.payload.uplink_message.decoded_payload.bytes.length === 18) {
        // http://support.nke-watteco.com/smartplug/
        // https://gist.github.com/fincha/b6484b7931e8f828fdc752b09e4e1e14
        
    }
    else if(msg.payload.uplink_message.decoded_payload.button_value) {
        return {
            topic: `${collectionName}/lora/0/${deviceId}/button_value`,
            payload: {
                val: msg.payload.uplink_message.decoded_payload.button_value,
                ts: Date.now()
            }
        }
    }
    else if(msg.payload.uplink_message.decoded_payload.bytes) {
        value = parseInt(msg.payload.uplink_message.decoded_payload.bytes, 10);
        
        return {
            topic: `${collectionName}/lora/0/${deviceId}/current_state`,
            payload: {
                val: value,
                ts: Date.now()
            }
        }
    } 
    else {
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
