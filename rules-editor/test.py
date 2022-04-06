import random

from paho.mqtt import client as mqtt_client

broker = '192.168.0.40'
port = 9001
topic = 'hermes/asr/startListening'
client_id = f'python-mqtt-{random.randint(0, 100)}'

def connect_mqtt():
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
        else:
            print("Failed to connect, return code %d\n", rc)

    client = mqtt_client.Client(client_id, 'websockets')
    client.on_connect = on_connect
    client.connect(broker, 1883)
    return client


def subscribe(client):
    def on_message(client, userdata, msg):
        print(f"Received `{msg.payload.decode()}` from `{msg.topic}` topic")

    client.subscribe(topic)
    client.on_message = on_message



client = connect_mqtt()
subscribe(client)
client.loop_forever()



# from websocket import create_connection
# ws = create_connection("ws://192.168.0.40:9001")

# result = ws.recv()

# print(result)