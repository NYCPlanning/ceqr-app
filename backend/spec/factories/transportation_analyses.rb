FactoryBot.define do
  factory :transportation_analysis do
    project
    nyc_acs_data_package { DataPackage.latest_for('nyc_acs') }
    ctpp_data_package { DataPackage.latest_for('ctpp') }
  end
end
