Rails.application.routes.draw do
  namespace :auth do
    namespace :v1 do
      post 'login', to: 'authentication#authenticate'
      post 'signup', to: 'users#create'
      post 'password-reset', to: 'users#request_new_password'

      put 'validate', to: 'users#validate'
      put 'password-reset', to: 'users#update_password'
      put 'approve', to: 'users#approve'
    end
  end

  namespace :ceqr_data do
    namespace :v1 do
      get 'mappluto/validate/:bbl', to: 'mappluto#validate'
      get 'doe_school_subdistricts/:version/subdistricts', to: 'doe_school_subdistricts#subdistricts'
    end
  end

  namespace :api do
    namespace :v1 do
      jsonapi_resources :users

      jsonapi_resources :projects
      jsonapi_resources :project_permissions
      jsonapi_resources :data_packages

      # Analyses
      jsonapi_resources :public_schools_analyses
      jsonapi_resources :transportation_analyses
      jsonapi_resources :transportation_planning_factors
      jsonapi_resources :community_facilities_analyses
    end
  end
end
