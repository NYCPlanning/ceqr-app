FactoryBot.define do
  factory :data_package do
    name         { "September 2099" }
    analysis     { "public_schools" }
    release_date { Faker::Date.between(2.years.ago, 1.year.ago) }
    config       do 
                    {
                      multipliers: {
                        "version": "november-2018",
                        "thresholdPsIsStudents": 50,
                        "thresholdHsStudents": 150,
                        "districts": [
                          {
                            "csd": 15,
                            "ps": 0.18,
                            "is": 0.05,
                            "hs": 0.09,
                            "psisThreshold": 220,
                            "hsThreshold": 1767,
                            "borocode": "bk"
                          },
                        ]
                      }
                    }  
                  end
    datasets     { { 
      "lcgms": { "table": "lcgms.2018" },
      "school_subdistricts": { "table": "doe_schools_subdistricts.2017"},
    } }
  end
end
