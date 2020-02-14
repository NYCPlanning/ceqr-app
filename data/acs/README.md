# ACS Data Pipeline

This folder (`/data/acs`) contains Python scripts to download and load 2018 ACS data into the CEQR database. This pipeline will likely be transferred to @NYCPlanning/EDM for ownership for future years.

There is an accompanying Docker image file (`download/Dockerfile`) and `download/requirements.txt` file here to support containerized execution of the Python scripts.

# Quickstart
```
yarn run download-acs-data
```

The Python scripts in this folder can be executed using the following predefined `package.json` script commands.

**yarn download-acs-data**

This command will generate the `nyc_acs.csv` file inside `/data/acs/download/output`

To do so, it executes four steps:
  1. Builds the Docker image defined by `/data/acs/download/Dockerfile`. When run, this image will download necessary Python libraries and then execute the `/data/acs/download/01_download.py` Python script.
    - `01_download.py` will fetch 2018 ACS data from the Census' REST API, and transform the ACS data into the schema expected by the CEQR database's `nyc_acs` table.
  2. Runs a Docker container that references the built image.
  3. Copies generated csv file from inside container to the (host machine's) `/data/acs/download/output` folder.
  4. Removes the container.