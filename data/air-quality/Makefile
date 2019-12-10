### Set the following two environment variables before running make
EDM_DBCONN?=localhost # EDM Database to source data from
CEQR_DBCONN?=localhost # CEQR Database to load data into

# define the generated files
TMP_DIR=tmp
GENERATED_FILES=$(TMP_DIR)/atypical_roadways.latest.sql $(TMP_DIR)/dcp_areas_of_concern.latest.sql $(TMP_DIR)/dep_cats_permits.latest.sql $(TMP_DIR)/dot_traffic_cameras.latest.sql $(TMP_DIR)/facilities_garages.latest.sql $(TMP_DIR)/nysdec_air_monitoring_stations.latest.sql $(TMP_DIR)/nysdec_state_facility_permits.latest.sql $(TMP_DIR)/nysdec_title_v_facility_permits.latest.sql $(TMP_DIR)/tunnel_ventilation_towers.latest.sql

# tell make that these two rules do not produce files
.PHONY: all schema load_data

all: load_data
clean: 
	@echo -e "\n cleaning up tmp dir \n"
	rm -Rf tmp
tmp:
	@echo Making tmp dir
	mkdir tmp

## Export Data from EDMs published database
$(TMP_DIR)/atypical_roadways.latest.sql: tmp
	@echo -e "\nGenerating $@\n"
	pg_dump $(EDM_DBCONN) \
	--file "$@" \
	--table $(notdir $(basename $@)) \
	--format=plain \
	--verbose

$(TMP_DIR)/dcp_areas_of_concern.latest.sql: tmp
	@echo -e "\nGenerating $@\n"
	pg_dump $(EDM_DBCONN) \
	--file "$@" \
	--table $(notdir $(basename $@)) \
	--format=plain \
	--verbose

$(TMP_DIR)/dep_cats_permits.latest.sql: tmp
	@echo -e "\nGenerating $@\n"
	pg_dump $(EDM_DBCONN) \
	--file "$@" \
	--table $(notdir $(basename $@)) \
	--format=plain \
	--verbose

$(TMP_DIR)/dot_traffic_cameras.latest.sql: tmp
	@echo -e "\nGenerating $@\n"
	pg_dump $(EDM_DBCONN) \
	--file "$@" \
	--table $(notdir $(basename $@)) \
	--format=plain \
	--verbose

$(TMP_DIR)/facilities_garages.latest.sql: tmp
	@echo -e "\nGenerating $@\n"
	pg_dump $(EDM_DBCONN) \
	--file "$@" \
	--table $(notdir $(basename $@)) \
	--format=plain \
	--verbose

$(TMP_DIR)/nysdec_air_monitoring_stations.latest.sql: tmp
	@echo -e "\nGenerating $@\n"
	pg_dump $(EDM_DBCONN) \
	--file "$@" \
	--table $(notdir $(basename $@)) \
	--format=plain \
	--verbose

$(TMP_DIR)/nysdec_state_facility_permits.latest.sql: tmp
	@echo -e "\nGenerating $@\n"
	pg_dump $(EDM_DBCONN) \
	--file "$@" \
	--table $(notdir $(basename $@)) \
	--format=plain \
	--verbose

$(TMP_DIR)/nysdec_title_v_facility_permits.latest.sql: tmp
	@echo -e "\nGenerating $@\n"
	pg_dump $(EDM_DBCONN) \
	--file "$@" \
	--table $(notdir $(basename $@)) \
	--format=plain \
	--verbose

$(TMP_DIR)/tunnel_ventilation_towers.latest.sql: tmp
	@echo -e "\nGenerating $@\n"
	pg_dump $(EDM_DBCONN) \
	--file "$@" \
	--table $(notdir $(basename $@)) \
	--format=plain \
	--verbose



# Create the schema structure in our destination database & load dumped tables from EDM db
schema:
	@echo -e "\n Creating schemas in ceqr_db \n"
	psql $(CEQR_DBCONN) -f schema.sql

load_data: $(GENERATED_FILES) schema
	@echo -e "\n\n Restoring edm tables into destination database \n\n"
	(echo "BEGIN;"; cat $(GENERATED_FILES); echo "COMMIT;") \
	| psql -v ON_ERROR_STOP=1 $(CEQR_DBCONN)