## Voice Assistant Builder

Voice Assistants represent an entirely different way that we humans can interact with machines. In the past years, [Google Assistant](https://assistant.google.com/), [Siri](https://www.apple.com/siri/) and [Alexa](https://www.alexa.com/) revolutionized the entire field, however, all these devices work "on-line" meaning that they send your voice command to a server, where this data can possibly be stored for further improvements on their models. 

If like many others, you have [privacy concerns](https://www.theguardian.com/technology/2019/oct/09/alexa-are-you-invading-my-privacy-the-dark-side-of-our-voice-assistants) about what your audio file could possibly be being used for, this projects features a fully "off-line" model called [Rhasspy](https://rhasspy.readthedocs.io/en/latest/). All the language understanding and parsing is done on your Intel NUC or Raspberry Pi. The Voice Assistant Builder is a friendly UI for building the sentences you want to make understandable for integration with [Home Assistant](https://www.home-assistant.io/).

In the following section, this post will describe how the project was built. However, if you want to get started right away, you can skip to the [running instructions](#setup).

> #### This project is part of the balenaLabs Residency Program
> 
> My prototype is part of the balenaLabs residency program, where balenistas take on a physical computing project to learn more about balena and various hobbyist or industrial use cases. You can check out all kinds of build logs and notes on [our Forums](https://forums.balena.io/c/show-and-tell/92).
> 
> Also, this program isn’t just for balena’s teammates - any community member can join in on the fun. Share your project on the Forums to let us know what you’re working on. We’re here to help!


## Concept

### Features
Any voice assistant builder should allow a user to easily define the sentences it wants the voice assistant to listen for and the actions triggered by the voice assistant. To do it our project connects two other products: [Rhasspy](https://rhasspy.readthedocs.io/en/latest/) and [Home Assistant](https://www.home-assistant.io/). Our UI is very simple and intuitive. As shown below, on the left side one can define the sentences the voice assistant will understand using a [Rhasspy sentences file](https://rhasspy.readthedocs.io/en/latest/training/#sentencesini) and on the right side you can control both [configurations.yaml](https://www.home-assistant.io/docs/configuration/) and [intents.yaml](https://www.home-assistant.io/integrations/intent_script/) files in order to define the sentence intent actions.

| ![ui_example](https://github.com/otaviojacobi/voice-assistant-builder/blob/main/docs/ui_example.png?raw=true) |
|:--:|
|___UI Example___|

### Advanced Features

We also expose the MQTT messages used by Home Assistant and Rhasspy over a WebSocket (http://\<local_ip_address>/mqtt or https://\<device_url>/mqtt for devices with public device url enabled). The full documentation of Rhasspy's events can be found [here](https://rhasspy.readthedocs.io/en/latest/reference/#mqtt-api) and those for Home Assistant are [here](https://www.home-assistant.io/integrations/mqtt/). This integration can be used to customize what moments are captured by the assistant. For example, in our UI there is a circular icon on the top left, which is usually white when the assistant is listening for a wake word. The icon gets blue while it is capturing audio and green or red depending on whether or not it understood the audio as a sentence.

In addition, the individual services are exposed exclusively in the local network and can be modified accordingly. For example, if one wants to change the default wake word from Jarvis to Alexa, you can navigate to http://\<local_ip_address>:12101 and edit Rhasspy's "Wake Word" mechanism  directly.

### Architecture
This projects involves different moving parts and quite a few different local http servers talking amongst themselves. Therefore, we are using [nginx](https://www.nginx.com/) as a [reverse-proxy](https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/#:~:text=A%20reverse%20proxy%20is%20a,security%2C%20performance%2C%20and%20reliability.) helps with out-of-container communication.

The main services/containers involved are:
 - [balena audio](https://github.com/balenablocks/audio): A block for out-of-the-box audio handling with [PulseAudio](https://www.freedesktop.org/wiki/Software/PulseAudio/) server.
 - [Rhasspy](https://rhasspy.readthedocs.io/en/latest/): The voice assistant engine that provides many useful services.
 - [Home Assistant](https://www.home-assistant.io/): An open source home automation tool that connects multiple devices.
 - Our rules editor: The UI we developed to allow the customer to easily declare new sentences and directly connect them with Home Assistant intents.

Other additional services used to support the above are:
 - [haas-configurator](https://hub.docker.com/r/causticlab/hass-configurator-docker): Used to easily change configuration files and more in the Home Assistant container
 - [mqtt server](https://mosquitto.org/): A simple mqtt server that allows haas-configurator and home assistant to talk between themselves.
 - [nginx](https://www.nginx.com/): As mentioned before, the only customer facing service that handles all the request forwarding internally.

![voice assistant architecture](https://github.com/otaviojacobi/voice-assistant-builder/blob/main/docs/architecture.png?raw=true)

## Setup

Hardware Required:
 - Intel-NUC (recommended), BalenaFin or Raspberry Pi
 - Microphone and Speakers (or an old headset)

> See also [Final Considerations](#final-considerations) section below

## Deploying the project 
### Deploy with Balena

[![balena deploy button](https://www.balena.io/deploy.svg)](https://dashboard.balena-cloud.com/deploy?repoUrl=https://github.com/otaviojacobi/voice-assistant-builder)

Once your new fleet is created, follow the default instructions to set up your device (using [balenaEtcher](https://www.balena.io/etcher/) to flash the OS image into the device). Once your device is up, you can navigate to the device summary and see the microservices downloading and starting up. The whole process of downloading the images might take a several minutes.

### Deploy manually (advanced)
If you want to change anything in the code or do any extra development, the best way to do it is by [cloning the project source code](https://github.com/otaviojacobi/voice-assistant-builder) and use [balena CLI](https://github.com/balena-io/balena-cli) to push your changes to your fleet.

## Booting the device for the first time

Once your deployment is done, we have to set up one environment variable to allow Rhasspy and Home Assistant to communicate with each other. To set this variable, follow these steps:


1) In a computer within the same network access `http://<local_ip_address>:8123` and create your Home Assistant account (the `local_ip_address` address can be found on the Balena dashboard UI).
   After creating an account, click on your username on the bottom left, scroll down and click on 'CREATE TOKEN' as in Image 1. Give it a name and copy it. Add it as a Device Variable in balena dashboard, with the name "HASS_ACCESS_TOKEN". 
   At the end, you should have something like what is shown in Image 2.

| ![image1](https://github.com/otaviojacobi/voice-assistant-builder/blob/main/docs/1.png?raw=true) |
|:--:|
|___Image 1___|

| ![image2](https://github.com/otaviojacobi/voice-assistant-builder/blob/main/docs/2.png?raw=true) |
|:--:|
|___Image 2___|

2) Wait for the containers to restart. This should take no more than two minutes but could be faster if you are using a more performant device. 

3) Navigate to `http://<local_ip_address>` or to the public device url ([if enabled](https://www.balena.io/docs/learn/manage/actions/#enable-public-device-url)) and select the "configuration.yaml" file instead of the "intentions.yaml" file. Copy and paste the content bellow and click the "rebuild" button to ensure everything is working.

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
As mentioned previously, the ultimate goal of this project is to reduce friction for people creating their own voice assistant. We do that by providing an easy to use User Interface that connects many pieces (Rhasspy, Home Assistant and others). These services are also accessible independently on your local network (for more see [Advanced Usage](#advanced-usage)). We will now describe what can be done directly in the UI.

### Simple Q&A rule
The first and most basic assistant one can build is one that simply maps a fixed audio input to an audio output. You can give it a try with the following examples:

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

So after waking the assistant, if the user says either "hello world", "hello" or "hey there", the assistant will simply respond with "hello from home assistant".

### Custom HTTP request
Having integrations with Home Assistant is a great feature, however, one might want to be able to trigger more arbitrary functionality. One way to achieve this is to have [Home Assistant to send an HTTP request for you](https://www.home-assistant.io/integrations/rest_command/) as in the example below:

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
    text: "Request done!"
...
```

So in this case, if the user says, "do request" to the assistant, it should send and HTTP POST to http://example.com with `{"field": "example"}` as its body. They assistant will subsequently say "Request done!" when the http request is complete.

## Advanced Usage

### Custom Integration (e.g. Spotify)
The underlying Home Assistant server works normally, therefore to do an integration one may use regular Home Assistant tutorials. For example, to connect spotify, just follow [Home Assistant with Spotify](https://www.home-assistant.io/integrations/spotify/) guide. If the application requires you to access the Home Assistant server you can do so at http://\<local_ip_address>:8123.

### Changing Rhasspy configs
Similar to Home Assistant, you can modify Rhasspy configs directly at http://\<local_ip_address>:12101.


## Final Considerations

This project was tested mainly using USB audio input/output. I am confident this can alternatively be replaced by the use of a regular/analogue audio jack. However, this might require some different configurations in the balena audio block and/or Rhasspy. 

In addition, for most of the development I used an intel NUC and although it was tested and I ensured it was working on a Fin Board too, it was much slower. Most noticeably, retraining after defining new sentences (e.g. pressing the build button) often took more than 30s on the Fin while on the NUC it was very fast (< 1s).
