class Attributes::LngLat < ActiveRecord::ConnectionAdapters::PostGIS::OID::Spatial
  def deserialize(value)
    point = cast_value(value)
    to_lng_lat(point) if point
  end

  private
  def to_lng_lat(point)
    [point.x, point.y]
  end
end
