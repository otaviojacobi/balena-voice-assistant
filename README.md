# balena-voice-assistant

### What is this project?
This application is a fully balena hosted voice assistant integrating with [Home Assistant](https://github.com/balenalabs-incubator/balena-homeassistant). It provides an intuitive UI that allows the end-user to easily connect pre-defined sentences to mapped actions (or [intents](https://www.home-assistant.io/integrations/intent_script/)) in Home Assistant.

### Why this project and what does it require?
Previous projects had integrated Alexa or any other voice assistant with Home Assistant, however if you have privacy concerns or simply do not want to pay for a voice assistant, this projects uses an [Intel Nuc](https://www.intel.com.br/content/www/br/pt/products/details/nuc.html) (that could easily be switched to a [Rasp Pi](https://www.raspberrypi.org/)) running the open-source and fully offline [Rhasspy](https://rhasspy.readthedocs.io/en/latest/) server. The only additional hardware required is some way to input/output audio (such as an headset).

# Building and Running locally
This project is built with docker and docker compose. To build it, run:

```
docker-compose build
```

and to run:

```
docker-compose up
```

# Project Architecture
This projects involves different moving parts and quite a few different local http servers talking between themselves, therefore, one good practice is to have a [reverse-proxy](https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/#:~:text=A%20reverse%20proxy%20is%20a,security%2C%20performance%2C%20and%20reliability.), in this project, we use [nginx](https://www.nginx.com/) to do so.

The main services/containers involved are:
 - [balena audio](https://github.com/balenablocks/audio): A block for out-of-the-box audio handling with [PulseAudio](https://www.freedesktop.org/wiki/Software/PulseAudio/) server.
 - [rhasspy](https://rhasspy.readthedocs.io/en/latest/): The voice assistant engine that provide many usefull services.
 - [home assistant](https://www.home-assistant.io/): an open source home automation tool that connect multiple devices.
 - rules editor: The UI developed that allows the customer to easily declare new sentences and directly connect with Home Assistant intents.

Other additional services used to support the above are:
 - [haas-configurator](https://hub.docker.com/r/causticlab/hass-configurator-docker): Easily change configuration files and more in the Home Assistant container
 - [mqtt server](https://mosquitto.org/): A simple mqtt server that allows haas-configurator and home assistant to talk between themselves.
 - [nginx](https://www.nginx.com/): As mentioned before, the only customer facing app that handles all the request forwarding internally.

![voice assistant architecture](https://github.com/otaviojacobi/balena-voice-assistant/blob/main/docs/balena-voice-assistant-architecture.png?raw=true)
