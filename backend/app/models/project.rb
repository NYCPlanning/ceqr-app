class Project < ApplicationRecord
  before_save :set_bbl_attributes
  after_create :create_analyses!
  after_update :refresh_analyses!

  validates_presence_of :bbls

  has_many :editor_permissions, -> { where("permission = 'editor'") }, class_name: 'ProjectPermission'
  has_many :viewer_permissions, -> { where("permission = 'viewer'") }, class_name: 'ProjectPermission'

  has_many :editors, through: :editor_permissions, source: :user
  has_many :viewers, through: :viewer_permissions, source: :user

  has_many :project_permissions, dependent: :destroy

  # Analyses
  has_one :public_schools_analysis, dependent: :destroy
  has_one :transportation_analysis, dependent: :destroy
  has_one :community_facilities_analysis, dependent: :destroy

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

  private

  def set_bbl_attributes
    mappluto = CeqrData::Mappluto.version('18v2')

    self.bbls_geom = mappluto.st_union_bbls(bbls)
    self.bbls_version = mappluto.version
  end

  # Create all analyses on creation of project, need better validations here.
  # Note: this method will likely grow in the time it takes to process,
  # candidate for concurrency and eventual refactor
  def create_analyses!
    create_public_schools_analysis(data_package: DataPackage.latest_for(:public_schools))
    create_transportation_analysis
    create_community_facilities_analysis
  end

  def refresh_analyses!
    # analysis models should know what they need to do to refresh
    if saved_change_to_bbls?
      public_schools_analysis.compute_for_updated_bbls!
      transportation_analysis.compute_for_updated_bbls!
    end
  end
end
