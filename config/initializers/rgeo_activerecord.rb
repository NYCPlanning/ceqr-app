RGeo::ActiveRecord::SpatialFactoryStore.instance.tap do |config|
  config.default = RGeo::Cartesian.preferred_factory(srid: 4326)
end