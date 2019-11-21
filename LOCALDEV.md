# Local Dev

## Environment

Requirements:
- Ruby 2.6.4
- Node 8+
- Postgres 10+ with PostGIS extension installed

To get it running you will need both `node` and `ruby` installed. Use the language version manager of your choice, or follow the instructions below.

### Getting the code

To get started, first clone this repo and navigate to it.

```
git clone git@github.com:NYCPlanning/ceqr-app.git
cd ceqr-app
```

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
cd backend
cp .env-example .env
```

Next, edit `.env` to the appropriate settings. Descriptions of each are below:

- `DATABASE_URL` - Postgres url string to the `ceqr_rails` database. Locally, this should point to your develompent database. Rails will automatically swap to `ceqr_test` when the test suite is run. Remember to use `postgis://` as the prefix.
- `CEQR_DATA_DB_URL` - Postgres url string to the `ceqr_data` database. Remember to use `postgis://` as the prefix.
- `JWT_SALT` - salt for the JSON Web Token used for user sessions. Necessary, but only really important in production.
- `ADMIN_EMAILS` - A comma seperated list (no spaces) of email addresses used for admin emails (example: user account in need of verification.)
- `SENDGRID_KEY` - Sendgrid key for sending emails. Can be found in Heroku account.


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
bin/rails db:create db:schema:load
```

### Setting up Ember

The Ember app sits in the `frontend` directory. It's served by the Rails app using [`ember-cli-rails`](https://github.com/thoughtbot/ember-cli-rails) gem.

To install Ember and its dependenices, run:

```
cd frontend
yarn install
```

### Running the app

For the backend:

```
cd backend/
bin/rails s
```

For the frontend:

```
cd frontend/
yarn serve-with-backend
```

### Troubleshooting Rails server

If you receiver a Address already in use error for "127.0.0.1" port 3000, you may need to kill off some Ruby processes.

1. List out processes which are using port 3000:
```
lsof -wni tcp:3000
```
2. End the processes:
```
kill -9 <pid>
```
3. Try `rails s` again. 

### Running the tests

```
rspec
```
