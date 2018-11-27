class CleanUpFortuneLeftovers < ActiveRecord::Migration[5.2]
  def change
    change_table :projects do |t|
      t.remove :fortune_id
      t.remove :users
      t.remove :viewers
    end
  end
end
