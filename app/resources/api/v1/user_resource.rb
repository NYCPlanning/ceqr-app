module Api
  module V1
    class UserResource < JSONAPI::Resource
      attributes :email
    end
  end
end