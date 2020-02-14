import requests
import pandas as pd
import json

TRANSPORTATION_GROUP_ID = 'B08301'
TRANSPORTATION_MODE_CONSTANT_MAP = {
    'B08301_001': 'trans_total',
    'B08301_002': 'trans_auto_total',
    'B08301_003': 'trans_auto_solo',
    'B08301_004': 'trans_auto_carpool_total',
    'B08301_005': 'trans_auto_2',
    'B08301_006': 'trans_auto_3',
    'B08301_007': 'trans_auto_4',
    'B08301_008': 'trans_auto_5_or_6',
    'B08301_009': 'trans_auto_7_or_more',
    'B08301_010': 'trans_public_total',
    'B08301_011': 'trans_public_bus',
    'B08301_012': 'trans_public_streetcar',
    'B08301_013': 'trans_public_subway',
    'B08301_014': 'trans_public_rail',
    'B08301_015': 'trans_public_ferry',
    'B08301_016': 'trans_taxi',
    'B08301_017': 'trans_motorcycle',
    'B08301_018': 'trans_bicycle',
    'B08301_019': 'trans_walk',
    'B08301_020': 'trans_other',
    'B08301_021': 'trans_home'
}

POPULATION_GROUP_ID = 'B01003'
POPULATION_TOTAL_ESTIMATE = 'B01003_001E'
POPULATION_TOTAL_MARGIN_OF_ERROR = 'B01003_001M'

# This function is adapted from EDM's db-acs/01_download.py file
# Thank you, @NYCPlanning/EDM :)
def get_tract(group):
    '''
    Downloads requested tract-level table for the five
    NYC counties and combines into a single table
    Parameters
    ----------
    group: str
    Returns
    -------
    pd DataFrame
        Contains data from requested ACS 5-year table,
        all five NYC counties included
    '''
    frames = []
    # Download tract-level tables using census API, and combine into a single NYC DataFrame
    for county in ['081', '085', '005', '047', '061']:
        url = f'https://api.census.gov/data/2018/acs/acs5?get=group({group})&for=tract:*&in=state:36&in=county:{county}'
        resp = requests.request('GET', url).content
        df = pd.DataFrame(json.loads(resp)[1:])
        df.columns = json.loads(resp)[0]
        frames.append(df)
    return pd.concat(frames)

if __name__ == "__main__":
    # get tract-level data for all attributes in the B08301 "Means of Transportation" table
    # For attribute info, see
    # https://api.census.gov/data/2018/acs/acs5/groups/B08301.html
    print("Downloading transportation census data...")
    transportationData = get_tract(TRANSPORTATION_GROUP_ID)
    

    # get tract-level data for all attributes in the B01003 "Population" table
    # For attribute info, see 
    # https://api.census.gov/data/2018/acs/acs5/groups/B01003.html
    print("Downloading population census data...")
    populationData = get_tract(POPULATION_GROUP_ID)

    print("Transforming data...")

    # Add 'variable' column to transportation table, to match transportation and final output tables
    transportationData['variable'] = pd.Series('to be replaced', index=transportationData.index)

    nyc_acs_transportation = pd.DataFrame(columns=['geoid', 'value', 'moe', 'variable'])

    # To represent the variables B08301_001...B08301_021
    variableIds = range(1, 22)

    # Flatten out the Means of Transportation table by representing Modes as rows instead of columns
    # (Create a row for each Geoid - Mode combination)
    for variableId in variableIds:
        if variableId > 9:
            modePrefix = 'B08301_0'
        else:
            modePrefix = 'B08301_00'
        
        modeCode = modePrefix + str(variableId)

        variable_df = pd.DataFrame(
            data=transportationData.loc[:, ['GEO_ID', modeCode + 'E', modeCode + 'M', 'variable']].values,
            columns=['geoid', 'value', 'moe', 'variable']
        )

        # Replace 'to be replaced' values in the 'variable' column with Mode code
        variable_df['variable'] = modeCode
        
        nyc_acs_transportation = pd.concat([nyc_acs_transportation, variable_df], ignore_index=True)

    # replace ACS mode codes with CEQR mode constants
    # Attribute codes taken from
    # https://api.census.gov/data/2018/acs/acs5/groups/B08301.html
    nyc_acs_transportation.replace(to_replace=TRANSPORTATION_MODE_CONSTANT_MAP, inplace=True)

    # Add 'variable' column to population table, to match transportation and final output tables
    populationData['variable'] = pd.Series('population', index=populationData.index)

    nyc_acs_population = pd.DataFrame(
            # grab the GEO_ID, Total Estimate (B01003_001E), Total Margin of Error (B01003_001M), and `variable` columns
            data=populationData.loc[:, ['GEO_ID', POPULATION_TOTAL_ESTIMATE, POPULATION_TOTAL_MARGIN_OF_ERROR, 'variable']].values,
            columns=['geoid', 'value', 'moe', 'variable']
        )

    # combine the flattened Means of Transportation and Population tables
    # where possible values for 'census variable' are 'population' and also
    # every attribute in the B08301 Means of Transportation table
    nyc_acs = pd.concat([nyc_acs_transportation, nyc_acs_population])

    print("Formatting geoids...")
    # Remove '1400000US' prefix from geoid values
    nyc_acs.replace(to_replace='1400000US', value='', regex=True, inplace=True)

    nyc_acs.to_csv(f'./output/nyc_acs.csv', index=False)    

    print("Success downloading and transforming NYC tract-level transportation and population data.")
