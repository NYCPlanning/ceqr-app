class ApplyDataPackagesToExistingData < ActiveRecord::Migration[5.2]
  def change
    versions = ['november-2017', 'november-2018']

    versions.each do |v|
      dp = DataPackage.find_by_name v.sub('-', ' ').humanize

      PublicSchoolsAnalysis.where("data_tables ->> 'version' = '#{v}'").each do |a|
        a.data_package = dp
        a.save!
      end
    end
  end
end
