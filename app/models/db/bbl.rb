class Db::Bbl < DataRecord
  self.dataset = "mappluto"
  self.version = "18v2"

  def self.st_union_bbls(bbls)
    select('ST_MULTI(ST_UNION(geom))').where(bbl: bbls).first.st_multi
  end
end