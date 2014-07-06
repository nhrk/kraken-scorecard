#Setting up server for a Node.js app

## Modify IPTABLES

>Required to allow Node.js app to make HTTP requests and pull updates from github repo

    #insert on <line number> before drop all
    iptables -I INPUT <line number> -m state --state ESTABLISHED,RELATED -j ACCEPT

## Install (as required)
> sudo?

	apt-get install sudo

> [cURL](http://curl.haxx.se/)

	apt-get install curl

> [Node.js](http://nodejs.org/)

	apt-get install nodejs

> Or update Node.js

	su
	npm cache clean -f
	npm install n -g
	n stable

> [npm](https://www.npmjs.org/) - Node package manager.

	apt-get install npm

> [Github](https://github.com)

	apt-get install git

> [PM2](https://github.com/Unitech/pm2) - Process manager for Node.js with load balancer.

	npm install pm2@latest -g

## Create a different user to run app?
	useradd -s /bin/bash -m -d /home/nodeapp -c "nodeapp" nodeapp
	passwd nodeapp
	usermod -aG sudo nodeapp	

## Create directories

>Logs folder

	/var/log/pm2/

>PID folder

	/var/run/pm2/

> PM2 config (if moving config outside app folder)

	/etc/pm2/conf.d/

## Add PM2 script to system startup

>Run PM2 startup script generator

	pm2 startup debian
	pm2 save

##Setup Logrotate configs

>/var/logrotate.d/pm2

    /var/log/pm2/*.log {
		weekly
		size 100M
		rotate 52
		compress
		delaycompress
		missingok
		notifempty
		create 640 root root
    }

## Setup daily cron for Logrotate (if not present)

>/etc/cron.daily/logrotate

    #!/bin/sh

    test -x /usr/sbin/logrotate || exit 0
    /usr/sbin/logrotate /etc/logrotate.conf