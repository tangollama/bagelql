# bagelql
GraphQL order system implementation for fictional Joey Bagels deli chain. The project uses Express Express-GraphQL, and RethinkDB to stand up a simple order-tracking service meant to allow the fictional corporation to catalog orders placed at its various locations and across all ordering properties (API's, online traffic, and point of sale).

This example exists to demonstate how to implement [New Relic custom instrumentation](https://docs.newrelic.com/docs/agents/nodejs-agent/installation-configuration/install-nodejs-agent) of a Node.js application. 

# Installation
1. [Install](https://rethinkdb.com/docs/install/) and [start]() RethinkDB.
2. Ensure you have [git](https://git-scm.com/downloads) and [node](https://nodejs.org/en/download/) installed.
3. Clone this repo `git clone https://github.com/tangollama/bagelql.git`
4. Change directory `cd bagelql`
5. Install packages `npm install`
6. Run `node server.js` and navigate to http://localhost:4000/graphql