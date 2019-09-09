class AddCensusAndCtppToTransportation < ActiveRecord::Migration[5.2]
  def change
    add_column :transportation_analyses, :acs_modal_splits, :jsonb, array: true, default: [], null: false
    add_column :transportation_analyses, :ctpp_modal_splits, :jsonb, array: true, default: [], null: false
  end
end
