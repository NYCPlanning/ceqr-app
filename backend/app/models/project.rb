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

  def borough
    boro_integers = bbls.map {|b| b[0].to_i }
    
    case boro_integers.max
    when 1 then "Manhattan"
    when 2 then "Bronx"
    when 3 then "Brooklyn"
    when 4 then "Queens"
    when 5 then "Staten Island"
    end
  end

  private

  def set_bbl_attributes
    self.bbls_geom = Db::Bbl.st_union_bbls(bbls)
    self.bbls_version = Db::Bbl.version
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
    transportation_analysis.compute_for_updated_bbls! if saved_change_to_bbls?
  end
end
