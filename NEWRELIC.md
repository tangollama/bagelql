# Deploying custom Instrumentation on this application
1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository on GitHub.
2. Clone your forked repository `git clone https://github.com/<YOUR USERNAME>/bagelql.git`
3. Navigate to the project folder `cd bagelql` and open the project in a code editor `code .` 
4. Install the [New Relic Node.js agent](https://docs.newrelic.com/docs/agents/nodejs-agent/installation-configuration/install-nodejs-agent) `npm install newrelic --save`
5. Per the Install instructions for the New Relic Node.js agent](https://docs.newrelic.com/docs/agents/nodejs-agent/installation-configuration/install-nodejs-agent), copy the newrelic.js file into the root directory `cp node_modules/newrelic/newrelic.js .`
6. Update the newrelic.js in the project root directory with your license_key and app_name
7. Copy the .env.example file to .env `cp .env.example .env`
8. Update the values for the NEWRELIC_API_KEY and NEWRELIC_ACCOUNT_ID in the newly copied .env. Save the file.
9. Start the server `npm start`
10. Navigate to location:4000/graphql