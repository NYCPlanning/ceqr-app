class MoveUserPasswordColumn < ActiveRecord::Migration[5.2]
  def change
    change_table :users do |t|
      t.rename :password, :password_digest
    end
  end
end
