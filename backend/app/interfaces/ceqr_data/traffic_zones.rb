module CeqrData
  class TrafficZones < Base
    self.schema = "traffic_zones"

  # primary and intermediate school student enrollment projections by year and borough
    def for_geom(geom)
      @dataset.distinct.select(
      	:zone
      ).where{st_intersects(st_geomfromtext("#{geom}", "#{geom.srid}"), :geom)}.map {|z| z[:zone]}
    end
  end

end
