class CreateDataPackages < ActiveRecord::Migration[5.2]
  def change
    create_table :data_packages do |t|
      t.text :name
      t.text :analysis
      t.date :release_date
      t.jsonb :config
      t.jsonb :datasets

      t.timestamps
    end

    add_reference :public_schools_analyses, :data_package, foreign_key: true
  end
end
