class PublicSchoolsAnalysis < ApplicationRecord  
  after_create :set_subdistricts
  # Missing set_subdistricts on project update
  
  belongs_to :project
  belongs_to :data_package

  def set_subdistricts
    subdistricts = Db::SchoolSubdistrict.intersecting_with(project.bbls_geom)

    self.subdistricts_from_db = subdistricts.map do |s|
      {
        district: s[:district],
        subdistrict: s[:subdistrict],
        id: "#{s[:district]}#{s[:subdistrict]}",
        sdName: "District #{s[:district]} - Subdistrict #{s[:subdistrict]}"
      }
    end

    self.save!
  end
end
