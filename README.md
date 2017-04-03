# Hot Potato Service

A variation on the children's classic game, [Hot Potato](https://en.wikipedia.org/wiki/Hot_potato_(game)). Adopted as a distributed computing example of network messaging using [Hydra](https://github.com/flywheelsports/hydra).

This is an update on an [earlier version](https://github.com/cjus/hydra-hpp). This version, is designed for use in Docker containers and in a Docker swarm.

## Configuration

This service expects a local instance of Redis. To change the location of Redis update the `config/config.json` file:

```shell
{
  "environment": "development",
  "hydra": {
    "serviceName": "hpp-service",
    "serviceIP": "",
    "servicePort": 6666,
    "serviceType": "game",
    "serviceDescription": "Plays hot potato game",
    "redis": {
      "url": "redis://127.0.0.1:6379/15"
    }
  }
}
```

## Pre-installation

It's recommended that you use [NVM](https://github.com/creationix/nvm) be used to manage NodeJS versions. The project includes a .nvmrc file which specifies NodeJS 6.2.1 - but you can update that to a newer version.

Again, you don't need to use NVM it's just recommended. ;-)

## Installation

```javascript
$ npm install
```

## Running

```shell
$ npm start
```

## Using in a Docker container

To build as a container:

```shell
$ docker build --no-cache=true -t cjus/hpp-service:0.0.1 .
```

> Don't forget the trailing period above.

When using as a docker container you need to update the service's config file since the running container will have a different IP address from your host. So Redis won't be found inside the container!

There are a few ways to address this concern.  The first method is to simply build the container with the hardcoded config entry for your Redis server.

Another option is to specify a DNS entry in your config file which maps to your Redis server. See the `redislocation` entry below.

```shell
{
  "environment": "development",
  "hydra": {
    "serviceName": "hpp-service",
    "serviceIP": "",
    "servicePort": 6666,
    "serviceType": "game",
    "serviceDescription": "Plays hot potato game",
    "redis": {
      "url": "redis://redislocation/15"
    }
  }
}
```

Next rebuild the container with the config above and then you can later run it using:

```shell
$ docker run -it -d -p 6666:6666 \
  --name hpp-service \
  --add-host redislocation:192.168.1.186 \
  --workdir=/usr/src/app \
  cjus/hpp-service:0.0.1
```

Yet, another method is to run the container with a mapped volume. In the example, the local project folder `~/dev/hpp-service/config` maps over the container's built-in `/usr/src/app/config` folder.  So the running container will use the config file you specified in your project folder. That allows you to leave the config.json file in the container and override it with one outside the container.

```shell
$ docker run -it -d -p 6666:6666 \
  --name hpp-service \
  --workdir=/usr/src/app \
  -v ~/dev/hpp-service/config:/usr/src/app/config \
  cjus/hpp-service:0.0.1
```
