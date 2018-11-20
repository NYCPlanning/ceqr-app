Rails.application.routes.draw do
  namespace :auth do
    namespace :v1 do
      post 'login', to: 'authentication#authenticate'
      post 'signup', to: 'users#create'
      post 'password-reset', to: 'users#request_new_password'

      put 'validate', to: 'users#validate'
      put 'password-reset', to: 'users#update_password'
    end
  end

  namespace :api do
    namespace :v1 do
      jsonapi_resources :projects
      jsonapi_resources :users
    end
  end

  mount_ember_app :frontend, to: "/"
end
