class UserDefaultFlags < ActiveRecord::Migration[5.2]
  def change
    change_column_default :users, :email_validated, false
    change_column_default :users, :account_approved, false
  end
end
