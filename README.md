# Bamboo Log
[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com)


## Introduction
Bamboo is an IoT platfrom that is the product of three teams:

* Nahal Corporation
* Bambil Corporation
* I1820 Platfrom Developers


## Log
**Log** is every data that comes from the sensors, Log component provides following services:

1. Log Collection
2. Log Mediation
3. Log Storing

## Installation
```sh
sudo docker run --rm --name=influx -ti -p 8086:8086 influxdb
```

## Standards
* CBOR: RFC 7049 Concise Binary Object Representation
