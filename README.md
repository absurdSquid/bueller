# Thumbroll
![super agent](/media/logo.png)

[![Circle CI](https://circleci.com/gh/absurdSquid/thumbroll/tree/master.svg?style=svg)](https://circleci.com/gh/absurdSquid/thumbroll/tree/master)
[![Circle CI](https://circleci.com/gh/absurdSquid/thumbroll/tree/develop.svg?style=svg)](https://circleci.com/gh/absurdSquid/thumbroll/tree/develop)


Thumbroll is a teaching assisstant designed to provide real-time two directional feedback between the lecturer and students via a user-friendly iPhone app. With the press of a button, lecturers can send a variety of polls and feedback requests directly to students. Create or join a 'Quick Class' without logging in, or use the partner desktop app to manage classes and lessons, and track student comprehension easily over time.

## Requirements

- OS X is needed for iOS development
- Xcode 7.0 or higher [download here](https://developer.apple.com/xcode/download/)
- homebrew [install here](http://brew.sh/)
- npm [install here](http://blog.npmjs.org/post/85484771375/how-to-install-npm)
- rnpm [install here](https://github.com/rnpm/rnpm)
- docker [install here](https://docs.docker.com/engine/installation/)

## Setup server

Create a file called 'config.json' within /server/db directory by copying 'config.example.json'. This file is used by the server to connect to a postgres DB depending on the run environment. You may need to edit the username and password parameters to run locally (see below).

Thumbroll is setup to be developed and run either locally, or on a local or deployed docker-machine. Running the app via Docker will ensure a consistent environment across computers and is therefore recommended. 

#### Docker

Docker provides a means of packaging applications and their relevant dependencies into blank Linux 'containers' to ensure consistency between development and production environments. Thumbroll requires two containers, one to host the Node server, and one to host the Postgres database. 

Starting up the server is a two-step process:

1. Build an image of the app and any dependencies
2. Start up containers based on the images

These steps correspond to two files in the root directory:

* 'Dockerfile' provides instructions for how to build the app image and install dependencies
* 'docker-compose.yml' provides instructions to setup the environment and run the containers

Use the following instructions to run the Thumbroll server via docker:

__Step 1: Install Docker__

If you don't have it already, you will need to install the [Docker toolbox](https://docs.docker.com/engine/installation/mac/). This will enable you to setup Docker machines, build Docker images, and compose containers.

__Step 2: Select docker-machine__


```
$ docker-machine ls
```

The machine marked with an asterix is currently active. To select a docker-machine, run

```
$ eval $(docker-machine env [name of docker-machine]))
```

__Step 3: Compose containers__

The docker yml file will instruct the docker-machine on how to build the thumbroll image, run the container,
and connect it to a postgres container. Run the following in the command line to compose the containers and
run the node and postgres processes in the background

```
$ docker-compose up -d
```

To see all running containers on the machine, run the command

```
$ docker ps
```

Use the '-a' flag to view all containers, as opposed to just those which are running.

To see the most recent logs from a container process, run

```
$ docker logs [container ID]
```

__Step 4: Confirm Docker IP address__

Assuming there are no issues, the server should be up and running. In order for the mobile front-end to communicate with the server, you will need to set the appropriate IP address in '/client/mobile/utils/environment.js'. To get IP from your docker-machine, run

```
$ docker-machine ip [name of docker-machine]
```

__Step 5: Remove container and image to rebuild__

If you make changes to the server code, you will need to destroy the existing Thumbroll container and image to allow Docker to rebuild. The postgres container and image do not need to be removed.

To see all containers on the docker-machine:

```
$ docker ps -a
```

To force stop and delete a container:

```
$ docker rm -f [container id]
```

To see all images on the docker-machine:

```
$ docker images
```

To remove an image:

```
$ docker rmi [imageID]
```

__Step 6: Deploy to Digital Ocean (optional)__

Digital Ocean provides an easy way to deploy your Docker containers directly from your terminal. [Click here for instructions.](https://docs.docker.com/machine/drivers/digital-ocean/)

#### Local

Instead of running the server within Docker containers, the server may also be run locally.

__Step 1: Install Postgres__

```
$ brew update
$ brew install postgres
```

__Step 2: Create Postgres defaults__

```
$ createdb
$ createrole <<create username>>
```

Plug this username into the relevant position within '/server/db/config.json' according to example file.

__Step 3: Create thumbroll DB__

```
$ createdb thumbroll
```

__Step 4: Startup Postgres__

```
$ postgres -D /usr/local/var/postgres
```

__Step 5: Install dependencies__ 

```
$ npm install
```
__Step 6: Install Webpack__ 

```
$ npm install -g webpack
```

__Step 7: Run Webpack from desktop directory__ 

```
$ cd client/desktop
$ webpack --watch
```

__Step 8: Startup Node server__ 

```
$ npm start
```

__Step 9: Access DB (optional)__

Use the following command to access the thumbroll DB and query it directly:

```
$ psql thumbroll
```

Note that semicolons are required at the end of each query statement.

## Setup Front-end

#### Mobile

__Step 1: Run 'npm install' from the mobile directory__

```
$ cd client/mobile
$ npm install
```

__Step 2: Run 'rnpm link' from the client directory__

```
$ cd client/mobile (if not already in this directory)
$ rnpm link
```

__Step 3: Set environment__

The file '/client/mobile/utils/environment.js' is used to set the environment the front-end will use to communicate with the server. Change the key in the export statement to change the environment. See above to get IP address from a docker-machine.

## Run Simulator

In order to run the simulator, navigate to the 'AppDelegate.m' file under the 'thumbroll' folder. You'll see two options for loading JavaScript code:

1. If you want to run the XCode iPhone simulator from a development server (e.g., localhost), uncomment Option 1 and comment-out Option 2. Then, click the play button in the top-left corner (or Command + R).
2. If you want to run the simulator on a physical iPhone device from a pre-bundled file on disk running on a remote server (e.g., Digital Ocean droplet), comment-out Option 1 and uncomment Option 2. Then, click the play button in the top-left corner (or Command + R).

#### Desktop

__Step 1: Set environment__

The file '/client/desktop/utils/environment.js' is used to set the environment the front-end will use to communicate with the server. Change the key in the export statement to change the environment. See above to get IP address from a docker-machine.

## Icons

Hand by Maico Amorim from the Noun Project

Help by Pham Thi Dieu Linh from the Noun Project
