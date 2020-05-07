class Fix2020DataPackage < ActiveRecord::Migration[5.2]
  def up
    dataPackage = DataPackage.find_by(name: 'November 2020')

    dataPackage.update_attributes({
      name: 'Februrary 2020',
      version: "february_2020",
      release_date: Date.parse('2020-02-01'),
    })
  end

  def down
    dataPackage = DataPackage.find_by(name: 'Februrary 2020')

    dataPackage.update_attributes({
      name: 'November 2020',
      version: "november_2020",
      release_date: Date.parse('2020-01-01'),
    })
  end
end
