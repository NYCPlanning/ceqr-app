class BetterBbls < ActiveRecord::Migration[5.2]
  def change
    add_column :projects, :bbls_geom, :multi_polygon, srid: 4326
    add_column :projects, :bbls_version, :text
    
    Project.all.each do |p|
      p.bbls_geom = CeqrData::Bbl.st_union_bbls(p.bbls)
      p.bbls_version = 'mappluto_17v1.1'
      p.save
    end
  end
end