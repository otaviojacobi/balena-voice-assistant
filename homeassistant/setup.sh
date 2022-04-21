sleep 3

if [ -e /config/configuration.yaml ]; then
    echo "config file already exists";
else
    cp /tmp/configuration.yaml /config/configuration.yaml
fi

if [ -e /config/intents.yaml ]; then
    echo "intents file already exists";
else
    cp /tmp/intents.yaml /config/intents.yaml;
fi

