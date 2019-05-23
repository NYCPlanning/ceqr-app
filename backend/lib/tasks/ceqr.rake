namespace :ceqr do
  desc "Update data_tables in all Public Schools Analyses"
  task update_datatables: :environment do
    versions = ['november-2017', 'november-2018', 'may-2019']

    versions.each do |v|      
      file_path = Rails.root.join('frontend', 'public', 'data-tables', 'public-schools', "#{v}.json").to_s
      file = File.read file_path
      json = JSON.parse(file)

      PublicSchoolsAnalysis.where("data_tables ->> 'version' = '#{v}'").each do |a|
        a.data_tables = json
        a.save!
      end
    end
  end

end
