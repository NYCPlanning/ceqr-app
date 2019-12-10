# Air Quality Data Pipeline
This is a makefile ETL pipeline for backing up data from a source database (published by EDM) and importing into `ceqr_db`.  

### Usage
1. Set the following environment variables:
   - `EDM_DBCONN`
   - `CEQR_DBCONN`
     ```
     export EDM_DBCONN=[connection string]
     export CEQR_DBCONN=[connection string]
     ```
2. Run the [`Makefile`](./Makefile)  
   ```shell
   make
   ```
   This will:  
     1.  Create a `./tmp` directory
     2.  Backup each of the air quality tables from the EDM database
     3.  Create the database schema for the destination `ceqr_db`
     4.  Load the backed up EDM data into `ceqr_db`


**Assumptions**  
- role `doadmin` exists in the destination database