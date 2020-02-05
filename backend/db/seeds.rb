# We use seeds to update ceqr_rails with data packages.
# When making changes to data packages, you must manually run `rails db:seed` to finish update

if DataPackage.where(package: "public_schools", version: "november_2017").first.nil?
  DataPackage.create({
    name: "November 2017",
    version: "november_2017",
    package: "public_schools",
    release_date: Date.parse('2017-11-01'),
    schemas: {
      "doe_school_subdistricts": { table: "2017" },
      "ceqr_school_buildings": {
        table: 2018,
        sources: [
          {name: "lcgms", version: '2018-09-10', minYear: 2017, maxYear: 2018},
          {name: "bluebook", minYear: 2016, maxYear: 2017}
        ]
      },
      "doe_school_zones_ps": { table: "2018" },
      "doe_school_zones_is": { table: "2018" },
      "doe_school_zones_hs": { table: "2018" },
      "sca_housing_pipeline_by_boro": {
        minYear: 2016,
        maxYear: 2025,
        table: "2017",
      },
      "sca_housing_pipeline_by_sd": {
        minYear: 2016,
        maxYear: 2025,
        table: "2017",
      },
      "sca_enrollment_projections_by_boro": {
        minYear: 2015,
        maxYear: 2025,
        table: "2017",
      },
      "sca_enrollment_projections_by_sd": {
        minYear: 2015,
        maxYear: 2025,
        table: "2017",
      },
      "doe_significant_utilization_changes": {
        table: "062018",
        version: "2018-02-01",
      },
      "sca_capital_projects": {
        table: "2018",
        version: "2018-12-04",
      }
    },
  })
end

if DataPackage.where(package: "public_schools", version: "november_2018").first.nil?
  DataPackage.create({
    name: "November 2018",
    version: "november_2018",
    package: "public_schools",
    release_date: Date.parse('2018-11-01'),
    schemas: {
      "doe_school_subdistricts": { table: "2017" },
      "ceqr_school_buildings": {
        table: 2018,
        sources: [
          {name: "lcgms", version: '2018-12-19', minYear: 2018, maxYear: 2019},
          {name: "bluebook", minYear: 2017, maxYear: 2018}
        ]
      },
      "doe_school_zones_ps": { table: "2018" },
      "doe_school_zones_is": { table: "2018" },
      "doe_school_zones_hs": { table: "2018" },
      "sca_housing_pipeline_by_boro": {
        minYear: 2018,
        maxYear: 2027,
        table: "2018"
      },
      "sca_housing_pipeline_by_sd": {
        minYear: 2018,
        maxYear: 2027,
        table: "2018"
      },
      "sca_enrollment_projections_by_boro": {
        minYear: 2017,
        maxYear: 2027,
        table: "2018"
      },
      "sca_enrollment_projections_by_sd": {
        minYear: 2017,
        maxYear: 2027,
        table: "2018"
      },
      "doe_significant_utilization_changes": {
        table: "062018",
        version: "2018-02-01"
      },
      "sca_capital_projects": {
        table: "2018",
        version: "2018-12-04"
      }
    }
  })
end

if DataPackage.where(package: "public_schools", version: "november_2018_q2").first.nil?
  DataPackage.create({
    name: "November 2018 (with 04/2019 SCA Capital Plan)",
    version: "november_2018_q2",
    package: "public_schools",
    release_date: Date.parse('2019-04-01'),
    schemas: {
      "doe_school_subdistricts": { table: "2017" },
      "ceqr_school_buildings": {
        table: 2018,
        sources: [
          {name: "lcgms", version: '2018-12-19', minYear: 2018, maxYear: 2019},
          {name: "bluebook", minYear: 2017, maxYear: 2018}
        ]
      },
      "doe_school_zones_ps": { table: "2018" },
      "doe_school_zones_is": { table: "2018" },
      "doe_school_zones_hs": { table: "2018" },
      "sca_housing_pipeline_by_boro": {
        minYear: 2018,
        maxYear: 2027,
        table: "2018"
      },
      "sca_housing_pipeline_by_sd": {
        minYear: 2018,
        maxYear: 2027,
        table: "2018"
      },
      "sca_enrollment_projections_by_boro": {
        minYear: 2017,
        maxYear: 2027,
        table: "2018"
      },
      "sca_enrollment_projections_by_sd": {
        minYear: 2017,
        maxYear: 2027,
        table: "2018"
      },
      "doe_significant_utilization_changes": {
        table: "042019",
        version: "2019-04-01"
      },
      "sca_capital_projects": {
        table: "022019",
        version: "2019-02-01"
      }
    }
  })
