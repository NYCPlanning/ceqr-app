class CeqrData::Bbl < CeqrDataBase
  include ::ReadOnlyModel

  def self.st_union_bbls(bbls)
    select('ST_MULTI(ST_UNION(geom))').where(bbl: bbls).first.st_multi
  end
end