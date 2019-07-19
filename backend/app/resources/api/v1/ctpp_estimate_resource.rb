class Api::V1::CtppEstimateResource < JSONAPI::Resource
  immutable
  model_name 'Db::CtppEstimate'

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
    Db::CtppEstimate.version
  end

  filter :variable
  filter :geoid
end
