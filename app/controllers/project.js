import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import carto from 'carto-promises-utility/utils/carto';

import Building from '../decorators/Building';

import round from '../utils/round';

export default Controller.extend({  
  project: alias('model.project'),
  ceqrManual: alias('model.ceqrManual'),
  
  actions: {
    createProject: function() {
      this.get('model.project').save().catch(error => {
        console.log(error);
      }).then((project) => {
        this.transitionToRoute('project.show.analysis-threshold', this.get('model.project.id'));
      });
    },
    
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
        (f) => ({
          district: f.district,
          subdistrict: f.subdistrict,
          cartodb_id: f.cartodb_id,
          id: parseInt(`${f.district}${f.subdistrict}`)
        })
      ));


      // Set Bluebook
      let bluebook = await carto.SQL(`
        SELECT
          cartodb_id,
          district,
          subd AS subdistrict,
          bldg_name,
          CASE WHEN bldg_excl is null THEN false 
              ELSE true END
              AS excluded,
          bldg_id,
          org_id,
          org_level,
          organization_name AS name,
          address,
          org_level AS grades,

          ps_capacity,
          ROUND(ps_enroll) AS ps_enroll,
          ms_capacity,
          ROUND(ms_enroll) AS ms_enroll,
          hs_capacity,
          ROUND(hs_enroll) AS hs_enroll
        FROM doe_bluebook_v1617
        WHERE charter != 'Charter'
          AND org_enroll is not null
          AND x_citywide = ''
          AND x_alternative = ''
          AND organization_name not like '%25ALTERNATIVE LEARNING CENTER%25'
          AND organization_name not like '%25YOUNG ADULT BORO CENTER%25'
          AND (district, subd) IN (VALUES ${this.get('model.project.subdistrictSqlPairs').join(',')})
      `);

      let bluebookBuildings = [];

      bluebook.forEach((b) => {
        if (/PS/.test(b.org_level)) bluebookBuildings.push(Building.create({
          ...b,
          level: 'ps',
          type: 'bluebook',
          capacity: b.ps_capacity,
          enroll: b.ps_enroll
        }));

        if (/IS/.test(b.org_level)) bluebookBuildings.push(Building.create({
          ...b,
          level: 'is',
          type: 'bluebook',
          capacity: b.ms_capacity,
          enroll: b.ms_enroll
        }));

        if (/HS/.test(b.org_level)) bluebookBuildings.push(Building.create({
          ...b,
          level: 'hs',
          type: 'bluebook',
          capacity: b.hs_capacity,
          enroll: b.hs_enroll
        }));
      });

      this.set('model.project.bluebook', bluebookBuildings);


      // Set LCGMS
      let lcgms = await carto.SQL(`
        SELECT
          lcgms.the_geom,
          lcgms.open_date,
          lcgms.location_name AS name,
          lcgms.primary_address AS address,
          lcgms.building_code AS bldg_id,
          lcgms.location_code AS org_id,
          lcgms.grades,
          lcgms.cartodb_id,
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

      let lcgmsBuildings = [];

      lcgms.forEach((b) => {
        let grades = b.grades.split(',');
        
        let isPs = grades.some(g => ['0K','01','02','03','04','05'].includes(g));
        let isIs = grades.some(g => ['06','07','08'].includes(g));
        let isHs = grades.some(g => ['09','10','11','12'].includes(g));

        if (isPs) lcgmsBuildings.push(Building.create({
          ...b,
          level: 'ps',
          type: 'lcgms'
        }));
        
        if (isIs) lcgmsBuildings.push(Building.create({
          ...b,
          level: 'is',
          type: 'lcgms'
        }));
        
        if (isHs) lcgmsBuildings.push(Building.create({
          ...b,
          level: 'hs',
          type: 'lcgms'
        }));
      });

      this.set('model.project.lcgms', lcgmsBuildings);


      // Save Project
      await this.get('model.project').save().catch(error => {
        console.log(error);
      }).then((project) => {
        this.transitionToRoute('project.show.existing-conditions', this.get('model.project.id'));
      });
    },

    saveExistingConditions: async function() {
      // TODO: Add caveat to projections over 2025
      
      let enrollmentProjections = await carto.SQL(`
        SELECT projected_ps_dist, projected_ms_dist, CAST(district AS numeric)
        FROM ceqr_sf_projection_2016_2025
        WHERE school_year LIKE '${this.get('model.project.buildYearCalculated')}%25'
          AND district IN (${this.get('model.project.subdistricts').map((d) => `'${d.district}'`).join(',')})
      `);

      let enrollmentMultipliers = await carto.SQL(`
        SELECT zone_of_dist AS multiplier, disgeo AS district, zone AS subdistrict, TRIM(level) AS level
        FROM ceqr_2019_enrollment_by_zone
        WHERE (disgeo, zone) IN (VALUES ${this.get('model.project.subdistrictSqlPairs').join(',')})
      `);

      let studentsFromNewHousing = await carto.SQL(`
        SELECT students_from_new_housing AS students, dist AS district, zone AS subdistrict, TRIM(grade_level) AS level
        FROM ceqr_housing_by_sd_2016
        WHERE (dist, zone) IN (VALUES ${this.get('model.project.subdistrictSqlPairs').join(',')})
      `);

      let scaProjects = await carto.SQL(`
        SELECT
          projects.bbl,
          projects.name,
          projects.cartodb_id,
          projects.bldg_id,
          projects.capacity,
          projects.start_date,
          projects.planned_end_date,
          subdistricts.schooldist AS district,
          subdistricts.zone AS subdistrict
        FROM (
            SELECT the_geom, schooldist, zone
            FROM doe_schoolsubdistricts_v2017
            WHERE cartodb_id IN (${this.get('model.project.subdistrictCartoIds').join(',')})
          ) AS subdistricts,
          sca_capital_projects_v032018 AS projects
        WHERE ST_Intersects(subdistricts.the_geom, projects.the_geom)
      `);

      this.set('model.project.scaProjects', scaProjects.map((b) => Building.create(b)));

      let doeUtilChanges = await carto.SQL(`
        SELECT
          at_scale_year,
          bldg_id,
          bup_url,
          eis_url,
          title
        FROM doe_significant_utilization_changes_v022018
        WHERE bldg_id IN (${this.get('model.project.buildingsBldgIds').map(b => `'${b}'`).join(',')})
      `);
      this.set('model.project.doeUtilChanges', doeUtilChanges);

      let futureNoAction = this.get('model.project.subdistricts').map((s) => {

        let dEnrollmentProjection = enrollmentProjections.findBy('district', s.district);
        let sdPsEnrollment = enrollmentMultipliers.find(
          (i) => (i.district === s.district && i.subdistrict === s.subdistrict && i.level === 'PS')
        );
        let sdIsEnrollment = enrollmentMultipliers.find(
          (i) => (i.district === s.district && i.subdistrict === s.subdistrict && i.level === 'MS')
        );

        let projectedEnroll = {
          ps: Math.round(dEnrollmentProjection.projected_ps_dist * sdPsEnrollment.multiplier),
          is: Math.round(dEnrollmentProjection.projected_ms_dist * sdIsEnrollment.multiplier)
        };
        let projectedNewStudents = {
          ps: studentsFromNewHousing.find(
            (i) => (i.district === s.district && i.subdistrict === s.subdistrict && i.level === 'PS')
          ).students,
          is: studentsFromNewHousing.find(
            (i) => (i.district === s.district && i.subdistrict === s.subdistrict && i.level === 'MS')
          ).students
        };

        let capacityTotal = {
          ps: this.get('model.project.existingSchoolTotals').filter(
            (b) => (b.level === 'ps')
          ).reduce(function(acc, value) {
            return acc + value.get('capacityTotal');
          }, 0),
  
          is: this.get('model.project.existingSchoolTotals').filter(
            (b) => (b.level === 'is')
          ).reduce(function(acc, value) {
            return acc + value.get('capacityTotal');
          }, 0),

          hs: this.get('model.project.existingSchoolTotals').filter(
            (b) => (b.level === 'hs')
          ).reduce(function(acc, value) {
            return acc + value.get('capacityTotal');
          }, 0),
        }

        return {
          district: s.district,
          subdistrict: s.subdistrict,
          sdId: parseInt(`${s.district}${s.subdistrict}`),

          ps: {
            projectedEnroll: projectedEnroll.ps,
            projectedNewStudents: projectedNewStudents.ps,
            projectedTotalEnroll: projectedEnroll.ps + projectedNewStudents.ps,
            projectedCapacity: capacityTotal.ps,
            projectedAvailSeats: capacityTotal.ps - (projectedEnroll.ps + projectedNewStudents.ps),
            projectedUtilization: round(((projectedEnroll.ps + projectedNewStudents.ps) / capacityTotal.ps), 3)
          },
          is: {
            projectedEnroll: projectedEnroll.is,
            projectedNewStudents: projectedNewStudents.is, 
            projectedTotalEnroll: projectedEnroll.is + projectedNewStudents.is,
            projectedCapacity: capacityTotal.is,
            projectedAvailSeats: capacityTotal.is - (projectedEnroll.is + projectedNewStudents.is),
            projectedUtilization: round(((projectedEnroll.is + projectedNewStudents.is) / capacityTotal.is), 3)
          }
        }
      });
      this.set('model.project.futureNoAction', futureNoAction);

      await this.get('model.project').save().catch(error => {
        console.log(error);
      }).then((project) => {
        this.transitionToRoute('project.show.no-action', project.id);
      });
    }
  }
});
