#!/bin/bash

read -r -d '' config << EOF
{
  "mqtt": {
    "ip": "$MQTT_IP",
    "port": "$MQTT_PORT"
  },
  "influx": {
    "host": "$INFLUX_HOST",
    "database": "$INFLUX_DATABASE"
  },
  "cluster": {
    "name": "$CLUSTER_NAME"
  }
}
EOF

echo $config > config/default.json