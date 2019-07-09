class AddInOutDistsToTransportationAnalysis < ActiveRecord::Migration[5.2]
  def change
    default_in_out_dist = {
      am: {
        in: 50,
        out: 50
      },
      md: {
        in: 50,
        out: 50
      },
      pm: {
        in: 50,
        out: 50
      },
      saturday: {
        in: 50,
        out: 50
      }
    }

    add_column :transportation_analyses, :in_out_dists, :jsonb, default: default_in_out_dist
  end
end
