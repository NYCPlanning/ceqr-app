import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import carto from 'carto-promises-utility/utils/carto';
import ExistingConditions from '../analysis/existingConditions';

export default Controller.extend({  
  project: alias('model.project'),
  ceqrManual: alias('model.ceqrManual'),
  
  actions: {
    saveProject: function() {
      this.get('model.project').save();
    },
    
    saveProjectDetails: async function() {
      let bbls = this.get('model.project.bbls');

      // Set subdistricts
      let subdistricts = await carto.SQL(`
        SELECT DISTINCT
          subdistricts.cartodb_id,
          subdistricts.the_geom,
          subdistricts.schooldist AS district,
          subdistricts.zone AS subdistrict
        FROM doe_schoolsubdistricts_v2017 AS subdistricts, (
          SELECT the_geom, bbl
          FROM mappluto_v1711
          WHERE bbl IN (${bbls.join(',')})
        ) pluto
        WHERE ST_Intersects(pluto.the_geom, subdistricts.the_geom)
      `);
      this.set('model.project.subdistricts', subdistricts.map(
        (f) => ({district: f.district, subdistrict: f.subdistrict, cartodb_id: f.cartodb_id})
      ));

      // Set bluebook
      let bluebook = await carto.SQL(`
        SELECT the_geom, district, subd AS subdistrict, cartodb_id
        FROM doe_bluebook_v1617
        WHERE charter != 'Charter'
          AND org_enroll is not null
          AND x_citywide = ''
          AND x_alternative = ''
          AND organization_name not like '%25ALTERNATIVE LEARNING CENTER%25'
          AND organization_name not like '%25YOUNG ADULT BORO CENTER%25'
          AND (district, subd) IN (VALUES ${this.get('model.project.subdistrictSqlPairs').join(',')})
      `);
      this.set('model.project.bluebook', bluebook.map(
        (b) => ({cartodb_id: b.cartodb_id})
      ));

      // Set LCGMS
      let lcgms = await carto.SQL(`
        SELECT
          lcgms.the_geom,
          lcgms.open_date,
          lcgms.location_name AS name,
          lcgms.grades,
          subdistricts.schooldist AS district,
          subdistricts.zone AS subdistrict
        FROM doe_lcgms_v201718 AS lcgms, (
          SELECT the_geom, schooldist, zone
          FROM doe_schoolsubdistricts_v2017
          WHERE cartodb_id IN (${this.get('model.project.subdistrictCartoIds').join(',')})
        ) subdistricts
        WHERE open_date LIKE '%252017'
          AND managed_by_name = 'DOE'
          AND ST_Intersects(subdistricts.the_geom, lcgms.the_geom)   
      `);
      this.set('model.project.lcgms', lcgms.map((b) => b));

      // Existing conditions
      let psBluebook = await carto.SQL(`
        SELECT
          district,
          subd AS subdistrict,
          bldg_name,
          CASE WHEN bldg_excl is null THEN false 
              ELSE true END
              AS excluded,
          bldg_id,
          org_level,
          organization_name AS name,
          address,
          org_level AS grades,
          ps_capacity AS capacity,
          ROUND(ps_enroll) AS enroll
        FROM doe_bluebook_v1617
        WHERE cartodb_id IN (${this.get('model.project.bluebookCartoIds').join(',')})
          AND org_level like '%25PS%25'
      `);
      psBluebook.map((school) => school.type = 'bluebook');

      let isBluebook = await carto.SQL(`
        SELECT
          district,
          subd AS subdistrict,
          organization_name AS name,
          address,
          org_level AS grades,
          ROUND(ms_enroll) AS enroll,
          CASE WHEN bldg_excl is null THEN ms_capacity
              ELSE null END
              AS capacity,
          CASE WHEN bldg_excl is null THEN ROUND(ms_capacity - ms_enroll)
              ELSE ROUND(0 - ms_enroll) END
              AS seats,
          CASE WHEN bldg_excl is null THEN ROUND((ms_enroll / ms_capacity)::numeric, 3)
              ELSE null END
              AS utilization
        FROM doe_bluebook_v1617
        WHERE cartodb_id IN (${this.get('model.project.bluebookCartoIds').join(',')})
          AND org_level like '%25IS%25'
      `);
      isBluebook.map((school) => school.type = 'bluebook');

      let lcgmsSchools = {
        ps: [],
        is: [],
        hs: [],
      };

      this.get('model.project.lcgms').forEach((school) => {
        school.type = 'lcgms';
        
        let grades = school.grades.split(',');
        
        let isPs = grades.some(g => ['0K','01','02','03','04','05'].includes(g));
        let isIs = grades.some(g => ['06','07','08'].includes(g));
        let isHs = grades.some(g => ['09','10','11','12'].includes(g));

        if (isPs) lcgmsSchools.ps.push(school);
        if (isIs) lcgmsSchools.is.push(school);
        if (isHs) lcgmsSchools.hs.push(school);
      });

      let ec = this.get('model.project.subdistricts').map((s) => {
        return {
          district: s.district,
          subdistrict: s.subdistrict,
          sdId: parseInt(`${s.district}${s.subdistrict}`),

          ps: ExistingConditions.create({
            bluebookBuildings: psBluebook.filter(
              (b) => (b.district === s.district && b.subdistrict === s.subdistrict)
            ),
            lcgmsBuildings: lcgmsSchools.ps.filter(
              (b) => (b.district === s.district && b.subdistrict === s.subdistrict)
            ),
          }),
          is: ExistingConditions.create({
            bluebookBuildings: isBluebook.filter(
              (b) => (b.district === s.district && b.subdistrict === s.subdistrict)
            ),
            lcgmsBuildings: lcgmsSchools.is.filter(
              (b) => (b.district === s.district && b.subdistrict === s.subdistrict)
            ),
          }),
        }
      });
      this.set('model.project.existingConditions', ec);


      await this.get('model.project').save();
      this.transitionToRoute('project.existing-conditions');
    },

    saveExistingConditions() {
      // Get Capacity for 
      console.log(this.get('model.project.existingConditions.0.ps.capacityTotal'));
    }
  }
});
