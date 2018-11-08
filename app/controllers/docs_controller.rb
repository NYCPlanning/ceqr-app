require 'jsonapi_swagger_helpers'

class DocsController < ActionController::API
  include JsonapiSwaggerHelpers::DocsControllerMixin

  swagger_root do
    key :swagger, '2.0'
    info do
      key :version, '1.0.0'
      key :title, 'CEQR App'
      key :description, 'CEQR automation tool for the City of New York'
      contact do
        key :name, 'Jonathan Pichot'
        key :email, 'jpichot@planning.nyc.gov'
      end
    end
    key :basePath, '/api'
    key :consumes, ['application/json']
    key :produces, ['application/json']
  end
end
