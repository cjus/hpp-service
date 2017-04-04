# Hot Potato Service

A variation on the children's classic game, Hot Potato. Adopted as a distributed computing example of network messaging using Hydra.

This is an update of an earlier version, however, this version is designed for use in Docker containers and in a Docker swarm.

To learn more about Hydra messaging see: Building a Microservice Example Game with Distributed Message.

This microservice expects to find other peer microservices (that is other hpp-service(s)) on the same network. The game begins when you access the `/v1/hpp/startgame` endpoint for anyone of the peer services. That will start the Hot Potato game where the current instance sends a hot potato (JSON) message to one of the available peers. The peer that receives the message will in-turn send the message to another peer. The peer holding the hot potato message upon the end of the game will be declared the loser.

When accessing the start game endpoint, prepare to wait about 15-seconds for a result - as the game places in the background. In the end, you should see a response similar to:

```javascript
{
  "statusCode": 200,
  "statusMessage": "OK",
  "statusDescription": "Request succeeded without error",
  "result": {
    "gameLog": [
      "Game starting in: 3 seconds",
      "Game starting in: 2 seconds",
      "Game starting in: 1 seconds",
      "Game starting in: 0 seconds",
      "Sending hot potato...",
      "[f391516aef69e684988ab1be11cf032a]: received hot potato.",
      "[f301a27188a483829823b5059a1a4f9c]: received hot potato.",
      "[d9e2a5799cd773e3b0872befc9ec06a4]: received hot potato.",
      "[f391516aef69e684988ab1be11cf032a]: received hot potato.",
      "Game over, f301a27188a483829823b5059a1a4f9c lost!"
    ]
  }
}
```

## Configuration

This service expects a local instance of Redis. To change the location of Redis update the config/config.json file:

```javascript
{
  "environment": "development",
  "hydra": {
    "serviceName": "hpp-service",
    "serviceIP": "",
    "servicePort": 9000,
    "serviceType": "game",
    "serviceDescription": "Plays hot potato game",
    "redis": {
      "url": "redis://127.0.0.1:6379/15"
    }
  }
}
```

## Pre-installation

It's recommended that you use NVM be used to manage NodeJS versions. The project includes a .nvmrc file which specifies NodeJS 6.2.1 - but you can update that to a newer version.

Again, you don't need to use NVM it's just recommended. ;-)

Installation

```shell
$ npm install
```

## Running

This service is designed to run on multiple machines on a docker swarm cluster. If you'd like to test it locally, you'll need to update the configuration file to use random ports. Just change the servicePort to zero.

```javascript
    "servicePort": 0,
```

And launch multiple instances in different terminal shells.

```shell
$ npm start
```

## Using in a Docker container

To build as a container:

```shell
$ docker build --no-cache=true -t cjus/hpp-service:0.0.1 .
```

> Don't forget the trailing period above.

When using as a docker container, you need to update the service's config file since the running container will have a different IP address from your host. So Redis won't be found inside the container!

There are a few ways to address this concern. The first method is to simply build the container with the hardcoded config entry for your Redis server.

Another option is to specify a DNS entry in your config file which maps to your Redis server. See the redislocation entry below.

```javascript
{
  "environment": "development",
  "hydra": {
    "serviceName": "hpp-service",
    "serviceIP": "",
    "servicePort": 9000,
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
$ docker run -it -d -p 9000:9000 \
  --name hpp-service \
  --add-host redislocation:192.168.1.186 \
  --workdir=/usr/src/app \
  cjus/hpp-service:0.0.1
```

Another method is to run the container with a mapped volume. In the example, the local project folder `~/dev/hpp-service/config` maps over the container's built-in `/usr/src/app/config` folder. So the running container will use the config file you specified in your project folder. That allows you to leave the config.json file in the container and override it with one outside the container.

```shell
$ docker run -it -d -p 9000:9000 \
  --name hpp-service \
  --workdir=/usr/src/app \
  -v ~/dev/hpp-service/config:/usr/src/app/config \
  cjus/hpp-service:0.0.1
```

