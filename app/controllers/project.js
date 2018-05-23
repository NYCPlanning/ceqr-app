import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import carto from 'carto-promises-utility/utils/carto';
import ExistingConditions from '../analysis/existingConditions';

import round from '../utils/round';

export default Controller.extend({  
  project: alias('model.project'),
  ceqrManual: alias('model.ceqrManual'),
  
  actions: {
    createProject: function() {
      this.get('model.project').save().catch(error => {
        console.log(error);
      }).then((project) => {
        this.transitionToRoute('project.show.project-details', project.id);
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
          org_id,
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
          ms_capacity AS capacity,
          ROUND(ms_enroll) AS enroll
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


      await this.get('model.project').save().catch(error => {
        console.log(error);
      }).then((project) => {
        this.transitionToRoute('project.show.existing-conditions', project.id);
      });
    },

    saveExistingConditions: async function() {
      let enrollmentProjections = await carto.SQL(`
        SELECT projected_ps_dist, projected_ms_dist, CAST(district AS numeric)
        FROM ceqr_sf_projection_2016_2025
        WHERE school_year LIKE '${this.get('model.project.buildYear')}%25'
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
          projects.the_geom,
          projects.bbl,
          projects.school,
          projects.cartodb_id,
          construction.data_as_of,
          subdistricts.schooldist AS district,
          subdistricts.zone AS subdistrict
        FROM (
            SELECT the_geom, schooldist, zone
            FROM doe_schoolsubdistricts_v2017
            WHERE cartodb_id IN (${this.get('model.project.subdistrictCartoIds').join(',')})
          ) AS subdistricts,
          sca_project_sites_v03222018 AS projects
        JOIN (
          SELECT bbl, MAX(to_timestamp(data_as_of, 'MM/DD/YYYY')) AS data_as_of
          FROM sca_project_construction_v02222018
          GROUP BY bbl
        ) construction 
        ON projects.bbl = construction.bbl
        WHERE ST_Intersects(subdistricts.the_geom, projects.the_geom)
      `);
      this.set('model.project.scaProjects', scaProjects);

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
        let scaUnderConstruction = scaProjects.filter(
          (b) => (b.district === s.district && b.subdistrict === s.subdistrict)
        );

        let capacityTotal = {
          ps: this.get('model.project.existingConditions').find(
            (b) => (b.district === s.district && b.subdistrict === s.subdistrict)
          ).ps.get('capacityTotal'),
  
          is: this.get('model.project.existingConditions').find(
            (b) => (b.district === s.district && b.subdistrict === s.subdistrict)
          ).is.get('capacityTotal')
        }

        return {
          district: s.district,
          subdistrict: s.subdistrict,
          sdId: parseInt(`${s.district}${s.subdistrict}`),

          scaUnderConstruction,
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
