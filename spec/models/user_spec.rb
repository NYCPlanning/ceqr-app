require 'rails_helper'

RSpec.describe User, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"

  it { should validate_presence_of(:email) }
  it { should validate_presence_of(:password_digest) }
end
