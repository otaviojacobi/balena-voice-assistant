## Voice Assistant Builder

Voice Assistants represent an entirely different way of how we can interact with machines. In the past few years, [Google Assistant](https://assistant.google.com/), [Siri](https://www.apple.com/siri/) and [Alexa](https://www.alexa.com/) have revolutionized the entire field, however, all these devices work "online" meaning that they send your voice commands to a server in the cloud, where this data is stored for further improvements on their voice recognition models.

If you, like many others, have [privacy concerns](https://www.theguardian.com/technology/2019/oct/09/alexa-are-you-invading-my-privacy-the-dark-side-of-our-voice-assistants) about what your audio file could be used for, this projects features a full "off-line" model, [Rhasspy](https://rhasspy.readthedocs.io/en/latest/), where all the language understanding and parsing is done on your Intel NUC or Raspberry Pi. It has a simple  UI to build the sentences you want to be understandable and the project integrates with  [Home Assistant](https://www.home-assistant.io/).

This post will present how the project was built in the first section. If you want to start right away, head to the [go to the running instructions](https://github.com/otaviojacobi/voice-assistant-builder/blob/main/blogPost.md#setup).

### This project is part of the balenaLabs Residency Program

My prototype is a part of the balenaLabs residency program, where balenistas take on a physical computing project to learn more about balena and various hobbyist or industrial use cases. You can check out all kinds of build logs and notes on [our Forums](https://forums.balena.io/c/show-and-tell/92).

Also, this program isn’t just for balena’s teammates - any community member can join in on the fun. Share your project on the Forums to let us know what you’re working on. We’re here to help!


## Concept

### Features
The voice assistant builder should allow users to easily define the sentences they want the voice assistant to listen for and the actions triggered. To do this, our project connects two other products: [Rhasspy](https://rhasspy.readthedocs.io/en/latest/) and [Home Assistant](https://www.home-assistant.io/). Our UI is very simple and intuitive; On the left side, one can define the sentences the voice assistant will understand using a [Rhasspy sentences file](https://rhasspy.readthedocs.io/en/latest/training/#sentencesini), and on the right side, one can control both [configurations.yaml](https://www.home-assistant.io/docs/configuration/) and [intents.yaml](https://www.home-assistant.io/integrations/intent_script/) files in order to define the intended action of a sentence.


| ![ui_example](https://github.com/otaviojacobi/voice-assistant-builder/blob/main/docs/ui_example.png?raw=true) |
|:--:|
|___UI Example___|

### Advanced Features

We also expose the MQTT messages used by Home Assistant and Rhasspy over a WebSocket `http://<local_ip_address>/mqtt` or `https://<device_url>/mqtt` for devices with [public device URLs](https://www.balena.io/docs/learn/develop/runtime/#public-device-urls) enabled). Full documentation of events emitted and listened to can be found [here](https://rhasspy.readthedocs.io/en/latest/reference/#mqtt-api) for Rhasspy and [here](https://www.home-assistant.io/integrations/mqtt/) for Home Assistant. This integration can be useful to capture specific moments of the voice assistant’s usage. For example, in our UI there is a round display on the top left which is usually white (listening for Rhasspy’s “wake word”). It turns blue while capturing audio and green or red depending on whether a sentence was understood or not.

On top of that, the services are also exposed in the local network and can be modified accordingly. For example, if one wants to change the default “wake word” from Jarvis to Alexa, you can navigate to `http://<local_ip_address>:12101` and edit Rhasspy’s "wake word" mechanism directly.


### Architecture

This project involves different moving parts and quite a few different local http servers talking among themselves, therefore, using a [reverse proxy](https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/#:~:text=A%20reverse%20proxy%20is%20a,security%2C%20performance%2C%20and%20reliability.) helps to facilitate out-of-container communication. We use [nginx](https://www.nginx.com/) to do so.

The main services/containers involved are:
 - [balena audio](https://github.com/balenablocks/audio): A block for out-of-the-box audio handling with [PulseAudio](https://www.freedesktop.org/wiki/Software/PulseAudio/) server.
 - [rhasspy](https://rhasspy.readthedocs.io/en/latest/): The voice assistant engine that provides many useful services.
 - [home assistant](https://www.home-assistant.io/): An open source home automation tool that connects multiple devices.
 - rules editor: The UI that allows users to easily declare new sentences and directly connect with Home Assistant intents.

Additional services used to support the above are:
 - [haas-configurator](https://hub.docker.com/r/causticlab/hass-configurator-docker): Easily change configuration files and more in the Home Assistant container.
 - [mqtt server](https://mosquitto.org/): A simple MQTT server that allows haas-configurator and home assistant to talk between themselves.
 - [nginx](https://www.nginx.com/): As mentioned before, the only user-facing app that handles all the request forwarding internally.

![voice assistant architecture](https://github.com/otaviojacobi/voice-assistant-builder/blob/main/docs/architecture.png?raw=true)
## Setup

Hardware Required
 - Intel-NUC (recommended), BalenaFin, or Raspberry Pi
 - USB Microphone and Speakers (or any headset)

In my case I used a USB Headset which contained a microphone and loud enough speakers. This can be replaced by any hardware you have with physical audio I/O.

## Deploying the project 
### Deploy with Balena

[![balena deploy button](https://www.balena.io/deploy.svg)](https://dashboard.balena-cloud.com/deploy?repoUrl=https://github.com/otaviojacobi/voice-assistant-builder)

Once your new fleet is created, follow the default instructions to set up your device (using [balenaEtcher](https://www.balena.io/etcher/) to flash the OS image into the device). Once your device is up, you can navigate to the device summary and see the microservices downloading and starting up. The whole process of downloading the images might take a several minutes.

### Deploy manually (advanced)
If you want to change anything in the code or do follow up development, the best way to do it is by [cloning the project source code](https://github.com/otaviojacobi/voice-assistant-builder) and use [balena CLI](https://github.com/balena-io/balena-cli) to push your changes to your fleet.

## Booting the device for the first time

Once your deployment is done, you should set up two environment variables to allow Rhasspy and Home Assistant to communicate with each other. To set these variables, follow these steps:


1) On a computer within the same network, access `<local_ip_address>:8123` and create your Home Assistant account. The local IP address can be found on the device summary tab of the Balena dashboard. After creating the account, click on your username on the bottom left, scroll down and click on 'CREATE TOKEN' as in the first image below. Give it a name and copy it. Add it as a Device Variable on the balena dashboard, with the name "HASS_ACCESS_TOKEN". At the end you will have something as in the second image below.

| ![image1](https://github.com/otaviojacobi/voice-assistant-builder/blob/main/docs/1.png?raw=true) |
|:--:|
|___Setting up your HASS token___|

| ![image2](https://github.com/otaviojacobi/voice-assistant-builder/blob/main/docs/2.png?raw=true) |
|:--:|
|___Final setup example___|

2) Wait for the containers to restart. This startup process can vary in speed depending on the device you are using. You may have to wait for up to two minutes.

3) Navigate to `<local_ip_address>:80` or to the public device url if toggled on and select the "configuration.yaml" file. Copy and paste the content below and click the "rebuild" button to ensure everything is working.

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

_Note: the engine used for TTS (text-to-speech) when using Home Assistant is google_translate which might send some data to google servers (which we didn’t want!). The Rhasspy model is still fully offline, but currently, for Home Assistant I did not find other tts platforms with an easy setup._

## Using the Voice Assistant Builder
As mentioned previously, the ultimate goal of this project is to reduce friction for people creating their own voice assistant. We do that by providing an easy to use User Interface that connects many pieces (Rhasspy, Home Assistant and others). These services are also accessible independently on your local network (for more see [Advanced Usage](https://github.com/otaviojacobi/voice-assistant-builder/blob/main/blogPost.md#advanced-usage)). This section will focus on what can be done directly in the UI.

### Simple Q&A rule
A basic first feature you can execute with the Voice Assistant Builder is having a fixed audio input mapped to an audio output. Try it out with the following example:

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
Having integrations with Home Assistant is a good feature, but you might want to trigger more generic calls. One way to do it is to have [Home Assistant to do a HTTP request for you](https://www.home-assistant.io/integrations/rest_command/) as in the example below:

```ini
[RenewLibraryLoans]
please renew my library loans
 
# configurations.yaml
...
rest_command:
  http_request_to_renew_loans:
    url: "http://library.com/renew"
    method: post
...
```


```yaml
# intents.yaml
RenewLibraryLoans:
  action:
    service: rest_command.http_request_to_renew_loans
    data:
      book: "my awesome book"
 
  speech:
    text: your book was renewed
...
```

## Advanced Usage

### Custom Integration (e.g. Spotify)
The underlying Home Assistant server works normally, so you may use regular Home Assistant tutorials to set up an integration. For example, to connect with Spotify, just follow the [Home Assistant with Spotify](https://www.home-assistant.io/integrations/spotify/) guide. If the application requires, you can access the Home Assistant server at `http://<local_ip_address>:8123`.

### Changing Rhasspy configs
Similar to Home Assistant, you can modify Rhasspy configs directly at `http://<local_ip_address>:12101`.


## Last Considerations

This project was tested mainly using a USB audio device for I/O, so using the audio jack I/O might require different configurations in the balena audio block and/or Rhasspy. Also, I used an Intel NUC for most of the development, and while I ensured functionality with the balenaFin, it was much slower. Specifically, when retraining after defining new sentences, the balenaFin would take more than 30s, compared to the <1s on the Intel NUC.
