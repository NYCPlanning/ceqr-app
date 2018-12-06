class LoadBblsData
  include Interactor

  def call
    conn = PG.connect(ENV['CEQR_DATA_DB_URL'])
    conn.type_map_for_results = PG::BasicTypeMapForResults.new conn

    context.bbls_geom = conn.exec(
      <<-SQL
        SELECT ST_UNION(geom_srid4269) AS the_geom
        FROM mappluto
        WHERE bbl IN (#{context.bbls.join(',')})
      SQL
    )

    context.bbls_boro_abbr = conn.exec(
      <<-SQL
        SELECT DISTINCT borough AS boro_abbr
        FROM mappluto
        WHERE bbl IN (#{context.bbls.join(',')})
      SQL
    )
  end
end

