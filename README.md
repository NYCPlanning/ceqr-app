# CEQR App

CEQR App is a collection of data tools whose purpose is to improve the accuracy and speed of environmental review.

## Getting Started

CEQR App runs on a Rails api and Ember frontend. 

Requirements:
- Ruby 2.6
- Node 8+
- Postgres 10+ with PostGIS extension installed

To get it running you will need both `node` and `ruby` installed. Use the language version manager of your choice, or follow the instructions below.

### Getting the code

To get started, first clone this repo and navigate to it.

```
git clone git@github.com:NYCPlanning/ceqr-app.git
cd ceqr-app
```

### Running with Docker and docker-compose

1. Install Docker & docker-compose on your machine, if you don't already have 'em
([macOs](https://runnable.com/docker/install-docker-on-macos), [windows 10](https://runnable.com/docker/install-docker-on-windows-10), [linux](https://runnable.com/docker/install-docker-on-linux))

2. Create a .env file from .env-example-docker-compose, which requires only one variable -- the password for the test_ceqr_app user to connect to the production, read-only ceqr_data postgres cluster
3. Start up the ceqr app, with environment defined and all deps installed, and bring up the postgis with all dbs created and migrations applied:
    ```
    $ docker-compose up -d
    ```
4. Confirm everything is OK:
    ```
    $ docker-compose ps

        Name                   Command              State            Ports
    -------------------------------------------------------------------------------
    app_ceqr_frontend_1   ./frontend-entrypoint.sh        Up(health: starting)  0.0.0.0:4200->4200/tcp, 7020/tcp, 7357/tcp
    app_ceqr_service_1    ./service-entrypoint.sh         Up(healthy)       0.0.0.0:3000->3000/tcp
    app_migrate_1   ./migrate.sh                    Exit 0
    app_postgis_1   docker-entrypoint.sh postgres   Up       0.0.0.0:5432->5432/tcp
    ```
    Some things to note:
     - `migrate` service is a short-lived container that sets up your backend for you. That's why it is State: Exit 0
     - `ceqr_frontend` takes a _while_ to start up (ember builds are slow, this is a [known issue](https://docs.docker.com/docker-for-mac/troubleshoot/#/known-issues)), but the health check should give you signal on when things are good to go. Thankfully, after the initial super slow build, re-build for files changed during development are pretty seamless and speedy.

    To mess with env configuration, port mapping, etc check out `docker-compose.yml`.
     - The env for ceqr app is defined in the `environment` section of the `ceqr` service. If you want to define your env from a file, swap out `env` section for [`env_file` section](https://docs.docker.com/compose/compose-file/#env_file)
     - Port mappings are defined in `ports` sections; to change the port a service is mapped to and exposed on on your machine, change the first port in the mapping, i.e. "3001:3000" if you want ceqr running on port 3001 on your machine

5.  That's IT!!!!!!
..................or do all these steps:

### Installing Ruby

I suggest using [`rbenv`](https://github.com/rbenv/rbenv) installed with Homebrew.

```
brew install rbenv
rbenv init
rbenv install 2.6.0
```

### Installing Node

macOS will come with `node` installed. I use [`n`](https://github.com/tj/n) to manage node versions. Our current configuration expects [`yarn`](https://yarnpkg.com/en/) to manage javascript dependencies.

```
npm install -g n
n 8.15.0
brew install yarn
```

### Installing Postgres

I use [Postgres.app](https://postgresapp.com/) on macOS, though you can manage Postgres however you like.

CEQR App has two Postgis databases:

- `ceqr_rails`, which is used for all saved state of the app, including projects, users, and saved analyses.
- `ceqr_data`, which is accesed by Rails as a read-only database containing all the inputs necessary for any given CEQR analysis. (_TODO:_ Currently, there is no seed file for this database. Ideally, for tests, a small local version could be created. The development environment might as well point to the production data since it's read-only.)

### Setting configuration

Rails config sits in a `.env` file that is not checked into version control. This allows configuring through environment variables in production. To get started, copy the config example:

```
cp .env-example .env
```

Next, edit `.env` to the appropriate settings. Descriptions of each are below:

- `JWT_SALT` - salt for the JSON Web Token used for user sessions. Necessary, but only really important in production.
- `SENDGRID_KEY` - Sendgrid key for sending emails. Can be found in Heroku account.
- `ADMIN_EMAILS` - A comma seperated list (no spaces) of email addresses used for admin emails (example: user account in need of verification.)
- `CEQR_DATA_DB_URL` - Postgres url string to the `ceqr_data` database. Remember to use `postgis://` as the prefix.
- `DATABASE_URL` - Postgres url string to the `ceqr_rails` database. Locally, this should point to your develompent database. Rails will automatically swap to `ceqr_test` when the test suite is run. Remember to use `postgis://` as the prefix.

### Setting up Rails

Once you have the latest version of Ruby installed, you'll first need [`bundler`](https://bundler.io/), Rails' package manager.

To install Rails and its dependencies, run:

```
gem install bundler
bundle install
```

*NOTE:* You may encounter issues installing gems. If you do, investigate the errors. You may require additional libraries that can be install with homebrew.

Next, the database needs to be created. If Rails is installed correctly, you this command should create the `ceqr_rails` database and load the schema.

```
rails db:create db:schema:load
```

### Setting up Ember

The Ember app sits in the `frontend` directory. It's served by the Rails app using [`ember-cli-rails`](https://github.com/thoughtbot/ember-cli-rails) gem.

To install Ember and its dependenices, run:

```
cd frontend
yarn install
```

### Running the app

```
rails s
```

### Running the tests

```
rspec
```

## Architecture

_TODO_
