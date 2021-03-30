[![codecov](https://codecov.io/gh/NYCPlanning/ceqr-app/branch/develop/graph/badge.svg)](https://codecov.io/gh/NYCPlanning/ceqr-app)

# CEQR App

CEQR App is a collection of data tools whose purpose is to improve the accuracy and speed of environmental review.

## Getting Started

CEQR App runs on a Rails API and Ember frontend.

There are two ways to run the app: 

- [Run Locally](LOCALDEV.md)
- [Use Docker](DOCKER.md)

## Architecture

_TODO_

## Note

NOTE ABOUT SCHOOLS DATA: Within frontend / app / fragments/public-schools, there are multiple fragment files that define computed properties for the schools-related CEQR data. These computed properties are often calculated using other computed properties and therefore can get confusing to keep track of. We have a specific Miro board that details the relationships between these different computed properties. Visit the CEQR section of the Data Update Playbook to access this Miro link. 
