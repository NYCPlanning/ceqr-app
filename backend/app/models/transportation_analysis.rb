class TransportationAnalysis < ApplicationRecord
  before_save :compute_for_model_update
  before_create :compute_for_project_create_or_update

  belongs_to :project

  # This is a workaround for a lot of fancy inititalization that the activerecord-postgis-adapter does
  # for the attribute types it defines. 'ActiveRecord::ConnectionAdapters::PostGIS::OID::Spatial' is extended
  # in model/attributes/lng_lat.rb
  attribute :jtw_study_area_centroid, Attributes::LngLat.new('', 'geometry(Point,4326)')

  def compute_for_updated_bbls!
    compute_for_project_create_or_update
    save!
  end

  private
  def testVersion
    '2010'
  end

  def testVersion2
    '2014'
  end
    # # Find and set the intersecting Census Tracts
    def compute_required_study_selection
      tracts = CeqrData::NycCensusTracts.version(testVersion).for_geom(project.bbls_geom)
      self.required_jtw_study_selection = tracts || []
    end

    # Find and set the centroid
    def compute_study_area_centroid
      geoids = self.required_jtw_study_selection + self.jtw_study_selection
      # Why are we getting back empty arrays? Does this indicate something else is wrong?
      if geoids != []
        centroid = CeqrData::NycCensusTracts.version(testVersion).st_union_geoids_centroid(geoids)
        self.jtw_study_area_centroid = centroid
      end
    end

    # Find and set the adjacent Census Tracts as initial study selection
    def compute_initial_study_selection
      tracts = CeqrData::NycCensusTracts.version(testVersion).touches_geoids(self.required_jtw_study_selection)
      self.jtw_study_selection = tracts || []
    end

    # Find, set, and save the traffic zone
    def compute_traffic_zone
      zones = CeqrData::TrafficZones.version(testVersion2).for_geom(project.bbls_geom)

      # Currently set traffic zone to most conservative touched by study area
      self.traffic_zone = zones.max
    end

    # Call methods to compute data that needs to be refreshed when the model is updated
    def compute_for_model_update
      compute_study_area_centroid
    end

    # Call methods to compute data that needs to be refreshed when model's owning project
    # is updated (or at analysis creation)
    def compute_for_project_create_or_update
      compute_traffic_zone
      compute_required_study_selection
      compute_initial_study_selection
      compute_study_area_centroid
    end
end
