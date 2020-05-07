class UpdateScaCapitalProjectsDataPackage201911 < ActiveRecord::Migration[5.2]
  def up
    dataPackage = DataPackage.find_by(name: 'November 2019')

    schemas = dataPackage.schemas

    schemas["sca_capacity_projects"]["table"] = "112019"

    dataPackage.update(schemas: schemas)
  end

  def down
    dataPackage = DataPackage.find_by(name: 'November 2019')

    schemas = dataPackage.schemas

    schemas["sca_capacity_projects"]["table"] = "022019"

    dataPackage.update(schemas: schemas)
  end
end
