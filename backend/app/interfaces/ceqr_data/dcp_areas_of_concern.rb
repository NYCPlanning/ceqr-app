module CeqrData
  class DcpAreasOfConcern < Base  
    self.schema = "dcp_areas_of_concern"

    # return true if project bbl intersects
    def intersects?(bbl_geom)
      !!@dataset.where{ ST_INTERSECTS(geom, "SRID=4326;#{bbl_geom.to_s}") }.first
    end
  end
end
