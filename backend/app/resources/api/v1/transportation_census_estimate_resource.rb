class Api::V1::TransportationCensusEstimateResource < JSONAPI::Resource
  immutable
  model_name 'Db::NycAcs'

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
    Db::NycAcs.version
  end

  # If these default variable filters are changed to include non-transportation variables,
  # consider renaming this resource (and associated models/controllers) to census-estimate
  filter :variable, default: 'population,trans_total,trans_auto_total,trans_public_total'
  filter :geoid
end
