RSpec::Matchers.define :match_json_schema do |schema|
  match do |data|
    schema_directory = "#{Dir.pwd}/spec/support/json_schemas"
    schema_path = "#{schema_directory}/#{schema}.json"
    schema = Pathname.new(schema_path)

    if data.class == Array
      data.each { |json| JSONSchemer.schema(schema).valid?(json) }
    elsif data.class == Hash
      JSONSchemer.schema(schema).valid?(data)
    end
  end
end
