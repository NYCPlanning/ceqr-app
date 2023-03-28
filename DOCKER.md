## Running with Docker and docker-compose

##### Requirements
- Docker & docker-compose installed and running on your machine
  - [macOs](https://runnable.com/docker/install-docker-on-macos), [windows 10](https://runnable.com/docker/install-docker-on-windows-10), [linux](https://runnable.com/docker/install-docker-on-linux)

### Getting Started
1. **Install frontend dependencies locally**
   ```sh
   # in your terminal:
   cd frontend  
   yarn
   ```
1. **Create a local .env file from [backend/.env-example](backend/.env-example)**.  In your `.env` copy that is `.gitignore`'d, update the variables (descriptions of each are below) as follows:


- `DATABASE_URL` - Postgres url string to the `ceqr_rails` database. For local development, this should point to your development database. Rails will automatically swap to `ceqr_test` when the test suite is run. Remember to use `postgis://` as the prefix.
- `CEQR_DATA_DB_URL` - Postgres url string to the read-only production `ceqr_data`  running on Digital Ocean. Remember to use `postgis://` as the prefix. See 1Password for database connection string.
- `JWT_SALT` - salt for the JSON Web Token used for user sessions. Necessary, but only really important in production.
- `ADMIN_EMAILS` - A comma seperated list (no spaces) of email addresses used for admin emails (example: user account in need of verification.)
- `SENDGRID_KEY` - Sendgrid key for sending emails. Can be found in Heroku account.

   ```sh
   cd backend
   cat .env-example > .env
   ```
1. _Optional_:  Instantiate the app with production or staging ceqr_rails data
   ```sh
   # creates a backup sql file in a git-ignored location that the postgis will recognize, bring into the container, and instantiate on container startup.  
   # When you log-in to ceqr-app, use your production ceqr-app user credentials (or staging, if you choose to dump and load the staging database)
   pg_dump --no-owner --no-privileges -f backend/db/backup/ceqr_rails_prod.sql $(CEQR_RAILS_PROD_DBCONN) # Get the db connection string from Heroku config vars ("DATABASE_URL")
   ```
1. **Start up the ceqr app**, with environment defined and all deps installed, and bring up the postgis with all dbs created and migrations applied:
    ```sh
    docker-compose up # append "-d" if you'd like it to run in background, as a daemon

    # alternatively, you can run and `cd` into the frontend folder and run `yarn start-with-backend`
    docker compose up postgis backend migrate
    ```
1. **Confirm everything is OK** 
    ```sh
    docker-compose ps

    # should output =>

        Name                   Command                      State                          Ports
    ----------------------------------------------------------------------------------------------------------------------------
    ceqr-app_frontend_1   ./frontend-entrypoint.sh        Up(health: starting)  0.0.0.0:4200->4200/tcp, 7020/tcp, 7357/tcp
    ceqr-app_backend_1    ./service-entrypoint.sh         Up(healthy)           0.0.0.0:3000->3000/tcp
    ceqr-app_migrate_1    ./migrate.sh                    Exit 0
    ceqr-app_postgis_1    docker-entrypoint.sh postgres   Up                    0.0.0.0:5432->5432/tcp
    ```
    _Note:_
     - `migrate` service is a short-lived container that sets up your backend for you. That's why it is State: Exit 0
     - `frontend` takes a _while_ to start up (ember builds are slow, this is a [known issue](https://docs.docker.com/docker-for-mac/troubleshoot/#/known-issues)), but the health check should give you signal on when things are good to go. Thankfully, after the initial super slow build, re-build for files changed during development are pretty seamless and speedy.

    To mess with env configuration like port mapping, etc check out `docker-compose.yml`.
     - Port mappings are defined in `ports` sections; to change the port a service is mapped to and exposed on on your machine, change the first port in the mapping, i.e. "3001:3000" if you want ceqr running on port 3001 on your machine

5.  🥳 **That's IT!!!!!!** 🥳

##### Docker Tips
If you are starting with a new local `ceqr_rails` db, running `docker-compose up` for the first time (or if you cleanup the `postgis` volume that contains `ceqr_rails`), you may need to the following:

  * Set up the App
    - populate db with table data: run `rails db:seed` in the rails console accessed via the docker backend container: `docker exec -it ceqr-app-backend-1 /bin/bash`
    - create an account in CEQR App:
        - Select **Signup** then **Create Account**
        ![](docs/images/2019-12-12-12-27-32.png)
        ![](docs/images/2019-12-12-12-24-37.png)
    - Check your terminal console for the email URL to validate.  Copy and paste the `http://localhost:4200...` url in your browser to validate.
    ![](docs/images/2019-12-12-12-25-05.png)
    - After successful validation, login and start creating projects 🎉:
    ![](docs/images/2019-12-12-12-25-59.png)

- If you want to stop the containers, click `CTRL + C`
  - Your `ceqr-rails` database (the user you created and projects) will be persisted in a docker volume connected to the `postgis` container.  
  - Restarting the containers with `docker-compose up` will return you to the state of the app you left it in.
- If you want to cleanup and start with a blank slate, run:  
  ```sh
  docker-compose down --volume
  ```   
  ![](docs/images/2019-12-12-12-29-07.png)
### Local Development
If you don't want to run the ember frontend inside the docker container, that's fine! It's slow! I feel ya! You can run the ember frontend on your local machine, hooked up to the docker backend like:
```sh
docker-compose stop frontend # if the frontend is running in the Docker container
cd frontend
yarn start-with-backend  # which will run: HOST=http://localhost:3000 DISABLE_MIRAGE=true ember s
```

If you have updated backend packages, you can run the install/updates on your local machine or inside the docker containers (nice if you don't have bundler installed, for instance) like:
```sh
docker exec backend bundle install # to install new backend packages
```
Alternatively, if you delete `Gemfile.lock`, bringing up the containers will re-run the package installation (see `backend/entrypoint.sh`)


Ember server will live-reload changes to the frontend app for you, so there is no need to restart the docker services when making changes to files in `frontend/`


Rails reloads the entire server on every request by default in development mode, so there is no need to restart the docker services when making changes to files in `backend/`, although configuration changes require restart

### Running Migrations
Rails migrations are stored in /backend/app/db/migrate. 

In order to create a rails migration inside of a docker container follow these steps:

Run docker `docker-compose up`

Check which containers are running `docker-compose ps`

SSH into the backend docker container `docker exec -it ceqr-app-backend-1 /bin/bash`

Once inside the container, run the rails migration command `rails generate migration name_of_your_migration`

If you are running the app for the first time in a docker container and the above migration fails to execute with this message: `bash: rails: command not found`, it will be be necessary to for you run `gem install rails -v 5.2.2.1`, if that works, then retry the migration. You may also get the following error:
```
 Error installing rails:
  The last version of nokogiri (>= 1.6) to support your Ruby & RubyGems was 1.13.10. Try installing it with `gem install nokogiri -v 1.13.10` and then running the current command again
  ```
If so, run `gem install nokogiri -v 1.13.10` and retry installing rails.

**For running the migrations in the Heroku UI:**

Navigate to the ceqr-app on the Labs Heroku account. Select the environment (e.g. staging) that you would like to run the migrations on. On the top right of the page, you will see a button that says "More". Click on this button and select "Run Console" from the dropdown menu. Type `bash` into the console and hit "Run". 

In order to run the migrations: `rails db:migrate`

If you created a new table and need to populate this table with data after running the migrations: 
`rails db:seed`

### Debugging
You can enter the running rails application by running:
```sh
docker exec -it ceqr-app-backend-1 bash
```
This is helpful if you want to run interactive rails commands, like `rails dbconsole` to get a psql session on your development `ceqr_rails` or `rails console` to inspect the state of the running application and troubleshoot.


You can debug client-side frontend javascript in the browser as usual


### Testing
##### Rails
```sh
docker-compose exec backend rspec

# outputs =>
I, [2019-05-30T18:03:06.336418 #16473]  INFO -- sentry: ** [Raven] Raven 2.9.0 configured not to capture errors: DSN not set
...................
```
##### Ember
```sh
docker-compose exec frontend ember t

# outputs =>
ok 1 Chrome 73.0 ...
...
```
