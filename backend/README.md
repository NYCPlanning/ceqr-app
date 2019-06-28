# CEQR App -- Backend
The backend for this project is a rails server, deployed on Heroku.

## Setting up a PR review app on Heroku
When creating a `review` app from a Pull Request, there are a few manual bootstrapping steps that must be completed for the testing app to work.
1. Add Config Vars (in Settings tab in Heroku app UI):
    - CEQR_DATA_DB_URL: real connection string to CEQR DATA DB; should use test_ceqr_app user credentials
2. Migrate the CEQR DB (requires [heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)):
    ```sh
    $ heroku run -a ceqr-app-staging-pr-XXX rails db:migrate
    ```
3. Set `HOST_PR_REVIEW` on netlify with the heroku app's hostname.
    - This is necessary to get the frontend talking to the backend