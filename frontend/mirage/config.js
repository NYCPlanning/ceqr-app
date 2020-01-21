import JWT from 'jsonwebtoken';
import ENV from 'labs-ceqr/config/environment';
import cartoresponses from './fixtures/cartoresponses';
import cartoMap from './fixtures/carto-map';
import patchXMLHTTPRequest from './helpers/mirage-mapbox-gl-monkeypatch';

const secret = 'nevershareyoursecret';

export default function() {
  patchXMLHTTPRequest();
  /**
   *
   * Passthroughs
   *
   */

  this.pretender.get('blob:**', this.pretender.passthrough);

  // this.passthrough('https://labs-mapbox-gl-noop-tiles.nyc3.digitaloceanspaces.com/dummy-tile.mvt');
  this.passthrough('/data-tables/**');
  this.passthrough('/ceqr-manual/**');
  this.passthrough('https://api.mapbox.com/**');
  this.passthrough('https://layers-api.planninglabs.nyc/static/**');
  this.passthrough('https://tiles.planninglabs.nyc/**');
  this.passthrough('https://events.mapbox.com/events/**');

  this.passthrough('https://cartocdn-gusc-a.global.ssl.fastly.net/planninglabs/**');
  this.passthrough('https://cartocdn-gusc-b.global.ssl.fastly.net/planninglabs/**');
  this.passthrough('https://cartocdn-gusc-c.global.ssl.fastly.net/planninglabs/**');
  this.passthrough('https://cartocdn-gusc-d.global.ssl.fastly.net/planninglabs/**');
  this.passthrough('https://js-agent.newrelic.com/**');

  // related to ember-cli-code-coverage. required to be open to report back findings
  this.passthrough('/write-coverage');

  // CartoVL map
  this.post('https://planninglabs.carto.com/api/v1/map', function() {
    return cartoMap;
  });

  this.get('https://labs-mapbox-gl-noop-tiles.nyc3.digitaloceanspaces.com/dummy-tile.mvt', function() {
    return 'asdf';
  });

  this.get('https://layers-api.planninglabs.nyc/v1/base/style.json', function() {
    return {
      "version": 8,
      "name": "NYCPlanning Positron",
      "metadata": {
        "attribution": "Based on OpenMapTiles Positron style: https://github.com/openmaptiles/positron-gl-style"
      },
      "center": [
        -73.869324,
        40.815888
      ],
      "zoom": 9.72,
      "bearing": 0,
      "pitch": 0,
      "sources": {
        "digital-citymap": {
          "id": "digital-citymap",
          "type": "vector",
          "source-layers": [
            {
              "id": "bulkhead-lines",
              "sql": "SELECT the_geom_webmercator, jurisdicti FROM citymap_bulkheadlines"
            },
            {
              "id": "arterials",
              "sql": "SELECT the_geom_webmercator, route_type FROM citymap_arterials"
            },
            {
              "id": "pierhead-lines",
              "sql": "SELECT the_geom_webmercator, jurisdicti FROM citymap_pierheadlines"
            },
            {
              "id": "amendments",
              "sql": "SELECT the_geom_webmercator, ST_Area(the_geom) as area, cartodb_id AS id, altmappdf, extract(epoch from effective) as effective, status FROM citymap_amendments WHERE effective IS NOT NULL OR status = '13' ORDER BY area DESC"
            },
            {
              "id": "street-centerlines",
              "sql": "SELECT the_geom_webmercator, official_s AS streetname, COALESCE('   (' || streetwidt || ' ft)') AS streetwidth, roadway_ty, feature_st FROM citymap_streetcenterlines"
            },
            {
              "id": "citymap",
              "sql": "SELECT the_geom_webmercator, type, boro_nm FROM citymap_citymap"
            },
            {
              "id": "name-changes-points",
              "sql": "SELECT the_geom_webmercator, intronumbe, intro_year, ll_effecti, CASE WHEN honoraryna = 'none' THEN officialna ELSE honoraryna END FROM citymap_streetnamechanges_points"
            },
            {
              "id": "name-changes-lines",
              "sql": "SELECT the_geom_webmercator, intronumbe, intro_year, ll_effecti, CASE WHEN honoraryna = 'none' THEN officialna ELSE honoraryna END FROM citymap_streetnamechanges_streets"
            },
            {
              "id": "name-changes-areas",
              "sql": "SELECT the_geom_webmercator, intronumbe, intro_year, ll_effecti, CASE WHEN honoraryna = 'none' THEN officialna ELSE honoraryna END FROM citymap_streetnamechanges_areas"
            },
            {
              "id": "rail-lines",
              "sql": "SELECT the_geom_webmercator, street FROM citymap_rails"
            }
          ],
          "meta": {
            "description": "NYC Department of City Planning Technical Review Division",
            "updated_at": "6 April 2018"
          },
          "tiles": [
            "https://planninglabs.carto.com/api/v1/map/01554ae6ce37545a9aa5eb49313f9079:1578673753478/38,39,40,41,42,43,44,45,46,47/{z}/{x}/{y}.mvt"
          ]
        },
        "zoning-districts": {
          "id": "zoning-districts",
          "type": "vector",
          "source-layers": [
            {
              "id": "zoning-districts",
              "sql": "SELECT cartodb_id AS id, * FROM (SELECT the_geom_webmercator, zonedist, CASE WHEN SUBSTRING(zonedist, 3, 1) = '-' THEN LEFT(zonedist, 2) WHEN SUBSTRING(zonedist, 3, 1) ~ E'[A-Z]' THEN LEFT(zonedist, 2) WHEN SUBSTRING(zonedist, 3, 1) ~ E'[0-9]' THEN LEFT(zonedist, 3) ELSE zonedist END as primaryzone, cartodb_id FROM zoning_districts) a"
            }
          ],
          "buffersize": {
            "mvt": 10
          },
          "meta": {
            "description": "NYC GIS Zoning Features Nov 2019, Bytes of the Big Apple",
            "url": [
              "https://www1.nyc.gov/site/planning/data-maps/open-data.page"
            ],
            "data_date": "Nov 2019",
            "updated_at": "Nov 2019"
          },
          "tiles": [
            "https://planninglabs.carto.com/api/v1/map/01554ae6ce37545a9aa5eb49313f9079:1578673753478/48/{z}/{x}/{y}.mvt"
          ]
        },
        "supporting-zoning": {
          "id": "supporting-zoning",
          "type": "vector",
          "source-layers": [
            {
              "id": "commercial-overlays",
              "sql": "SELECT cartodb_id AS id, * FROM commercial_overlays"
            },
            {
              "id": "special-purpose-districts",
              "sql": "SELECT the_geom_webmercator, cartodb_id AS id, cartodb_id, sdlbl, sdname FROM special_purpose_districts"
            },
            {
              "id": "special-purpose-subdistricts",
              "sql": "SELECT the_geom_webmercator, cartodb_id AS id, cartodb_id, splbl, spname, subdist FROM special_purpose_subdistricts"
            },
            {
              "id": "mandatory-inclusionary-housing",
              "sql": "SELECT the_geom_webmercator, cartodb_id AS id, projectnam, mih_option FROM mandatory_inclusionary_housing"
            },
            {
              "id": "inclusionary-housing",
              "sql": "SELECT the_geom_webmercator, cartodb_id AS id, projectnam FROM inclusionary_housing"
            },
            {
              "id": "transit-zones",
              "sql": "SELECT the_geom_webmercator, cartodb_id AS id FROM transitzones"
            },
            {
              "id": "fresh",
              "sql": "SELECT the_geom_webmercator, cartodb_id AS id, name FROM fresh_zones"
            },
            {
              "id": "sidewalk-cafes",
              "sql": "SELECT the_geom_webmercator, cafetype FROM sidewalk_cafes"
            },
            {
              "id": "low-density-growth-mgmt-areas",
              "sql": "SELECT the_geom_webmercator, cartodb_id AS id FROM lower_density_growth_management_areas"
            },
            {
              "id": "coastal-zone-boundary",
              "sql": "SELECT the_geom_webmercator, cartodb_id AS id FROM coastal_zone_boundary"
            },
            {
              "id": "waterfront-access-plan",
              "sql": "SELECT the_geom_webmercator, cartodb_id AS id, name FROM waterfront_access_plan"
            },
            {
              "id": "limited-height-districts",
              "sql": "SELECT the_geom_webmercator, cartodb_id AS id, lhlbl, lhname FROM limited_height_districts"
            },
            {
              "id": "business-improvement-districts",
              "sql": "SELECT the_geom_webmercator, cartodb_id AS id, bid FROM business_improvement_districts"
            },
            {
              "id": "e-designations",
              "sql": "SELECT the_geom_webmercator, cartodb_id AS id, bbl, ceqr_num, enumber, ulurp_num FROM e_designations"
            },
            {
              "id": "industrial-business-zones",
              "sql": "SELECT the_geom_webmercator, cartodb_id AS id, name FROM industrial_business_zones"
            },
            {
              "id": "appendixj-designated-mdistricts",
              "sql": "SELECT the_geom_webmercator, cartodb_id AS id, name, subarea FROM appendixj_designated_mdistricts"
            }
          ],
          "buffersize": {
            "mvt": 10
          },
          "meta": {
            "description": "Zoning related datasets Nov 2019, Bytes of the Big Apple",
            "url": [
              "https://www1.nyc.gov/site/planning/data-maps/open-data.page#zoning_related"
            ],
            "data_date": "Nov 2019",
            "updated_at": "Nov 2019"
          },
          "tiles": [
            "https://planninglabs.carto.com/api/v1/map/01554ae6ce37545a9aa5eb49313f9079:1578673753478/22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37/{z}/{x}/{y}.mvt"
          ]
        },
        "pluto": {
          "id": "pluto",
          "type": "vector",
          "minzoom": 12,
          "source-layers": [
            {
              "id": "pluto",
              "sql": "SELECT bbl AS id, the_geom_webmercator, bbl, lot, landuse, address, numfloors, notes FROM mappluto"
            },
            {
              "id": "block-centroids",
              "sql": "SELECT the_geom_webmercator, block FROM dtm_block_centroids"
            }
          ],
          "buffersize": {
            "mvt": 10
          },
          "meta": {
            "description": "MapPLUTO™ 19v2, Bytes of the Big Apple",
            "url": [
              "https://www1.nyc.gov/site/planning/data-maps/open-data/dwn-pluto-mappluto.page#mappluto"
            ],
            "updated_at": "Nov 2019"
          },
          "tiles": [
            "https://planninglabs.carto.com/api/v1/map/01554ae6ce37545a9aa5eb49313f9079:1578673753478/0,1/{z}/{x}/{y}.mvt"
          ]
        },
        "floodplains": {
          "id": "floodplains",
          "type": "vector",
          "source-layers": [
            {
              "id": "effective-flood-insurance-rate-2007",
              "sql": "SELECT the_geom_webmercator, cartodb_id AS id, CASE WHEN fld_zone IN ('A', 'A0', 'AE') THEN 'A' WHEN fld_zone = 'VE' THEN 'V' END as fld_zone FROM floodplain_firm2007 WHERE fld_zone IN ('A', 'A0', 'AE') OR fld_zone = 'VE'"
            },
            {
              "id": "preliminary-flood-insurance-rate",
              "sql": "SELECT the_geom_webmercator, cartodb_id AS id, CASE WHEN fld_zone IN ('A', 'A0', 'AE') THEN 'A' WHEN fld_zone = 'VE' THEN 'V' WHEN fld_zone = '0.2 PCT ANNUAL CHANCE FLOOD HAZARD' THEN 'Shaded X' END as fld_zone FROM floodplain_pfirm2015 WHERE fld_zone IN ('A', 'A0', 'AE') OR fld_zone = 'VE' "
            }
          ],
          "meta": {
            "description": "Flood Insurance Rate Data provided by FEMA",
            "url": [
              "http://www.region2coastal.com/view-flood-maps-data/view-preliminary-flood-map-data/"
            ],
            "updated_at": "September 2017"
          },
          "tiles": [
            "https://planninglabs.carto.com/api/v1/map/01554ae6ce37545a9aa5eb49313f9079:1578673753478/15,16/{z}/{x}/{y}.mvt"
          ]
        },
        "aerials-2016": {
          "id": "aerials-2016",
          "type": "raster",
          "tiles": [
            "https://maps.nyc.gov/xyz/1.0.0/photo/2016/{z}/{x}/{y}.png8"
          ],
          "tileSize": 256,
          "meta": {
            "description": "NYC DoITT GIS Aerial Photography Tile Layers (TMS)",
            "url": [
              "https://maps.nyc.gov/tiles/"
            ],
            "updated_at": "n/a"
          }
        },
        "aerials-2014": {
          "id": "aerials-2014",
          "type": "raster",
          "tiles": [
            "https://maps.nyc.gov/xyz/1.0.0/photo/2014/{z}/{x}/{y}.png8"
          ],
          "tileSize": 256,
          "meta": {
            "description": "NYC DoITT GIS Aerial Photography Tile Layers (TMS)",
            "url": [
              "https://maps.nyc.gov/tiles/"
            ],
            "updated_at": "n/a"
          }
        },
        "aerials-2012": {
          "id": "aerials-2012",
          "type": "raster",
          "tiles": [
            "https://maps.nyc.gov/xyz/1.0.0/photo/2012/{z}/{x}/{y}.png8"
          ],
          "tileSize": 256,
          "meta": {
            "description": "NYC DoITT GIS Aerial Photography Tile Layers (TMS)",
            "url": [
              "https://maps.nyc.gov/tiles/"
            ],
            "updated_at": "n/a"
          }
        },
        "aerials-2010": {
          "id": "aerials-2010",
          "type": "raster",
          "tiles": [
            "https://maps.nyc.gov/xyz/1.0.0/photo/2010/{z}/{x}/{y}.png8"
          ],
          "tileSize": 256,
          "meta": {
            "description": "NYC DoITT GIS Aerial Photography Tile Layers (TMS)",
            "url": [
              "https://maps.nyc.gov/tiles/"
            ],
            "updated_at": "n/a"
          }
        },
        "aerials-2008": {
          "id": "aerials-2008",
          "type": "raster",
          "tiles": [
            "https://maps.nyc.gov/xyz/1.0.0/photo/2008/{z}/{x}/{y}.png8"
          ],
          "tileSize": 256,
          "meta": {
            "description": "NYC DoITT GIS Aerial Photography Tile Layers (TMS)",
            "url": [
              "https://maps.nyc.gov/tiles/"
            ],
            "updated_at": "n/a"
          }
        },
        "aerials-2006": {
          "id": "aerials-2006",
          "type": "raster",
          "tiles": [
            "https://maps.nyc.gov/xyz/1.0.0/photo/2006/{z}/{x}/{y}.png8"
          ],
          "tileSize": 256,
          "meta": {
            "description": "NYC DoITT GIS Aerial Photography Tile Layers (TMS)",
            "url": [
              "https://maps.nyc.gov/tiles/"
            ],
            "updated_at": "n/a"
          }
        },
        "aerials-2004": {
          "id": "aerials-2004",
          "type": "raster",
          "tiles": [
            "https://maps.nyc.gov/xyz/1.0.0/photo/2004/{z}/{x}/{y}.png8"
          ],
          "tileSize": 256,
          "meta": {
            "description": "NYC DoITT GIS Aerial Photography Tile Layers (TMS)",
            "url": [
              "https://maps.nyc.gov/tiles/"
            ],
            "updated_at": "n/a"
          }
        },
        "aerials-20012": {
          "id": "aerials-20012",
          "type": "raster",
          "tiles": [
            "https://maps.nyc.gov/xyz/1.0.0/photo/2001-2/{z}/{x}/{y}.png8"
          ],
          "tileSize": 256,
          "meta": {
            "description": "NYC DoITT GIS Aerial Photography Tile Layers (TMS)",
            "url": [
              "https://maps.nyc.gov/tiles/"
            ],
            "updated_at": "n/a"
          }
        },
        "aerials-1996": {
          "id": "aerials-1996",
          "type": "raster",
          "tiles": [
            "https://maps.nyc.gov/xyz/1.0.0/photo/1996/{z}/{x}/{y}.png8"
          ],
          "tileSize": 256,
          "meta": {
            "description": "NYC DoITT GIS Aerial Photography Tile Layers (TMS)",
            "url": [
              "https://maps.nyc.gov/tiles/"
            ],
            "updated_at": "n/a"
          }
        },
        "aerials-1951": {
          "id": "aerials-1951",
          "type": "raster",
          "tiles": [
            "https://maps.nyc.gov/xyz/1.0.0/photo/1951/{z}/{x}/{y}.png8"
          ],
          "tileSize": 256,
          "meta": {
            "description": "NYC DoITT GIS Aerial Photography Tile Layers (TMS)",
            "url": [
              "https://maps.nyc.gov/tiles/"
            ],
            "updated_at": "n/a"
          }
        },
        "aerials-1924": {
          "id": "aerials-1924",
          "type": "raster",
          "tiles": [
            "https://maps.nyc.gov/xyz/1.0.0/photo/1924/{z}/{x}/{y}.png8"
          ],
          "tileSize": 256,
          "meta": {
            "description": "NYC DoITT GIS Aerial Photography Tile Layers (TMS)",
            "url": [
              "https://maps.nyc.gov/tiles/"
            ],
            "updated_at": "n/a"
          }
        },
        "zoning-map-amendments": {
          "id": "zoning-map-amendments",
          "type": "vector",
          "source-layers": [
            {
              "id": "zoning-map-amendments",
              "sql": "SELECT * FROM (SELECT the_geom_webmercator, to_char(effective, 'MM/DD/YYYY') as effectiveformatted, extract(epoch from effective) * 1000 as effective_epoch, cartodb_id AS id, ulurpno, status, project_na FROM planninglabs.zoning_map_amendments WHERE status = 'Adopted') a"
            },
            {
              "id": "zoning-map-amendments-pending",
              "sql": "SELECT the_geom_webmercator, cartodb_id AS id, ulurpno, status, project_na FROM zoning_map_amendments WHERE status = 'Certified'"
            }
          ],
          "buffersize": {
            "mvt": 10
          },
          "meta": {
            "description": "NYC GIS Zoning Features Nov 2019, Bytes of the Big Apple",
            "url": [
              "https://www1.nyc.gov/site/planning/data-maps/open-data/dwn-gis-zoning.page"
            ],
            "data_date": "Nov 2019",
            "updated_at": "Nov 2019"
          },
          "tiles": [
            "https://planninglabs.carto.com/api/v1/map/01554ae6ce37545a9aa5eb49313f9079:1578673753478/20,21/{z}/{x}/{y}.mvt"
          ]
        },
        "landmark-historic": {
          "id": "landmark-historic",
          "type": "vector",
          "source-layers": [
            {
              "id": "historic-districts",
              "sql": "SELECT the_geom_webmercator, cartodb_id AS id, area_name FROM historic_districts_lpc WHERE status_of_ = 'DESIGNATED'"
            },
            {
              "id": "landmarks",
              "sql": "SELECT the_geom_webmercator, cartodb_id AS id, lm_name, lm_type FROM individual_landmarks_lpc WHERE (lm_type = 'Individual Landmark' OR lm_type = 'Interior Landmark') AND last_actio = 'DESIGNATED'"
            },
            {
              "id": "scenic-landmarks",
              "sql": "SELECT the_geom_webmercator, cartodb_id AS id, scen_lm_na FROM scenic_landmarks_lpc WHERE last_actio = 'DESIGNATED'"
            }
          ],
          "minzoom": 0,
          "meta": {
            "description": "Individual Landmarks Shapefile, NYC Open Data Portal",
            "url": [
              "https://data.cityofnewyork.us/Housing-Development/Individual-Landmarks/ch5p-r223/data"
            ],
            "updated_at": "17 May 2018"
          },
          "tiles": [
            "https://planninglabs.carto.com/api/v1/map/01554ae6ce37545a9aa5eb49313f9079:1578673753478/17,18,19/{z}/{x}/{y}.mvt"
          ]
        },
        "admin-boundaries": {
          "id": "admin-boundaries",
          "type": "vector",
          "source-layers": [
            {
              "id": "community-districts",
              "sql": "SELECT the_geom_webmercator, borocd, CASE WHEN LEFT(borocd::text, 1) = '1' THEN 'Manhattan ' || borocd % 100 WHEN LEFT(borocd::text, 1) = '2' THEN 'Bronx ' || borocd % 100 WHEN LEFT(borocd::text, 1) = '3' THEN 'Brooklyn ' || borocd % 100 WHEN LEFT(borocd::text, 1) = '4' THEN 'Queens ' || borocd % 100 WHEN LEFT(borocd::text, 1) = '5' THEN 'Staten Island ' || borocd % 100 END as boro_district FROM community_districts WHERE borocd % 100 < 20"
            },
            {
              "id": "neighborhood-tabulation-areas",
              "sql": "SELECT the_geom_webmercator, ntaname, ntaname AS id, a.ntacode AS geoid FROM nta_boundaries a WHERE ntaname NOT ILIKE 'park-cemetery-etc%' AND ntaname != 'Airport'"
            },
            {
              "id": "neighborhood-tabulation-areas-centroids",
              "sql": "SELECT ST_Centroid(the_geom_webmercator) as the_geom_webmercator, ntaname FROM nta_boundaries WHERE ntaname NOT ILIKE 'park-cemetery-etc%'"
            },
            {
              "id": "boroughs",
              "sql": "SELECT the_geom_webmercator, boroname FROM boro_boundaries"
            },
            {
              "id": "nyc-council-districts",
              "sql": "SELECT the_geom_webmercator, coundist FROM nyc_council_districts"
            },
            {
              "id": "ny-senate-districts",
              "sql": "SELECT the_geom_webmercator, stsendist FROM ny_senate_districts"
            },
            {
              "id": "ny-assembly-districts",
              "sql": "SELECT the_geom_webmercator, assemdist FROM ny_assembly_districts"
            },
            {
              "id": "nyc-pumas",
              "sql": "SELECT the_geom_webmercator, puma, puma AS id, puma AS geoid FROM nyc_pumas"
            },
            {
              "id": "bk-qn-mh-boundary",
              "sql": "SELECT the_geom_webmercator, label1 || '/' || label2 AS boro_boundary FROM bk_qn_mh_boundary"
            }
          ],
          "minzoom": 0,
          "buffersize": {
            "mvt": 10
          },
          "meta": {
            "description": "Administrative and Political Districts v18D, Bytes of the Big Apple",
            "url": [
              "https://www1.nyc.gov/site/planning/data-maps/open-data.page"
            ],
            "updated_at": "30 November 2018"
          },
          "tiles": [
            "https://planninglabs.carto.com/api/v1/map/01554ae6ce37545a9aa5eb49313f9079:1578673753478/6,7,8,9,10,11,12,13,14/{z}/{x}/{y}.mvt"
          ]
        },
        "transportation": {
          "id": "transportation",
          "type": "vector",
          "source-layers": [
            {
              "id": "bike-routes",
              "sql": "SELECT the_geom_webmercator, cartodb_id FROM bike_routes"
            },
            {
              "id": "subway-routes",
              "sql": "SELECT the_geom_webmercator, rt_symbol FROM mta_subway_routes"
            },
            {
              "id": "subway-stops",
              "sql": "SELECT the_geom_webmercator, name FROM mta_subway_stops"
            },
            {
              "id": "subway-entrances",
              "sql": "SELECT the_geom_webmercator, cartodb_id FROM mta_subway_entrances"
            }
          ],
          "minzoom": 0,
          "meta": {
            "description": "NYC Subway Lines and Stops - Originally Sourced from NYC DoITT GIS, combined with SI Railway data from Baruch College NYC Mass Transit Spatial Layers | Subway entrances from NYC Open Data",
            "url": [
              "https://planninglabs.carto.com/api/v2/sql?q=SELECT * FROM mta_subway_stops&format=SHP",
              "https://planninglabs.carto.com/api/v2/sql?q=SELECT * FROM mta_subway_routes&format=SHP",
              "https://data.cityofnewyork.us/Transportation/Subway-Entrances/drex-xx56",
              "https://www.baruch.cuny.edu/confluence/display/geoportal/NYC+Mass+Transit+Spatial+Layers"
            ],
            "updated_at": "21 November 2017"
          },
          "tiles": [
            "https://planninglabs.carto.com/api/v1/map/01554ae6ce37545a9aa5eb49313f9079:1578673753478/2,3,4,5/{z}/{x}/{y}.mvt"
          ]
        },
        "census-geoms": {
          "id": "census-geoms",
          "type": "vector",
          "source-layers": [
            {
              "id": "census-geoms-tracts",
              "sql": "SELECT the_geom_webmercator, ct2010, ctlabel as geolabel, boroct2010, ntacode, boroct2010 AS geoid, boroct2010 AS id FROM nyc_census_tracts"
            },
            {
              "id": "census-geoms-blocks",
              "sql": "SELECT the_geom_webmercator, ct2010, borocode || ct2010 AS boroct2010, cb2010, borocode, bctcb2010, bctcb2010 AS geoid, bctcb2010 AS id, (ct2010::float / 100)::text || ' - ' || cb2010 as geolabel FROM nyc_census_blocks"
            }
          ],
          "tiles": [
            "https://planninglabs.carto.com/api/v1/map/b0400cec385605f26e2e51a930ac8367:1556821301040/4,5/{z}/{x}/{y}.mvt"
          ]
        }
      },
      "sprite": "",
      "glyphs": "https://tiles.planninglabs.nyc/fonts/{fontstack}/{range}.pbf",
      "layers": [],
    };
  })

  /**
   *
   * Carto Data
   *
   */
  this.get(`https://${ENV.carto.domain}/**`, function(schema, request) {
    const { response: { content: { text } } } = cartoresponses.log.entries.find((entry) => {
      // decode encoded uri so it's less noisy. trim it, then extract the columns
      const recordedResponseUrl = decodeURI(entry.request.url).trim().match(/select[\s\S]*?from/i)[0];
      // replace new lines and breaks, trim, and extract columns
      const fakeRequestUrl = request.url.replace(/(\r\n|\n|\r)/gm, '').trim().match(/select[\s\S]*?from/i)[0];

      return recordedResponseUrl === fakeRequestUrl;
    });

    return JSON.parse(text);
  });

  this.urlPrefix = `${ENV.host}`;
  /**
   *
   * Users/Auth
   *
   */
  this.post('/auth/v1/login', function() {
    const token = JWT.sign({ user_id: 1, email: 'me@me.com' }, secret);

    return {
      token,
    };
  });


  /**
   *
   * BBLs
   *
   */
  this.get('/ceqr_data/v1/mappluto/validate/:bbl', function() {
    return {
      valid: true,
    };
  });

  // everything after this is scoped to this namespace
  this.namespace = '/api/v1';
  this.get('/users/:id');
  this.get('/data-packages');
  this.get('/data-packages/:id');

  /**
   *
   * Projects
   *
  }
   */
  this.get('/projects');
  this.get('/projects/:id');
  this.post('/projects', function(schema) {
    const attrs = this.normalizedRequestAttrs();

    attrs.borough = 'Manhattan';

    const project = schema.projects.create(attrs);
    project.createPublicSchoolsAnalysis({
      project,
      multipliers: {
        version: 'november-2018',
        districts: [
          {
            hs: 0.02,
            is: 0.03,
            ps: 0.05,
            csd: 1,
            borocode: 'mn',
            hsThreshold: 7126,
            psisThreshold: 630,
          },
          {
            hs: 0.02,
            is: 0.02,
            ps: 0.05,
            csd: 2,
            borocode: 'mn',
            hsThreshold: 7126,
            psisThreshold: 725,
          },
          {
            hs: 0.02,
            is: 0.03,
            ps: 0.06,
            csd: 3,
            borocode: 'mn',
            hsThreshold: 7126,
            psisThreshold: 569,
          },
          {
            hs: 0.02,
            is: 0.05,
            ps: 0.13,
            csd: 4,
            borocode: 'mn',
            hsThreshold: 7126,
            psisThreshold: 292,
          },
          {
            hs: 0.02,
            is: 0.06,
            ps: 0.16,
            csd: 5,
            borocode: 'mn',
            hsThreshold: 7126,
            psisThreshold: 225,
          },
          {
            hs: 0.02,
            is: 0.06,
            ps: 0.15,
            csd: 6,
            borocode: 'mn',
            hsThreshold: 7126,
            psisThreshold: 242,
          },
        ],
        thresholdHsStudents: 150,
        thresholdPsIsStudents: 50,
      },
      subdistrictsFromDb: [
        {
          district: 1,
          subdistrict: 2,
        },
      ],
    });

    window.project = project;

    project.save();

    return project;
  });
  this.patch('/projects');
  this.patch('/projects/:id');

  /**
   *
   * Analyses
   *
   */
  this.get('public-schools-analyses/:id');
  this.patch('public-schools-analyses/:id');

  this.get('transportation-analyses');
  this.get('transportation-analyses/:id');
  this.patch('transportation-analyses/:id');

  this.get('transportation-planning-factors');
  this.get('transportation-planning-factors/:id');
  this.post('transportation-planning-factors');
  this.patch('transportation-planning-factors/:id');
}
