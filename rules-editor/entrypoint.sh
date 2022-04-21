#!/bin/sh


device=$(curl -X GET --header "Content-Type:application/json" "$BALENA_SUPERVISOR_ADDRESS/v1/device?apikey=$BALENA_SUPERVISOR_API_KEY")
device_ip=$( echo $device | jq -r '.ip_address' )

sleep 15

echo "arch is $BALENA_DEVICE_TYPE"

if [ $BALENA_DEVICE_TYPE = "intel-nuc" ]; then
    curl -X POST http://$device_ip:12101/api/profile -H "Content-Type: application/json" -d '{"dialogue":{"system":"rhasspy"},"handle":{"system":"hass"},"intent":{"system":"fsticuffs"},"microphone":{"pyaudio":{"device":"0"},"system":"pyaudio"},"mqtt":{"enabled":"true","host":"'$device_ip'","port":"1883"},"sounds":{"system":"aplay"},"speech_to_text":{"system":"kaldi"},"text_to_speech":{"system":"nanotts"},"wake":{"porcupine":{"keyword_path":"jarvis_linux.ppn"},"system":"porcupine"},"home_assistant":{"access_token":"'$HASS_ACCESS_TOKEN'","url":"http://'$device_ip':8123/"}}';
else
    curl -X POST http://$device_ip:12101/api/profile -H "Content-Type: application/json" -d '{"dialogue":{"system":"rhasspy"},"handle":{"system":"hass"},"intent":{"system":"fsticuffs"},"microphone":{"pyaudio":{"device":"0"},"system":"pyaudio"},"mqtt":{"enabled":"true","host":"'$device_ip'","port":"1883"},"sounds":{"system":"aplay"},"speech_to_text":{"system":"kaldi"},"text_to_speech":{"system":"nanotts"},"wake":{"porcupine":{"keyword_path":"jarvis_raspberry-pi.ppn"},"system":"porcupine"},"home_assistant":{"access_token":"'$HASS_ACCESS_TOKEN'","url":"http://'$device_ip':8123/"}}';
fi

echo "request download profile"
curl -X POST http://$device_ip:12101/api/download-profile

echo "request train"
curl -X POST http://$device_ip:12101/api/train

echo "request restart"
curl -X POST http://$device_ip:12101/api/restart

serve -s build -p 3000

