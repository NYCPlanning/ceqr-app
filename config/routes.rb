Rails.application.routes.draw do
  post 'auth/login', to: 'authentication#authenticate'
  post 'signup', to: 'users#create'

  put 'user/validate', to: 'users#validate'

  post 'user/password_reset', to: 'users#request_new_password'
  put 'user/password_reset', to: 'users#update_password'

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
