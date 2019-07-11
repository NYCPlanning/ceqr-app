module CeqrData
  class Base
    class << self  
      alias_method :version, :new
    end

    class_attribute :schema
    
    attr_reader :version
  
    def initialize(table)
      @table = table
      @schema = self.schema
      @dataset = eval("CEQR_DATA.from { #{@schema}[\"#{@table}\"] }")
    end

    def query
      @dataset
    end

    def version
      @table
    end

    def dataset
      @schema
    end
  
    # Geospatial
    def parse_wkb(wkb)
      RGeo::WKRep::WKBParser.new(nil, support_ewkb: true).parse(wkb)
    end
  end
end
