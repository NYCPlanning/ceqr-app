class PrepareBuildingsWithGeojson < ActiveRecord::Migration[5.2]
  def change
    # Add `geojson` property to bluebook
    PublicSchoolsAnalysis.all.each do |analysis|
      # Add `geojson` to bluebook
      analysis.bluebook.each do |bb|
        db = CeqrData::ScaBluebook.version(analysis.data_package.table_for("sca_bluebook"))
        response = db.query.select(:geom).where({
          org_id: bb["org_id"],
          bldg_id: bb["bldg_id"]
        }).first

        if response.nil?
          puts "empty bluebook"
          puts "analysis id: #{analysis.id}"
          puts bb
          analysis.bluebook.delete(bb)
          next
        end

        geom = response[:geom]

        bb["geojson"] = RGeo::GeoJSON.encode(
          RGeo::GeoJSON::Feature.new(
            RGeo::WKRep::WKBParser.new(nil, support_ewkb: true).parse(geom)
          )
        )
      end

      # Add `geojson` to lcgms
      analysis.lcgms.each do |bb|
        db = CeqrData::DoeLcgms.version(analysis.data_package.table_for("doe_lcgms"))
        response = db.query.select(:geom).where({
          org_id: bb["org_id"],
          bldg_id: bb["bldg_id"]
        }).first

        if response.nil?
          puts "empty lcmgs"
          puts "analysis id: #{analysis.id}"
          puts bb
          next
        end

        geom = response[:geom]

        bb["geojson"] = RGeo::GeoJSON.encode(
          RGeo::GeoJSON::Feature.new(
            RGeo::WKRep::WKBParser.new(nil, support_ewkb: true).parse(geom)
          )
        )
      end

      # Add `geojson` to sca projects
      analysis.sca_projects.each do |bb|
        db = CeqrData::ScaCapitalProjects.version(analysis.data_package.table_for("sca_capital_projects"))
        response = db.query.select(:geom).where({
          project_dsf: bb["project_dsf"],
        }).first

        if response.nil?
          puts "empty sca project"
          puts "analysis id: #{analysis.id}"
          puts bb
          next
        end

        geom = response[:geom]

        bb["geojson"] = RGeo::GeoJSON.encode(
          RGeo::GeoJSON::Feature.new(
            RGeo::WKRep::WKBParser.new(nil, support_ewkb: true).parse(geom)
          )
        )
        bb["funding_current_budget"] = bb["funding_budget_15_19"]
      end

      analysis.save!
    end
  end
end
