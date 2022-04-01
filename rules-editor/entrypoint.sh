#!/bin/sh

# wait for rhasspy to startup
sleep 3

curl -X POST http://192.168.0.40:12101/api/download-profile
curl -X POST http://192.168.0.40:12101/api/train
curl -X POST http://192.168.0.40:12101/api/restart

serve -s build -p 80

