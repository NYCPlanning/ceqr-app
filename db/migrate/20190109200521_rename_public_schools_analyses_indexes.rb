class RenamePublicSchoolsAnalysesIndexes < ActiveRecord::Migration[5.2]
  def change
    reversible do |dir|
      dir.up do
        execute <<-SQL
          ALTER INDEX "public"."public_school_analyses_pkey" RENAME TO "public_schools_analyses_pkey";
          ALTER TABLE "public"."public_schools_analyses" ALTER COLUMN "id" SET DEFAULT nextval('public_schools_analyses_id_seq'::regclass);
        SQL
      end
      dir.down do
      end
    end
  end
end
