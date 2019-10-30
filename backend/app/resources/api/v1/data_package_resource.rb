module Api
  module V1
    class DataPackageResource < BaseResource
      immutable
    
      attributes(
        :name,
        :package,
        :version,
        :release_date,
        :schemas
      )
    
      def self.default_sort
        [{field: 'release_date', direction: :desc}]
      end
    
      filter :package
      filter :version
    end
  end
end
