# Bamboo Log
[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com)

![bamboo](https://img.shields.io/badge/bambil-bamboo-orange.svg?style=flat-square)
![Docker Automated buil](https://img.shields.io/docker/automated/ibamboo/log.svg?style=flat-square)
![Docker Build Statu](https://img.shields.io/docker/build/ibamboo/log.svg?style=flat-square)
![ImageLayers Size](https://img.shields.io/imagelayers/image-size/ibamboo/log/latest.svg?style=flat-square)

## Introduction
Bamboo is an IoT platfrom which is the product of three teams:

* Nahal Corporation
* Bambil Corporation
* I1820 Platfrom Developers


## Log
**Log** is an every data which comes from the sensors on specific periods.

## Up and Running
```sh
sudo docker run --rm --name=influx -ti -p 8086:8086 influxdb
```

## Configuration

| Name     | Description |
|:--------:|:------------|
| BAMBOO_DATABASE_NAME | InfluxDB database name |
| BAMBOO_DATABASE_HOST | InfluxDB host address |
| BAMBOO_CONNECTIVITY_HOST | Bamboo connectivity host address |
| BAMBOO_CONNECTIVITY_PORT | Bamboo connectivity port number |
| BAMBOO_HTTP_HOST | HTTP server listening host |
| BAMBOO_HTTP_PORT | HTTP server listening port |
