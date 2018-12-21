class AddDataVersionToBluebookBuildings < ActiveRecord::Migration[5.2]
  def change
    reversible do |dir|
      dir.up do
        execute <<-SQL
          UPDATE public_schools_analyses 
          SET bluebook = bluebook || concat('{"dataVersion":"', data_tables->>'version', '"}')::jsonb
        SQL
      end
      dir.down do
      end
    end
  end
end
