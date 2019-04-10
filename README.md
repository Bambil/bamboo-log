# Bamboo Log

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com)

![bamboo](https://img.shields.io/badge/bambil-bamboo-orange.svg?style=flat-square)
![npm](https://img.shields.io/npm/v/@ibamboo/log?style=flat-square)

## Introduction

Bamboo is an IoT platfrom which is the product of three teams:

* Nahal Corporation
* Bambil Corporation
* I1820 Platfrom Developers

## Log

Log is any incoming data from sensors, Expected to be received periodically.

```
+------+    +-----------+    +----+
| Main | -> | BambooLog | -> | DB |
+------+    +-----------+    +----+
```

## Up and Running

This component depends on influx db as permanent storage for logs. you can
use docker version of this database with following command:

```sh
sudo docker run --rm --name=influx -ti -p 8086:8086 influxdb
```

After running influx you can run docker version of log component with
env based configurations, or you can use plain version of log component
with file based configurations.

## Configuration

| Environment Name | JSON Name | Description |
|:----------------:|:---------:|:------------|
| BAMBOO_DATABASE_NAME | `database.name` | InfluxDB database name |
| BAMBOO_DATABASE_HOST | `database.host` | InfluxDB host address |
| BAMBOO_CONNECTIVITY_HOST | `connectivity.host` | Bamboo connectivity host address |
| BAMBOO_CONNECTIVITY_PORT | `connectivity.port` | Bamboo connectivity port number |
| BAMBOO_HTTP_HOST | `http.host` | HTTP server listening host |
| BAMBOO_HTTP_PORT | `http.port` | HTTP server listening port |
| BAMBOO_WINSTOND_HOST | `winstond.host` | Winstond host address |
| BAMBOO_WINSTOND_PORT | `winstond.port` | Winstond port number |
