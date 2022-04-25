## Voice Assistant Builder

Voice Assistants represent an entire different way on how we (humans) can interact with machines. In the past years, [Google Assistant](https://assistant.google.com/), [Siri](https://www.apple.com/siri/) and [Alexa](https://www.alexa.com/) revolutionized the entire field, however, all these devices work "on-line" meaning that they send your voice command to a server, where this data can possibly be stored for further improvements on their models. 

If you, as many others, have [privacy concerns](https://www.theguardian.com/technology/2019/oct/09/alexa-are-you-invading-my-privacy-the-dark-side-of-our-voice-assistants) about what your audio file could be possibly being used for, this projects features a full "off-line" model (all the language understanding and parsing is done in your Intel NUC or a Raspberry Pi) called [Rhasspy](https://rhasspy.readthedocs.io/en/latest/), an easy UI to build the sentences you want to be understandable and integrate with [Home Assistant](https://www.home-assistant.io/).

This post will present how the project was built in the first section, if you want to start right away, [go to the running instructions]().

### This project is part of the balenaLabs Residency Program

My prototype is part of the balenaLabs residency program, where balenistas take on a physical computing project to learn more about balena and various hobbyist or industrial use cases. You can check out all kinds of build logs and notes on [our Forums](https://forums.balena.io/c/show-and-tell/92).

Also, this program isn’t just for balena’s teammates - any community member can join in on the fun. Share your project on the Forums to let us know what you’re working on. We’re here to help!


## Concept

### Features
A voice assistant builder should allow an user to easily define the sentences it wants the voice assistant to listen for and the actions triggered from it. To do it our project mainly connects two other products: [Rhasspy](https://rhasspy.readthedocs.io/en/latest/) and [Home Assistant](https://www.home-assistant.io/). Our UI is very simple and intuictive, on the left side one can define the sentences the voice assistant will understand using a [Rhasspy sentences file](https://rhasspy.readthedocs.io/en/latest/training/#sentencesini) and on the right side you can control both [configurations.yaml](https://www.home-assistant.io/docs/configuration/) and [intents.yaml](https://www.home-assistant.io/integrations/intent_script/) files in order to define the sentence intent action.

| ![ui_example](https://github.com/otaviojacobi/voice-assistant-builder/blob/main/docs/ui_example.png?raw=true) |
|:--:|
|___UI Example___|

### Advanced Features

We also expose the MQTT messages used by Home Assistant and Rhasspy over a WebSocket (http://\<local_ip_address>/mqtt or https://\<device_url>/mqtt for devices with public device url enabled). Full documentation of events emmited and listened by Rhasspy can be found [here](https://rhasspy.readthedocs.io/en/latest/reference/#mqtt-api) and for Home Assistant [here](https://www.home-assistant.io/integrations/mqtt/). This integration can be usefull to capture custom moments of the voice assistant usage, for example, in our UI there is a round display on the top left, which is usually white (listening for wake word), gets blue while it is capturing audio and green or red if understood or not a sentence.

On top of all that, the services are also exposed in the local network (exclusively) and can be modified accordingly. For example, if one wants to change the default wake word from Jarvis to Alexa, you can navigate to http://\<local_ip_address>:12101 and edit the "Wake Word" mechanism of Rhasspy directly.

### Architecture
This projects involves different moving parts and quite a few different local http servers talking between themselves, therefore, using a [reverse-proxy](https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/#:~:text=A%20reverse%20proxy%20is%20a,security%2C%20performance%2C%20and%20reliability.), helps to facilitate out-of-container communication. We use [nginx](https://www.nginx.com/) to do so.

The main services/containers involved are:
 - [balena audio](https://github.com/balenablocks/audio): A block for out-of-the-box audio handling with [PulseAudio](https://www.freedesktop.org/wiki/Software/PulseAudio/) server.
 - [rhasspy](https://rhasspy.readthedocs.io/en/latest/): The voice assistant engine that provide many usefull services.
 - [home assistant](https://www.home-assistant.io/): an open source home automation tool that connect multiple devices.
 - rules editor: The UI developed that allows the customer to easily declare new sentences and directly connect with Home Assistant intents.

Other additional services used to support the above are:
 - [haas-configurator](https://hub.docker.com/r/causticlab/hass-configurator-docker): Easily change configuration files and more in the Home Assistant container
 - [mqtt server](https://mosquitto.org/): A simple mqtt server that allows haas-configurator and home assistant to talk between themselves.
 - [nginx](https://www.nginx.com/): As mentioned before, the only customer facing app that handles all the request forwarding internally.

![voice assistant architecture](https://github.com/otaviojacobi/voice-assistant-builder/blob/main/docs/architecture.png?raw=true)
## Setup

Hardware Required
 - Intel-NUC (recommended) or BalenaFin or Raspberry Pi
 - USB Microphone and Speakers (or an old headset)

In my case I used an USB Headset which contained microphone and loud enough speakers but this can be replaced by any means you have to input/output audio physically.

## Deploying the project 
### Deploy with Balena

[![balena deploy button](https://www.balena.io/deploy.svg)](https://dashboard.balena-cloud.com/deploy?repoUrl=https://github.com/otaviojacobi/voice-assistant-builder)

Once your new fleet is created, follow the default instructions to set up your device (using [balenaEtcher](https://www.balena.io/etcher/) to flash the OS image into the device). Once your device is up, you can navigate to the device summary and see the microservices downloading and starting up. The whole process of downloading the images might take a several minutes.

### Deploy manually (advanced)
If you want to change anything in the code or do follow up development, the best way to do it is by [cloning the project source code](https://github.com/otaviojacobi/voice-assistant-builder) and use [balena CLI](https://github.com/balena-io/balena-cli) to push your changes to your fleet.

## Booting the device for the first time

Once your deployment is done we have to set up two environment variables to allow Rhasspy and Home Assistant to communicate with each other. To set these variables, follow these steps:


1) In a computer within the same network access <local_ip_address>:8123 (the local IP address can be found on the Balena dashboard UI) and create your Home Assistant account
   After creating an account, click on your username on the bottom left, scroll down and click on 'CREATE TOKEN' as in Image 1. Give it a name and copy it. Add it as a Device Variable in balena dashboard, with the name "HASS_ACCESS_TOKEN". 
   At the end you will have something as in Image 2.

| ![image1](https://github.com/otaviojacobi/voice-assistant-builder/blob/main/docs/1.png?raw=true) |
|:--:|
|___Image 1___|

| ![image2](https://github.com/otaviojacobi/voice-assistant-builder/blob/main/docs/2.png?raw=true) |
|:--:|
|___Image 2___|

2) Wait for the containers to restart. This can be really fast or really slow (up to two minutes) depending on the device you are using. Worst scenario, wait for the full two minutes.

3) Navigate to <local_ip_address>:80 or to the public device url (if you toggle it on) and select the "configuration.yaml" file instead of the "intentions.yaml" file. Copy and paste the content bellow and click the "rebuild" button to ensure everything is working.

```yaml
# configuration.yaml
# Loads default set of integrations. Do not remove.
default_config:

# Text to speech
tts:
  - platform: google_translate

intent:
intent_script: !include intents.yaml
```

4) Have fun!

## Using the Voice Assistant Builder
As mentioned previously, the ultimate goal of this project is to reduce friction for people creating their own voice assistant. We do that by providing an easy to use User Interface that connects many pieces (Rhasspy, Home Assistant and others). These services are also accessible independently on your local network (for more see [Advanced Usage]()). This section will focus on what can be done directly in the UI.

### Simple Q&A rule
The first and more basic feature one can execute with our Voice Assistant Builder is the have a fixed audio input mapped to an audio output. You can give it a try with the following examples:

```ini
[QARule]
hello world
hello
hey there
```

```yaml
# intents.yaml
QARule:
  speech:
    text: hello from home assistant
```

### Custom HTTP request
Having integrations with Home Assistant is a good feature, however, one might want to be able to trigger more generic calls. One way to do it is to have [Home Assistant to do a HTTP request for you](https://www.home-assistant.io/integrations/rest_command/) as the example below:

```ini
[MyRule]
do request
```

```yaml
# configurations.yaml
...
rest_command:
  my_custom_request:
    url: "http://example.com"
    method: post
...
```


```yaml
# intents.yaml
MyRule:
  action:
    service: rest_command.my_custom_request
    data:
      field: "example"

  speech:
    text: request done
...
```

## Advanced Usage

### Custom Integration (e.g. Spotify)
The underlying Home Assistant server works normally, therefore to do an integration one may use regular Home Assistant tutorials. For example, to connect spotify, just follow [Home Assistant with Spotify](https://www.home-assistant.io/integrations/spotify/) guide. If the application requires, you can access the Home Assistant server at http://\<local_ip_address>:8123.

### Changing Rhasspy configs
Similar to Home Assistant, you can modify Rhasspy configs directly at http://\<local_ip_address>:12101.
