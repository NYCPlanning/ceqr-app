## Running with Docker and docker-compose
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
    ceqr-app_frontend_1   ./frontend-entrypoint.sh        Up(health: starting)  0.0.0.0:4200->4200/tcp, 7020/tcp, 7357/tcp
    ceqr-app_backend_1    ./service-entrypoint.sh         Up(healthy)       0.0.0.0:3000->3000/tcp
    ceqr-app_migrate_1   ./migrate.sh                    Exit 0
    ceqr-app_postgis_1   docker-entrypoint.sh postgres   Up       0.0.0.0:5432->5432/tcp
    ```
    Some things to note:
     - `migrate` service is a short-lived container that sets up your backend for you. That's why it is State: Exit 0
     - `ceqr_frontend` takes a _while_ to start up (ember builds are slow, this is a [known issue](https://docs.docker.com/docker-for-mac/troubleshoot/#/known-issues)), but the health check should give you signal on when things are good to go. Thankfully, after the initial super slow build, re-build for files changed during development are pretty seamless and speedy.

    To mess with env configuration, port mapping, etc check out `docker-compose.yml`.
     - The env for ceqr app is defined in the `environment` section of the `ceqr` service. If you want to define your env from a file, swap out `env` section for [`env_file` section](https://docs.docker.com/compose/compose-file/#env_file)
     - Port mappings are defined in `ports` sections; to change the port a service is mapped to and exposed on on your machine, change the first port in the mapping, i.e. "3001:3000" if you want ceqr running on port 3001 on your machine

5.  That's IT!!!!!!


### Local Development

If you don't want to run the ember frontend inside the docker container, that's fine! It's slow! I feel ya! You can run the ember frontend on your local machine, hooked up to the docker backend like:
```
$ cd frontend
$ HOST=http://localhost:3000 DISABLE_MIRAGE=true ember s
```

If you have updated frontend or backend packages, you can run the install/updates on your local machine or inside the docker containers (nice if you don't have yarn/bundler installed, for instance) like:
```
$ docker exec frontend yarn // to install new frontend packages
$ docker exec backend bundle install // to install new backend packages
```
Alternatively, if you delete `/node_modules` or `Gemfile.lock`, bringing up the containers will re-run the package installation (see `frontend/entrypoint.sh` and `backend/entrypoint.sh`)


Ember server will live-reload changes to the frontend app for you, so there is no need to restart the docker services when making changes to files in `frontend/`


Rails reloads the entire server on every request by default in development more, so there is no need to restart the docker services when making changes to files in `backend/`, altho configuration changes require restart


### Debugging
You can access an interactive [byebug](https://github.com/deivid-rodriguez/byebug) debug terminal by attaching to the backend service like:
```sh
$ docker attach ceqr_backend_1
```
Beware, you may have trouble detatching (I can't figure it out), so do this in a terminal window you don't mind closing when you're done.


You can debug client-side frontend javascript in the browser as usual


### Testing
To run ember tests in docker container:
```sh
$ docker-compose exec frontend ember t
ok 1 Chrome 73.0 ...
...
```

To run rails tests in docker container:
```sh
$ docker-compose exec backend rspec
I, [2019-05-30T18:03:06.336418 #16473]  INFO -- sentry: ** [Raven] Raven 2.9.0 configured not to capture errors: DSN not set
...................
```
