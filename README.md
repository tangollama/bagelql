# bagelql
GraphQL order system implementation for fictional Joey Bagels deli chain. The project uses Express Express-GraphQL, and RethinkDB to stand up a simple order-tracking service meant to allow the fictional corporation to catalog orders placed at its various locations and across all ordering properties (API's, online traffic, and point of sale).

This example exists to demonstate how to implement [New Relic custom instrumentation](https://docs.newrelic.com/docs/agents/nodejs-agent/installation-configuration/install-nodejs-agent) of a Node.js application. 

# Installation
1. Ensure you have [git](https://git-scm.com/downloads) and [node](https://nodejs.org/en/download/) installed.
2. [Install](https://rethinkdb.com/docs/install/) and [start](https://www.rethinkdb.com/docs/start-a-server/) RethinkDB.
3. [Fork](https://help.github.com/articles/fork-a-repo/) or clone `git clone https://github.com/tangollama/bagelql.git` this repository.
4. If forked, clone your forked repository `git clone https://github.com/<YOUR USERNAME>/bagelql.git`
5. Change directory `cd bagelql`
6. Install packages `npm install`
7. Per the Install instructions for the [New Relic Node.js agent](https://docs.newrelic.com/docs/agents/nodejs-agent/installation-configuration/install-nodejs-agent), copy the newrelic.js file into the root directory `cp node_modules/newrelic/newrelic.js .`
8. Update the newrelic.js in the project root directory with your license_key and app_name
9. Copy the .env.example file to .env `cp .env.example .env`
10. Update the values for the [NEWRELIC_API_KEY](https://docs.newrelic.com/docs/apis/getting-started/intro-apis/understand-new-relic-api-keys) and NEWRELIC_ACCOUNT_ID in the newly copied .env. Save the file.
11. Uncomment the following lines in server.js ` //var { getCachedTrends } = require('./instrumentation'); ` and ` //return getCachedTrends(); `
12. Uncomment the following lines in dbutil.js ` //var { instrumentOrderItems } = require('./instrumentation'); ` and ` //instrumentOrderItems(order); `
13. Start the server `npm start`
14. Navigate to http://location:4000/graphql