FactoryBot.define do
  factory :user, aliases: [:user_approved] do
    sequence(:email) { |n| "person#{n}@planning.nyc.gov" }
    password { 'foobar' }
    email_validated { true }
    account_approved { true }
  end

  factory :new_user, class: User do
    sequence(:email) { |n| "person#{n}@planning.nyc.gov" }
    password { 'foobar' }
  end

  factory :user_public, class: User do
    sequence(:email) { |n| "person#{n}@example.com" }
    password { 'foobar' }
  end
end
