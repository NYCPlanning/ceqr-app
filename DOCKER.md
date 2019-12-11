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
2. **Create a local .env file from [backend/.env-example](backend/.env-example)**.  In your `.env` copy that is `.gitignore`'d, update the variables as needed (see in-file comments for instructions)
   ```sh
   cd backend
   cp .env-example .env
   ```
3. **Start up the ceqr app**, with environment defined and all deps installed, and bring up the postgis with all dbs created and migrations applied:
    ```sh
    docker-compose up # append "-d" if you'd like it to run in background, as a daemon
    ```
4. **Confirm everything is OK** 
    ```sh
    docker-compose ps

    # should output =>

        Name                   Command              State            Ports
    -------------------------------------------------------------------------------
    ceqr-app_frontend_1   ./frontend-entrypoint.sh        Up(health: starting)  0.0.0.0:4200->4200/tcp, 7020/tcp, 7357/tcp
    ceqr-app_backend_1    ./service-entrypoint.sh         Up(healthy)       0.0.0.0:3000->3000/tcp
    ceqr-app_migrate_1   ./migrate.sh                    Exit 0
    ceqr-app_postgis_1   docker-entrypoint.sh postgres   Up       0.0.0.0:5432->5432/tcp
    ```
    _Note:_
     - `migrate` service is a short-lived container that sets up your backend for you. That's why it is State: Exit 0
     - `frontend` takes a _while_ to start up (ember builds are slow, this is a [known issue](https://docs.docker.com/docker-for-mac/troubleshoot/#/known-issues)), but the health check should give you signal on when things are good to go. Thankfully, after the initial super slow build, re-build for files changed during development are pretty seamless and speedy.

    To mess with env configuration like port mapping, etc check out `docker-compose.yml`.
     - Port mappings are defined in `ports` sections; to change the port a service is mapped to and exposed on on your machine, change the first port in the mapping, i.e. "3001:3000" if you want ceqr running on port 3001 on your machine

5.  🥳 **That's IT!!!!!!** 🥳


### Local Development

If you don't want to run the ember frontend inside the docker container, that's fine! It's slow! I feel ya! You can run the ember frontend on your local machine, hooked up to the docker backend like:
```sh
cd frontend
HOST=http://localhost:3000 DISABLE_MIRAGE=true ember s
```

If you have updated backend packages, you can run the install/updates on your local machine or inside the docker containers (nice if you don't have bundler installed, for instance) like:
```sh
docker exec backend bundle install # to install new backend packages
```
Alternatively, if you delete `Gemfile.lock`, bringing up the containers will re-run the package installation (see `backend/entrypoint.sh`)


Ember server will live-reload changes to the frontend app for you, so there is no need to restart the docker services when making changes to files in `frontend/`


Rails reloads the entire server on every request by default in development more, so there is no need to restart the docker services when making changes to files in `backend/`, altho configuration changes require restart


### Debugging
You can enter the running rails application by running:
```sh
docker exec -it ceqr-app_backend_1 bash
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