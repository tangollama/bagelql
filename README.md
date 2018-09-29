# bagelql
GraphQL order system implementation for fictional Joey Bagels deli chain. The project uses Express Express-GraphQL, and RethinkDB to stand up a simple order-tracking service meant to allow the fictional corporation to catalog orders placed at its various locations and across all ordering properties (API's, online traffic, and point of sale).

This example exists to demonstate how to implement [New Relic custom instrumentation](https://docs.newrelic.com/docs/agents/nodejs-agent/installation-configuration/install-nodejs-agent) of a Node.js application. 

# Installation
1. Ensure you have [git](https://git-scm.com/downloads) and [node](https://nodejs.org/en/download/) installed.
2. [Fork](https://help.github.com/articles/fork-a-repo/) or clone `git clone https://github.com/tangollama/bagelql.git` this repository.
3. If forked, clone your forked repository `git clone https://github.com/<YOUR USERNAME>/bagelql.git`
4. Change directory `cd bagelql`
5. Install packages `npm install`
6. Per the Install instructions for the [New Relic Node.js agent](https://docs.newrelic.com/docs/agents/nodejs-agent/installation-configuration/install-nodejs-agent), copy the newrelic.js file into the root directory `cp node_modules/newrelic/newrelic.js .`
7. Update the newrelic.js in the project root directory with your license_key and app_name
8. Copy the .env.example file to .env `cp .env.example .env`
9. Update the values for the [NEWRELIC_API_KEY](https://docs.newrelic.com/docs/apis/getting-started/intro-apis/understand-new-relic-api-keys) and NEWRELIC_ACCOUNT_ID in the newly copied .env. Save the file.
10. Uncomment the following lines in server.js ` //var { getCachedTrends } = require('./instrumentation'); ` and ` //return getCachedTrends(); `
11. Uncomment the following lines in dbutil.js ` //var { instrumentOrderItems } = require('./instrumentation'); ` and ` //instrumentOrderItems(order); `

## Deployment: localhost
1. [Install](https://rethinkdb.com/docs/install/) and [start](https://www.rethinkdb.com/docs/start-a-server/) RethinkDB.
2. Start the server `npm start`
3. Navigate to http://location:4000/graphql

## Deployment: Docker
1. Ensure you have docker installed and can call both ```docker``` and ```docker-compose``` from the command line.
2. Run ```docker pull rethinkdb```
3. If you haven't already, run ```npm install```
4. Run ```docker-compose up``` 
5. Access the service at http://localhost:4000/graphql