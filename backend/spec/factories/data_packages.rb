FactoryBot.define do
  factory :data_package do
    name         { "September 2099" }
    version      { "september_2099" }
    package      { "public_schools" }
    release_date { Faker::Date.between(2.years.ago, 1.year.ago) }
    schemas      { { 
      "doe_lcgms": { "table": "2018" },
      "doe_school_subdistricts": { "table": "2017"},
    } }
  end
end
