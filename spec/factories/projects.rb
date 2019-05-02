FactoryBot.define do
  factory :project do
    name         { Faker::Address.street_name }
    bbls         { [1000477501] }
    bbls_geom    { generate(:multi_polygon) }
    build_year   { Faker::Date.between(1.year.from_now, 30.years.from_now).year }
    senior_units { Faker::Number.between(0, 50) }
    total_units  { Faker::Number.between(75, 750) }
  end

  factory :project_api, class: Project do
    name         { Faker::Address.street_name }
    bbls         { [1000477501] }
    build_year   { Faker::Date.between(1.year.from_now, 30.years.from_now).year }
    senior_units { Faker::Number.between(0, 50) }
    total_units  { Faker::Number.between(75, 750) }
  end

  sequence :multi_polygon do
    RGeo::Cartesian
      .preferred_factory(srid: 4326)
      .parse_wkt("MULTIPOLYGON (((-74.0099084890881 40.708117924001066, -74.01022903213298 40.70775652803635, -74.01112059856906 40.708288226011604, -74.01079076752514 40.708695737776026, -74.0099084890881 40.708117924001066)))")
  end
end
