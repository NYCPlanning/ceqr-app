class Api::V1::BblResource < JSONAPI::Resource
  immutable
  model_name 'CeqrData::Bbl'

  attributes(
    :bbl,
    :version
  )

  def self.default_sort
    [{field: 'bbl', direction: :desc}]
  end

  def id
    @model.bbl
  end

  def version
    CeqrData::Bbl.version
  end

  filter :bbl
end