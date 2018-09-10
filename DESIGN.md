# Purpose
The purpose of this sample project is to demonstrate how programmable capabilities in New Relic can be used for:
1. Injesting custom entities for analysis (and action) using the Node agent API
2. Leveraging the New Relic GraphQL API (as well as NRQL) to calculate and display (within an application) customer-specific trending data


# Scenario
The fictional Joey Bagels deli chain has invested in building their own GraphQL interface for:
1. Capturing orders from their stores across North America.
2. Delivering trending data to other Joey Bagels properties regarding current, popular orders and locations. Assumedly, this data could be leveraged for automating the targeting of advertising spend, etc.

# The Recipe
1. Deploy and configure the node agent.
2. Record custom entities in New Relic.
3. Build trending data into the Joey Bagels GraphQL interface that is calculated and sourced from New Relic.