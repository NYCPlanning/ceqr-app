import pandas as pd
import psycopg2
from sqlalchemy import create_engine
from pathlib import Path
from dotenv import load_dotenv, find_dotenv
import io
import os
from urllib.parse import urlparse

def psycopg2_connect(url):
    result = urlparse(str(url))
    username = result.username
    password = result.password
    database = result.path[1:]
    hostname = result.hostname
    port = result.port
    connection = psycopg2.connect(
        database = database,
        user = username,
        password = password,
        host = hostname, 
        port = port)
    return connection

def load_acs_csv(year, path, con):
    '''
        Creates nyc_acs version table for specified `year`
        
        Parameters
        ----------
        year: str
            '2017', '2018'
        path: str
            relative path to csv
        con:
            SQLAlchemy connection Engine
    '''
    df = pd.read_csv(path, index_col=False, dtype=str)

    db_connection = psycopg2_connect(con.url)
    db_cursor = db_connection.cursor()
    str_buffer = io.StringIO()

    df.to_csv(str_buffer, sep='\t', header=True, index=False)
    str_buffer.seek(0)

    con.execute(f'CREATE SCHEMA IF NOT EXISTS nyc_acs;')
    con.execute(f'''
        DROP TABLE IF EXISTS nyc_acs."{year}";
        CREATE TABLE nyc_acs."{year}" (
            geoid text,
            value integer,
            moe integer,
            variable text
        );
    ''')

    db_cursor.copy_expert(f'''COPY nyc_acs."{year}" FROM STDIN WITH NULL AS '' DELIMITER E'\t' CSV HEADER''', str_buffer)
    db_cursor.connection.commit()
    str_buffer.close()
    db_cursor.close()
    db_connection.close()

if __name__ == "__main__":
    load_dotenv(Path(__file__).parent/'.env')

    print("Loading nyc_acs.csv into nyc_acs.2018...")

    con = create_engine(os.getenv('CEQR_DATA_URL'))

    load_acs_csv('2018', 'nyc_acs.csv', con)

    print("Finished loading nyc_acs.csv into nyc_acs.2018")
    
