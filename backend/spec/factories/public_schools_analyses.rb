FactoryBot.define do
  factory :public_schools_analysis do
    project
    data_package { DataPackage.latest_for('public_schools') }
  end
end
