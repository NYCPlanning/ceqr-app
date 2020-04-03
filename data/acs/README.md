# ACS Data Pipeline

This folder (`/data/acs`) contains Python scripts to download and load 2018 ACS data into the CEQR database. This pipeline will likely be transferred to @NYCPlanning/EDM for ownership for future years.

There are accompanying Docker image files and requirement.txt files in the `download/` and `load/` subfolders to support containerized execution of the Python scripts.

# Quickstart

Under the `/data/acs/load/` folder, Create an `.env` file with only the `CEQR_DATA_URL` variable:

**/data/acs/load/.env:**
```
CEQR_DATA_URL=postgres://postgres@host.docker.internal:5432/ceqr_data-test
```

The value of `CEQR_DATA_URL` should be assigned a [postgres connection url](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING) to the production or development/testing `ceqr_data` database.

The example URL above assumes that there is a local PostGres database running on your local machine. Since `CEQR_DATA_URL` will be used by the Dockerized `load/02_dataloading.py` Python script, the `host.docker.internal` is used by the script to reach outside of the container and connect to the host machine's PostGres DB.

Then, run the following two commands somewhere within this application's directory.

```
yarn run download-acs-data
yarn run load-acs-data
```

The above two commands are predefined `package.json` scripts. They will execute the Python scripts in this folder. Read more about each one below.

---

**yarn run download-acs-data**

This command will generate the `nyc_acs.csv` file inside `/data/acs/download/output`.

To do so, it executes four steps:
  1. Builds the Docker image defined by `/data/acs/download/Dockerfile`. When run, this image will download necessary Python libraries and then execute the `/data/acs/download/01_download.py` Python script.
      - `01_download.py` will fetch 2018 ACS data from the Census' REST API, and transform the ACS data into the schema expected by the CEQR database's `nyc_acs` table.
  2. Runs a Docker container that references the built image.
  3. Copies generated csv file from inside container to the (host machine's) `/data/acs/download/output` folder.
  4. Removes the container.

**yarn run load-acs-data**

This command will load the generated `nyc_acs.csv` file into the database and table specified by the `CEQR_DATA_URL` environment variable.

To do so, it executes four steps:

  1. Move the `nyc_acs.csv` file from `/data/acs/download/output` to `/data/acs/load`.
  2. Builds the Docker image defined by `/data/acs/load/Dockerfile`. When run, this image will copy `nyc_acs.csv` into the parent container, download necessary Python libraries and then execute the `/data/acs/download/02_dataloading.py` Python script.
  2. Runs a Docker container that references the built image.
  3. From within the container, `02_dataloading.py` will connect to the `CEQR_DATA_URL` database, create the `nyc_acs.2018` table if it doesn't yet exist, and write `nyc_acs.csv` to that table.
  4. Removes the container.
