class Api::V1::AcsEstimateResource < JSONAPI::Resource
  immutable
  model_name 'CeqrData::NycAcs'

  attributes(
    :geoid,
    :variable,
    :value,
    :moe
  )

  def self.default_sort
    [{field: 'geoid', direction: :desc}, {field: 'variable', direction: :desc}]
  end

  def id
    "#{@model.geoid}_#{@model.variable}"
  end

  def version
    CeqrData::NycAcs.version
  end

  filter :variable
  filter :geoid
end
