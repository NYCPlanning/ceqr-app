class TransportationPlanningFactors < ApplicationRecord
  after_create :set_default_values  
  before_update :compute_for_new_data_package, 
    if: Proc.new { data_package_id_changed? }

  belongs_to :data_package, optional: true
  belongs_to :transportation_analysis

  validates :land_use, presence: true

  def set_default_values
    # Use update_column here not to trigger the before_update for data_package changes
    # it all saves the data_package so that it is accessible in set_census_tract_variables method
    if land_use == "residential"
      update_column('data_package_id', DataPackage.latest_for('nyc_acs').id)
      manual_mode_splits = false
    elsif land_use == "office"
      update_column('data_package_id', DataPackage.latest_for('ctpp').id)
      manual_mode_splits = false
    end

    set_census_tract_variables

    save!
  end
  
  def compute_for_new_data_package
    set_census_tract_variables
  end

  # Triggered by TransportationAnalysis when new census tracts are selected
  def refresh_census_tracts!
    set_census_tract_variables
    save!
  end

  private

  # Query and build json blob of census tract modal splits
  def set_census_tract_variables
    return unless land_use == 'residential' || land_use == 'office'

    tract_data = []
    tract_geoids = transportation_analysis.selected_census_tract_geoids

    if land_use == "residential"      
      tract_data = CeqrData::NycAcs.version(
        data_package.table_for('nyc_acs')
      ).query.where(geoid: tract_geoids).all
    elsif land_use == "office"
      tract_data = CeqrData::CtppCensustractVariables.version(
        data_package.table_for('ctpp_censustract_variables')
      ).query.where(geoid: tract_geoids).all
    end

    self.census_tract_variables = tract_geoids.map do |geoid|
      tract = {}

      variables = tract_data.filter {|t| t[:geoid] == geoid}
      variables.each do |v|
        tract[v[:variable]] = v
      end

      tract
    end
  end
end
