class Fix2020DataPackageSpelling < ActiveRecord::Migration[5.2]
  def up
    dataPackage = DataPackage.find_by(name: 'Februrary 2020')

    dataPackage.update_attributes({
      name: 'February 2020'
    })
  end

  def down
    dataPackage = DataPackage.find_by(name: 'February 2020')

    dataPackage.update_attributes({
      name: 'Februrary 2020'
    })
  end
end
