Rails.application.routes.draw do
  post 'auth/login', to: 'authentication#authenticate'
  post 'signup', to: 'users#create'

  post 'user/password_reset', to: 'user#request_new_password'

  put 'user/:id/validate', to: 'user#activate'
  put 'user/:id/password_reset', to: 'user#update_password'

  scope path: '/api' do
    resources :docs, only: [:index], path: '/swagger'

    scope path: '/v1' do
      resources :projects
      # your routes go here
    end
  end

  mount_ember_app :frontend, to: "/"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
