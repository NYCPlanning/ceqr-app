class Project < ApplicationRecord
  before_save :set_bbl_attributes
  after_create :create_analyses!
  after_update :refresh_analyses!

  validates_presence_of :bbls

  belongs_to :data_package

  has_many :editor_permissions, -> { where("permission = 'editor'") }, class_name: 'ProjectPermission'
  has_many :viewer_permissions, -> { where("permission = 'viewer'") }, class_name: 'ProjectPermission'

  has_many :editors, through: :editor_permissions, source: :user
  has_many :viewers, through: :viewer_permissions, source: :user

  has_many :project_permissions, dependent: :destroy

  # Analyses
  has_one :public_schools_analysis, dependent: :destroy
  has_one :transportation_analysis, dependent: :destroy
  has_one :community_facilities_analysis, dependent: :destroy
  has_one :air_quality_analysis, dependent: :destroy

  def boro_code
    codes = bbls.map {|b| b[0].to_i }
    codes.max
  end

  def borough
    case boro_code
    when 1 then "Manhattan"
    when 2 then "Bronx"
    when 3 then "Brooklyn"
    when 4 then "Queens"
    when 5 then "Staten Island"
    end
  end

  def land_uses
    uses = []

    uses << "residential" if self.total_units > 0
    uses = uses | commercial_land_use.map {|lu| lu["type"] }
    uses = uses | industrial_land_use.map {|lu| lu["type"] }
    uses = uses | community_facility_land_use.map {|lu| lu["type"] }

    uses.compact
  end

  private

  def set_bbl_attributes
    mappluto = CeqrData::Mappluto.version(data_package.table_for('mappluto'))

    self.bbls_geom = mappluto.st_union_bbls(bbls)
  end

  # Create all analyses on creation of project, need better validations here.
  # Note: this method will likely grow in the time it takes to process,
  # candidate for concurrency and eventual refactor
  def create_analyses!
    create_public_schools_analysis(
      data_package: DataPackage.latest_for(:public_schools)
    )

    create_transportation_analysis
    create_community_facilities_analysis
    create_air_quality_analysis
  end

  def refresh_analyses!
    # analysis models should know what they need to do to refresh
    if saved_change_to_bbls?
      public_schools_analysis.compute_for_updated_bbls!
      transportation_analysis.compute_for_updated_bbls!
    end

    # if change to land uses in RWCDS
    if (
      saved_change_to_total_units? ||
      saved_change_to_commercial_land_use? ||
      saved_change_to_industrial_land_use? ||
      saved_change_to_community_facility_land_use? ||
      saved_change_to_parking_land_use?
    )
      transportation_analysis.compute_for_changed_land_use!
    end
  end
end
