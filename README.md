# Backend Assignment.

### Test Assignment for porting an existing redis-monitor repo to node/express app.

The application can be accessed on following url: https://redis-monit.herokuapp.com/

Original Repository Link: https://github.com/NetEaseGame/redis-monitor

[![Heroku](https://heroku-badge.herokuapp.com/?app=redis-monit)](https://heroku-badge.herokuapp.com/?app=redis-monit)

# Installation

## Requirements

Please make sure your computer/server meets the following requirements:

- [node](https://nodejs.org/en/download/) >=8.10.0
- [yarn](https://classic.yarnpkg.com/en/docs/install) >=1.5.1


## Dependency

Download and install redis-cli for connecting to local redis server.

1. [Download redis here!](https://redis.io/download)

2. To connect to local redis server run following command in terminal. 
```sh
redis-server
```

3. The local redis server by default listens on [127.0.0.1:6379](http://127.0.0.1:6379)

## Development

Please install yarn and nodejs if not already installed.


Step1:

```sh
yarn / npm install
```

Step 2:

```sh
yarn / npm start
```

## screenshot

- basic information

![shot_1](/doc/shot_1.png)

- connection time gragh

![shot_2](/doc/shot_2.png)

- ops time gragh

![shot_3](/doc/shot_3.png)

- cpu and mem gragh

![shot_4](/doc/shot_4.png)

![shot_5](/doc/shot_5.png)