end

if DataPackage.where(package: "public_schools", version: "november_2019").first.nil?
  DataPackage.create({
    name: "November 2019",
    version: "november_2019",
    package: "public_schools",
    release_date: Date.parse('2019-11-01'),
    schemas: {
      "doe_school_subdistricts": { table: "2017" },
      "ceqr_school_buildings": {
        table: 2019,
        sources: [
          {name: "lcgms", version: '2019-12-19', minYear: 2018, maxYear: 2019},
          {name: "bluebook", minYear: 2017, maxYear: 2018}
        ]
      },
      "doe_school_zones_ps": { table: "2019" },
      "doe_school_zones_is": { table: "2019" },
      "doe_school_zones_hs": { table: "2019" },
      "sca_housing_pipeline_by_boro": {
        minYear: 2018, # TODO: Update
        maxYear: 2027, # TODO: Update
        table: "2019"
      },
      "sca_housing_pipeline_by_sd": {
        minYear: 2018, # TODO: Update
        maxYear: 2027, # TODO: Update
        table: "2019"
      },
      "sca_enrollment_projections_by_boro": {
        minYear: 2017, # TODO: Update
        maxYear: 2027, # TODO: Update
        table: "2019"
      },
      "sca_enrollment_projections_by_sd": {
        minYear: 2017, # TODO: Update 
        maxYear: 2027, # TODO: Update
        table: "2019"
      },
      "doe_significant_utilization_changes": {
        table: "042019",
        version: "2019-04-01" # TODO: Update, determine what "version" this is
      },
      "sca_capital_projects": {
        table: "2019",
        version: "2018-12-04" # TODO: Update, determine what "version" this is
      }
    }
  })
end

if DataPackage.where(package: "ctpp", version: "2006_2010").first.nil?
  DataPackage.create({
    name: "CTPP 2006-2010",
    version: "2006_2010",
    package: "ctpp",
    release_date: Date.parse('2011-01-01'),
    schemas: {
      "ctpp_censustract_centroids": { table: "2006_2010" },
      "ctpp_censustract_variables": { table: "2006_2010" },
      "ctpp_worker_flows": { table: "2006_2010" }
    }
  })
end

if DataPackage.where(package: "ctpp", version: "2012_2016").first.nil?
  DataPackage.create({
    name: "CTPP 2012-2016",
    version: "2012_2016",
    package: "ctpp",
    release_date: Date.parse('2017-01-01'),
    schemas: {
      "ctpp_censustract_centroids": { table: "2012_2016" },
      "ctpp_censustract_variables": { table: "2012_2016" },
      "ctpp_worker_flows": { table: "2012_2016" }
    }
  })
end

if DataPackage.where(package: "nyc_acs", version: "2017").first.nil?
  DataPackage.create({
    name: "ACS 5-year 2017",
    version: "2017",
    package: "nyc_acs",
    release_date: Date.parse('2018-01-01'),
    schemas: {
      "nyc_acs": { table: "2017" },
      "nyc_census_tract_boundaries": { table: "2010" }
    }
  })
end

if DataPackage.where(package: "mappluto", version: "18v2").first.nil?
  DataPackage.create({
    name: "MapPLUTO 18v2",
    version: "18v2",
    package: "mappluto",
    release_date: Date.parse('2018-12-01'),
    schemas: {
      "mappluto": { table: "18v2", carto: "mappluto_18v2" },
    }
  })
end

if DataPackage.where(package: "mappluto", version: "19v1").first.nil?
  DataPackage.create({
    name: "MapPLUTO 19v1",
    version: "19v1",
    package: "mappluto",
    release_date: Date.parse('2019-03-01'),
    schemas: {
      "mappluto": { table: "19v1", carto: "mappluto_19v1" }
    }
  })
end
