class MoveFortuneRelationships < ActiveRecord::Migration[5.2]
  def change
    reversible do |dir|
      dir.up do
        projects = Project.all
        
        projects.each do |p|
          p.users.each do |u|
            user = User.find_by(fortune_id: u)

            ProjectPermission.create({
              user_id: user.id,
              project_id: p.id,
              permission: "editor"
            })
          end

          p.viewers.each do |v|
            user = User.find_by(fortune_id: v)

            ProjectPermission.create({
              user_id: user.id,
              project_id: p.id,
              permission: "viewer"
            })
          end
        end
      end

      dir.down do
        ProjectPermission.delete_all
      end
    end
  end
end
