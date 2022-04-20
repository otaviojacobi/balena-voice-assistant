#!/bin/bash


sh /tmp/setup.sh &
python -m homeassistant --config /config
