class Api::V1::BblResource < JSONAPI::Resource
  immutable
  model_name 'Db::Bbl'

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
    Db::Bbl.version
  end

  filter :bbl
end
