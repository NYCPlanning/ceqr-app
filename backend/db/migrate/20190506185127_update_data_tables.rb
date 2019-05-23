class UpdateDataTables < ActiveRecord::Migration[5.2]
  def up
    Rake::Task['ceqr:update_datatables'].invoke
  end
end
