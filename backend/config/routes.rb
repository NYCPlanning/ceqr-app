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
      jsonapi_resources :users

      jsonapi_resources :projects
      jsonapi_resources :project_permissions

      # Chapters
      jsonapi_resources :public_schools_analyses
      jsonapi_resources :transportation_analyses
      jsonapi_resources :community_facilities_analyses

      # Read-only data
      jsonapi_resources :bbls
      jsonapi_resources :acs_estimates
      jsonapi_resources :ctpp_estimates
    end
  end
end
