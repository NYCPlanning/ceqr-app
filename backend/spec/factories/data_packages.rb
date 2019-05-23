FactoryBot.define do
  factory :data_package do
    name         { "September 2099" }
    analysis     { "public_schools" }
    release_date { Faker::Date.between(2.years.ago, 1.year.ago) }
    config       { {} }
    datasets     { { "lcgms": { "table": "lcgms.2018" } } }
  end
end
