FROM homeassistant/home-assistant:stable

COPY ./configuration.yaml /tmp/configuration.yaml
COPY ./intents.yaml /tmp/intents.yaml

COPY start.sh /tmp/start.sh
RUN chmod +x /tmp/start.sh

COPY setup.sh /tmp/setup.sh
RUN chmod +x /tmp/setup.sh


CMD ["bash","/tmp/start.sh"]
