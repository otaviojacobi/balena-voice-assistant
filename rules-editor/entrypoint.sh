#!/bin/sh


device=$(curl -X GET --header "Content-Type:application/json" "$BALENA_SUPERVISOR_ADDRESS/v1/device?apikey=$BALENA_SUPERVISOR_API_KEY")
device_ip=$( echo $device | jq -r '.ip_address' )

defaultIntent=$(cat defaultSentences.yaml)

curl -X POST http://$device_ip:12101/api/profile -H "Content-Type: application/json" -d '{"dialogue":{"system":"rhasspy"},"handle":{"system":"hass"},"intent":{"system":"fsticuffs"},"microphone":{"pyaudio":{"device":"0"},"system":"pyaudio"},"mqtt":{"enabled":"true","host":"'$LOCAL_IP_ADDRESS'","port":"1883"},"sounds":{"system":"aplay"},"speech_to_text":{"system":"kaldi"},"text_to_speech":{"system":"nanotts"},"wake":{"porcupine":{"keyword_path":"jarvis_linux.ppn"},"system":"porcupine"},"home_assistant":{"access_token":"'$HASS_ACCESS_TOKEN'","url":"http://'$LOCAL_IP_ADDRESS':8123/"}}'
curl -X POST http://$device_ip:12101/api/download-profile
curl -X POST http://$device_ip:12101/api/train
curl -X POST http://$device_ip:12101/api/restart

serve -s build -p 3000

