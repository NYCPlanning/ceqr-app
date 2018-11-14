FactoryBot.define do
  factory :user, aliases: [:user_approved] do
    email { "test@planning.nyc.gov" }
    password { 'foobar' }
  end

  factory :user_public, class: User do
    email { "test@example.com" }
    password { 'foobar' }
  end
end
