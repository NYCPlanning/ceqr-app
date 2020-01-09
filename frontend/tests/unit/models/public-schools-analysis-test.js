import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setupMirage } from "ember-cli-mirage/test-support";
import { association } from 'ember-cli-mirage';

module('Unit | Model | public schools analysis', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('calculates currentMultiplier correctly, tests that currentMultiplier is now multipliers property in futureResidentialDev', async function(assert) {
    /*
      input variables:
      * subidistrictsFromDb (array of objects)
        * subdistrictsFromDb.district (integer)
      * residentialDevelopments
        * residentialDevelopments[n].name (string)
        * residentialDevelopments[n].district (integer)
        * residentialDevelopments[n].subdistrict (integer)
        * residentialDevelopments[n].multipliers (object)
      * multipliers
        * multipliers.version (string)
        * multipliers.districts (array of objects)

      tested variables:
      * currentMultiplier (object)
      * futureResidentialDev (array of objects)
        *futureResidentialDev.multipliers (object)

    */

    let analysisMirage = server.create('public-schools-analysis', {
    project: association({
      borough: 'Manhattan'
    }),
    subdistrictsFromDb: () => [
      {
        district: 2,
      }
    ],
    residentialDevelopments: () => [
      {
        name: 'Hamster Heaven',
        district: 1,
        subdistrict: 2,
        multipliers: {},
      },
    ],
    multipliers: () => ({
        version: "november-2018",
        districts: [
          {
            hs: 0.02,
            is: 0.03,
            ps: 0.05,
            csd: 1,
            borocode: "mn",
            hsThreshold: 7126,
            psisThreshold: 630
          },
          {
            hs: 0.01,
            is: 0.02,
            ps: 0.05,
            csd: 2,
            borocode: "mn",
            hsThreshold: 7221,
            psisThreshold: 725
          },
        ]
      })
    })

    let project = await this.owner.lookup('service:store').findRecord(
      'project', analysisMirage.projectId, { include: 'public-schools-analysis' }
    );
    let analysis = await project.get('publicSchoolsAnalysis');

    const district = 2
    const hsThreshold = 7221

    assert.equal(analysis.currentMultiplier.csd, district);
    assert.equal(analysis.futureResidentialDev[0].multipliers.csd, district); // should match the multiplier of the corresponding district
    assert.equal(analysis.currentMultiplier.hsThreshold, hsThreshold);
    assert.equal(analysis.futureResidentialDev[0].multipliers.hsThreshold, hsThreshold);
  });

  //
  test('calculates esEffect correctly', async function(assert) {
    /*
      input variables:
      * the project model's totalUnits and seniorUnits (integers)
      * multipliers.version (string)
      * multipliers.districts[n].hs/is/ps (number)
      * multipliers.district[n].csd (integer, represents district that should match subdistrictsFromDb)
      * subdistrictsFromDb (array of objects)
        * subdistrictsFromDb[n].district (integer)

      tested variables:
      * netUnits (integer)
      * estEsStudents (integer)
      * estIsStudents (integer)
      * estEsMsStudents (integer)
      * estHsStudents (integer)
      * esEffect (boolean)
      * hsEffect (boolean)
      * indirectEffect (boolean)

      Here we test THREE conditions:
        * hsEffect is true but esEffect is false (making indirectEffect true)
        * esEffect is true but hsEffect is false (making indirectEffect true)
        * hsEffect and esEffect are both false (making indirectEffect false)
    */

    let threeDistrictMultipliers = {
      project: association({
        totalUnits: 500,
        seniorUnits: 50
      }),
      multipliers: () => ({
          version: "november-2018",
          districts: [
            {
              hs: 0.24,
              is: 0.05,
              ps: 0.09,
              csd: 1,
            },
            {
              hs: 0.09,
              is: 0.09,
              ps: 0.09,
              csd: 2,
            },
            {
              hs: 0.09,
              is: 0.05,
              ps: 0.05,
              csd: 3,
            }
          ],
          thresholdHsStudents: 105,
          thresholdPsIsStudents: 70
        })
    }


    let analysisMirageHsEffectTrue = server.create('public-schools-analysis', {
      subdistrictsFromDb: [
        {
          district: 1
        }
      ],
      project: threeDistrictMultipliers.project,
      multipliers: threeDistrictMultipliers.multipliers
    })

    let analysisMirageEsEffectTrue = server.create('public-schools-analysis', {
      subdistrictsFromDb: [
        {
          district: 2
        }
      ],
      project: threeDistrictMultipliers.project,
      multipliers: threeDistrictMultipliers.multipliers
    })

    let analysisMirageAllFalse = server.create('public-schools-analysis', {
      subdistrictsFromDb: [
        {
          district: 3
        }
      ],
      project: threeDistrictMultipliers.project,
      multipliers: threeDistrictMultipliers.multipliers
    })

    let projectHsEffectTrue = await this.owner.lookup('service:store').findRecord(
      'project', analysisMirageHsEffectTrue.projectId, { include: 'public-schools-analysis' }
    );
    let projectEsEffectTrue = await this.owner.lookup('service:store').findRecord(
      'project', analysisMirageEsEffectTrue.projectId, { include: 'public-schools-analysis' }
    );
    let projectAllFalse = await this.owner.lookup('service:store').findRecord(
      'project', analysisMirageAllFalse.projectId, { include: 'public-schools-analysis' }
    );

    let analysisHsEffectTrue = await projectHsEffectTrue.get('publicSchoolsAnalysis');
    let analysisEsEffectTrue = await projectEsEffectTrue.get('publicSchoolsAnalysis');
    let analysisAllFalse = await projectAllFalse.get('publicSchoolsAnalysis');

    assert.equal(projectHsEffectTrue.netUnits, 450) // project.totalUnits - project.seniorUnits = 500 - 50
    assert.equal(analysisHsEffectTrue.estEsStudents, 41) // math.ceil(currentMultiplier.ps * project.netUnits) = 0.09 * 450
    assert.equal(analysisHsEffectTrue.estIsStudents, 23) // math.ceil(currentMultiplier.is * project.netUnits) = 0.05 * 450
    assert.equal(analysisHsEffectTrue.estEsMsStudents, 64) // estEsStudents + estIsStudents
    assert.equal(analysisHsEffectTrue.estHsStudents, 108) // math.ceil(currentMultiplier.hs * project.netUnits) = 0.24 * 450

    // condition 1: hsEffects is true but esEffect is false, making indirectEffect TRUE
    assert.equal(analysisHsEffectTrue.esEffect, false); // if multipliers.thresholdPsIsStudents > estEsMsStudents, then false
    assert.equal(analysisHsEffectTrue.hsEffect, true); // if multipliers.thresholdHsStudents < estHsStudents, then false
    assert.equal(analysisHsEffectTrue.indirectEffect, true); // if esEffect or hsEffect are true

    // condition 2: hsEffects is false but esEffect is true, making indirectEffect TRUE
    assert.equal(analysisEsEffectTrue.esEffect, true); // if multipliers.thresholdPsIsStudents < estEsMsStudents, then true
    assert.equal(analysisEsEffectTrue.hsEffect, false); // if multipliers.thresholdHsStudents > estHsStudents, then false
    assert.equal(analysisEsEffectTrue.indirectEffect, true); // if esEffect or hsEffect are true

    // condition 3: both esEffect and hsEffect are false, making indirectEffect FALSE
    assert.equal(analysisAllFalse.esEffect, false); // if multipliers.thresholdPsIsStudents < estEsMsStudents, then true
    assert.equal(analysisAllFalse.hsEffect, false); // if multipliers.thresholdHsStudents > estHsStudents, then false
    assert.equal(analysisAllFalse.indirectEffect, false); // if esEffect or hsEffect are true

  });

  test('concatenates subdistricts from DB and subdistricts from user correctly', async function(assert) {
    /*
      input variables:
      * subdistrictsFromDb (array of objects)
      * subdistrictsFromUser (array of objects)

      tested variables:
      * subdistricts (array)
      * multiSubdistrict (boolean)

    */

    let analysisMirage = server.create('public-schools-analysis', {
      subdistrictsFromDb: () => [
        {
          id: 172,
          sdName: "District 17 - Subdistrict 2",
          district: 17,
          subdistrict: 2
        }
      ],
      subdistrictsFromUser: [
        {
          id: 185,
          sdName: "District 18 - Subdistrict 5",
          district: 17,
          subdistrict: 5
        }
      ],
      project: this.server.create('project'),
    });
    let project = await this.owner.lookup('service:store').findRecord(
      'project', analysisMirage.projectId, { include: 'public-schools-analysis' }
    );
    let analysis = await project.get('publicSchoolsAnalysis');

    assert.equal(analysis.subdistricts.length, 2)
    assert.equal(analysis.subdistricts[1].id, 185);
    assert.equal(analysis.multiSubdistrict, true);
  });

  //
  test('concatenates buildings and allSchools correctly', async function(assert) {
    /*
      input variables:
      * incorporates testsForSchools trait defined in the mirage factory with bluebook, lcgms, and scaProjects as the
      three different types of schools

      tested variables:
      * buildings (array of objects)
      * allSchools (array of objects)
      * buildingsBldgIds (array)

    */

    let analysisMirage = server.create('public-schools-analysis', 'schoolsForTests', {
      project: association({
        totalUnits: 1000
      })
    });

    let project = await this.owner.lookup('service:store').findRecord(
      'project', analysisMirage.projectId, { include: 'public-schools-analysis' }
    );
    let analysis = await project.get('publicSchoolsAnalysis');

    const bluebookBuildings = analysis.buildings.filter(obj => { return obj.source === 'bluebook'});
    const lcgmsBuildings = analysis.buildings.filter(obj => { return obj.source === 'lcgms'});
    const scaProjectsBuildings = analysis.buildings.filter(obj => { return obj.source === 'scaProjects'});
    const bluebookSchools = analysis.allSchools.filter(obj => { return obj.source === 'bluebook'});
    const lcgmsSchools = analysis.allSchools.filter(obj => { return obj.source === 'lcgms'});

    // analysis.buildings.mapBy('name') =
    // ["I.S. 2 - K", "I.S. 61 - K", "Starfruit Sauna", "P.S. 91 - K", "Banana Bonanza", "Strawberry Sunrise",
    // "Cantelope Castle", "Donuts Delight", "Avocado Adventure", "Clementine Canopy", "Peach Party", "Passionfruit Pavilion",
    // "Tangerine Tent", "Pineapple Paradise", "Olive Oasis", "Grapefruit Garage"]

    // buildings concatenates bluebook, lcgms, and scaProjects
    assert.equal(bluebookBuildings[1].name, 'I.S. 61 - K')
    assert.equal(lcgmsBuildings[1].name, 'Strawberry Sunrise')
    assert.equal(scaProjectsBuildings[1].name, 'Avocado Adventure')

    // analysis.allSchools.mapBy('name') =
    // ["I.S. 2 - K", "I.S. 61 - K", "Starfruit Sauna", "P.S. 91 - K", "Banana Bonanza", "Strawberry Sunrise", "Cantelope Castle"]

    // allSchools concatenates bluebook and lcgms
    assert.equal(bluebookSchools[1].name, 'I.S. 61 - K')
    assert.equal(lcgmsSchools[1].name, 'Strawberry Sunrise')
    // ^^ do we need to test that .compact works and that no null values are added to this allSchools concatenation?

    assert.equal(analysis.buildingsBldgIds[2], 'K091') // this.get('buildings').mapBy('bldg_id').uniq(); --> this one tests that the unique values "K022" are excluded
    assert.equal(analysis.buildingsBldgIds[3], 'LCGMS_BB1') // this.get('buildings').mapBy('bldg_id').uniq();
    assert.equal(analysis.buildingsBldgIds[6], 'SCA_DD1') // this.get('buildings').mapBy('bldg_id').uniq();
  });

  test('calculates projectionOverMax correctly', async function(assert) {
    /*
      input variables:
      * project model's buildYear (integer)
      * dataTables.enrollmentProjectionsMaxYear (integer)

      tested variables:
      * maxProjection (integer)
      * projectionOverMax (boolean)
      * buildYearMaxed (integer)

      Here we test TWO conditions:
      * projectionOverMax is true, so buildYearMaxed equals maxProjection
      * projectionOverMax is false, so buildYearMaxed equals buildYear
    */

    // project with build year 2027
    let analysisMirage2027 = this.server.create('public-schools-analysis', {
      project: this.server.create('project', {
        buildYear: 2027
      }),
      dataPackage: this.server.create('data-package', 'publicSchools'),
    });

    // project with build year 2024
    let analysisMirage2024 = this.server.create('public-schools-analysis', {
      project: this.server.create('project', {
        buildYear: 2024,
      }),
      dataPackage: this.server.create('data-package', 'publicSchools'),
    });

    let analysis2024 = await this.owner.lookup('service:store').findRecord(
      'public-schools-analysis', analysisMirage2024.id, { include: 'data-package,project' }
    );
    let analysis2027 = await this.owner.lookup('service:store').findRecord(
      'public-schools-analysis', analysisMirage2027.id, { include: 'data-package,project' }
    );

    assert.equal(analysis2027.maxProjection, 2025) // maxProjection = datatables.enrollmentProjectionsMaxYear
    assert.equal(analysis2027.projectionOverMax, true) // project.buildYear (2027) < maxProjection (2025), then false
    assert.equal(analysis2027.buildYearMaxed, analysis2027.maxProjection) // if projectionOverMax is true, buildYearMaxed should equal maxProjection

    assert.equal(analysis2024.maxProjection, 2025) // maxProjection = datatables.enrollmentProjectionsMaxYear
    assert.equal(analysis2024.projectionOverMax, false) // project.buildYear (2024) < maxProjection (2025), then false
    assert.equal(analysis2024.buildYearMaxed, analysis2024.buildYear) // if projectionOverMax is false, buildYearMaxed should equal buildYear
  });

  test('calculates doeUtilChangesPerBldg correctly', async function(assert) {
    /*
      input variables:
      * doeUtilChanges (array of objects)
        * doeUtilChanges.title (string)
        * doeUtilChanges.bldg_id (string)
        * doeUtilChanges.bldg_id_additional (string)
      * bluebook (array of objects)
        * bluebook.name (string)
        * bluebook.source (string)
        * bluebook.bldg_id (string)
        * bluebook.level (string)
      * lcgms (array of objects)
        * lcgms.name (string)
        * lcgms.source (string)
        * lcgms.bldg_id (string)
        * lcgms.level (string)
      * scaProjects (array of objects)
        * scaProjects.name (string)
        * scaProjects.source (string)
        * scaProjects.bldg_id (string)
        * scaProjects.level (string)

      tested variables:
      * doeUtilChangesBldgIds (array)
      * buildings (array of objects)
      * doeUtilChangesPerBldg (array of objects)
      * doeUtilChangesPerBldg[n].bldg_id (string)
      * doeUtilChangesPerBldg[n].buildings[0] (buildings is an array of objects)
      * doeUtilChangesPerBldg[n].doe_notices[n][n] (doe_notices is an array of arrays)
      * doeUtilChangesCount (integer)
    */

    let analysisMirage = server.create('public-schools-analysis', {
      project: this.server.create('project'),
      doeUtilChanges: [
        {
          title: "",
          bldg_id: "BBAA1",
          bldg_id_additional: "additional_AA"
        },
        {
          title: "Proposing the Plum Palace",
          bldg_id: "BBPP1",
          bldg_id_additional: "additional_PP"
        },
        {
          title: "Prepping the Plum Palace",
          bldg_id: "BBPP1",
          bldg_id_additional: "additional_PP1"
        },
        {
          title: "Selling the Strawberry Sunrise",
          bldg_id: "LCGMS_SS1",
          bldg_id_additional: "additional_SS"
        },
        {
          title: "Renovating the Raspberry Railway",
          bldg_id: "BBRR1",
          bldg_id_additional: "additional_RR"
        },
        {
          title: "Organizing the Olive Oasis",
          bldg_id: "",
          bldg_id_additional: ""
        }
      ],
      bluebook: () => [
        {
          name: "Raspberry Railway",
          source: "bluebook",
          bldg_id: "BBRR1",
          level: "hs"
        },
        {
          name: "Plum Palace",
          source: "bluebook",
          bldg_id: "BBPP1",
          level: "ps"
        },
        {
          name: "Starfruit Sauna",
          source: "bluebook",
          bldg_id: "BBSS1",
          level: "is"
        },
      ],
        lcgms: () => [
          {
            name: "Banana Bonanza",
            bldg_id: "LCGMS_BB1",
            source: "lcgms",
            level: "is",
          },
          {
            name: "Strawberry Sunrise",
            bldg_id: "LCGMS_SS1",
            source: "lcgms",
            level: "ps"
          },
        ],
    });

    let project = await this.owner.lookup('service:store').findRecord(
      'project', analysisMirage.projectId, { include: 'public-schools-analysis' }
    );
    let analysis = await project.get('publicSchoolsAnalysis');

     // analysis.doeUtilChangesBldgIds.mapBy('name') = ["BBAA1", "BBPP1", "LCGMS_SS1", "BBRR1", "additional_AA", "additional_PP", "additional_PP1", "additional_SS", "additional_RR"]
     // this.get('doeUtilChanges').mapBy('bldg_id').concat(this.get('doeUtilChanges').mapBy('bldg_id_additional')).without('').uniq();
    assert.equal(analysis.doeUtilChangesBldgIds[2], 'LCGMS_SS1'); // checks that all values are unique (the duplicate BBPP1 is excluded)
    assert.equal(analysis.doeUtilChangesBldgIds[4], 'additional_AA'); // checks that the additional building IDs start after the end of the bldg_id list
    assert.equal(analysis.doeUtilChangesBldgIds[8], 'additional_RR'); // checks that both the "" values under bldg_id and bldg_id_additional for "Organizing the Olive Oasis" are not included

    // buildings is a concatenation of bluebook, lcgms, and scaProjects
    // analysis.buildings.mapBy('name') = [ "Raspberry Railway", "Plum Palace", "Starfruit Sauna", "Banana Bonanza", "Strawberry Sunrise"]
    assert.equal(analysis.buildings[3].name, 'Banana Bonanza');

    // create buildings array WITHOUT any high schools, match these IDs to doeUtilChangesBldgIds to create doeUtilChangesPerBldg
    // the only one with `level: hs` is "Raspberry Railway", so this one is removed
    const buildingsNoHs = analysis.buildings.filter(b => (b.level != 'hs'));
    assert.equal(buildingsNoHs[0].name, 'Plum Palace');

    // building IDs in buildingsNoHs are matched to building IDs in doeUtilChangesBldgIds
    // the only IDs that match are "BBPP1" and "LCGMS_SS1"
    // the doeUtilChanges that match these IDs are "Proposing the Plum Palace" and "Prepping the Plum Palace", and "Selling the Strawberry Sunrise"
    assert.equal(analysis.doeUtilChangesPerBldg.length, 2);
    assert.equal(analysis.doeUtilChangesPerBldg[0].bldg_id, 'BBPP1')
    assert.equal(analysis.doeUtilChangesPerBldg[1].bldg_id, 'LCGMS_SS1')
    assert.equal(analysis.doeUtilChangesPerBldg[0].buildings[0].name, 'Plum Palace')
    assert.equal(analysis.doeUtilChangesPerBldg[1].buildings[0].name, 'Strawberry Sunrise')
    /* const doe_notices = this.get('doeUtilChanges').filter(b => (b.bldg_id === bldg_id || b.bldg_id_additional === bldg_id)).mapBy('title').uniq().map((title) => (
      this.doeUtilChanges.filterBy('title', title))); */
    assert.equal(analysis.doeUtilChangesPerBldg[0].doe_notices[0][0].title, 'Proposing the Plum Palace')
    assert.equal(analysis.doeUtilChangesPerBldg[0].doe_notices[1][0].title, 'Prepping the Plum Palace')
    assert.equal(analysis.doeUtilChangesPerBldg[1].doe_notices[0][0].title, 'Selling the Strawberry Sunrise')

    assert.equal(analysis.doeUtilChangesCount, 2); //this.doeUtilChangesPerBldg.length;
  });

  test('calculates subdistrictTotals correctly', async function(assert) {
    /*
      input variables:
      * this test incorporates all variables from the subdistrictTotalsTest trait in the public-schools-analysis mirage factory
      * it also incorporates testsForSchools trait defined in the mirage factory with bluebook, lcgms, and scaProjects as the
      three different types of schools

      tested variables:
      * futureResidentialDev[n].ps_students/is_students/hs_students (integer)
      * subdistrictTotals (array with three objects, corresponding to school levels: 'hs' as [0], 'ps' as [1], and 'is' as [2])
        * subdistrictTotals[n].allBuildings (array of objects)
        * subdistrictTotals[n].studentMultiplier (number)
        * subdistrictTotals[n].enroll (integer)
        * subdistrictTotals[n].students (integer)
        * subdistrictTotals[n].scaCapacityIncrease (integer)
        * subdistrictTotals[n].studentsWithAction (integer)
        * subdistrictTotals[n].newCapacityWithAction (integer)
    */

    let analysisMirage = server.create('public-schools-analysis', 'subdistrictTotalsTest', 'schoolsForTests')

    let project = await this.owner.lookup('service:store').findRecord(
      'project', analysisMirage.projectId, { include: 'public-schools-analysis' }
    );
    let analysis = await project.get('publicSchoolsAnalysis');

    assert.equal(analysis.borough, 'Brooklyn')
    assert.equal(analysis.allSchools[4].name, 'Banana Bonanza') // 3rd school under bluebooks
    assert.equal(analysis.subdistrictTotals[0].allBuildings[4].name, 'Banana Bonanza') // allBuildings = this.allSchools = concatenated bluebook & lcgms projects

    // HS tables
    assert.equal(analysis.subdistrictTotals[0].studentMultiplier, 0.09) // currentMultiplier.hs
    assert.equal(analysis.subdistrictTotals[0].enroll, 15000) // hsProjections.hs
    assert.equal(analysis.futureResidentialDev[0].hs_students, 5) // hs_students = this.total_units * this.multipliers.hs = 60 * 0.09
    assert.equal(analysis.futureResidentialDev[1].hs_students, 5) // hs_students = this.total_units * this.multipliers.hs = 50 * 0.09
    assert.equal(analysis.subdistrictTotals[0].students, 4010); // this.hsStudentsFromHousing + (aggregate of hs_students in futureResidentialDev) = 4000 + 10
    assert.equal(analysis.subdistrictTotals[0].scaCapacityIncrease, 1650); // filter for includeInCapacity is true, aggregate all hs_capacity values in scaProjects
    assert.equal(analysis.subdistrictTotals[0].newCapacityWithAction, 450) // aggregate of hs_seats in this.schoolsWithAction
    //

    // PS tables
    assert.equal(analysis.subdistrictTotals[1].studentMultiplier, 0.24) // this.currentMultiplier.ps
    assert.equal(analysis.subdistrictTotals[1].enroll, 3525) // enroll = futureEnrollmentProjections[n].ps (9198) * futureEnrollmentMultipliers[n].multiplier (0.383266818664257)
    assert.equal(analysis.futureResidentialDev[0].ps_students, 14) // residentialDevelopments[0].total_units (60) * multipliers.is (0.24)
    assert.equal(analysis.futureResidentialDev[1].ps_students, 12) // residentialDevelopments[1].total_units (50) * multipliers.is (0.24)
    assert.equal(analysis.subdistrictTotals[1].students, 864) // this.futureEnrollmentNewHousing[n].students + (aggregate of this.futureResidentialDev ps_students) = 838 + (100 + 200)
    assert.equal(analysis.subdistrictTotals[1].scaCapacityIncrease, 1050) // filter for includeInCapacity is true, correct district and subdistrict, aggregate all ps_capacity values in scaProjects
    assert.equal(analysis.subdistrictTotals[1].newCapacityWithAction, 100) // aggregate of ps_seats in this.schoolsWithAction matched to current district and subdistrict
    //
    // IS tables
    assert.equal(analysis.subdistrictTotals[2].studentMultiplier, 0.09) // this.currentMultiplier.is
    assert.equal(analysis.subdistrictTotals[2].enroll, 2542) // enroll = futureEnrollmentProjections[n].ms (4368) * futureEnrollmentMultipliers[n].multiplier (0.582024949124332)
    assert.equal(analysis.futureResidentialDev[0].is_students, 5) // residentialDevelopments[0].total_units (60) * multipliers.is (0.09) = 5
    assert.equal(analysis.futureResidentialDev[1].is_students, 5) // residentialDevelopments[1].total_units (50) * multipliers.is (0.09) = 5
    assert.equal(analysis.subdistrictTotals[2].students, 333) // this.futureEnrollmentNewHousing[n].students + (aggregate of this.futureResidentialDev ps_students) = 323 + (5 + 5)
    assert.equal(analysis.subdistrictTotals[2].scaCapacityIncrease, 2200) // filter for includeInCapacity is true, correct district and subdistrict, aggregate all is_capacity values in scaProjects
    assert.equal(analysis.subdistrictTotals[2].newCapacityWithAction, 850) // aggregate of is_seats in this.schoolsWithAction matched to current district and subdistrict

    // hsLevelTotals
    assert.equal(analysis.hsLevelTotals.subdistrictTotals[0].enroll, 15000) // subdistrictTotals: this.subdistrictTotals.filterBy('level', 'hs'),
    assert.equal(analysis.estHsStudents, 41);  // math.ceil(currentMultiplier.hs * project.netUnits) = 0.09 * 450
    assert.equal(analysis.hsLevelTotals.studentsWithAction, 41); // studentsWithAction: this.estHsStudents || 0,

    // psLevelTotals
    assert.equal(analysis.psLevelTotals.subdistrictTotals[0].enroll, 3525); // subdistrictTotals: this.subdistrictTotals.filterBy('level', 'ps'),
    assert.equal(analysis.estEsStudents, 108);  // math.ceil(currentMultiplier.ps * project.netUnits) = 0.24 * 450
    assert.equal(analysis.psLevelTotals.studentsWithAction, 108); // studentsWithAction: this.estEsStudents || 0,

    // isLevelTotals
    assert.equal(analysis.isLevelTotals.subdistrictTotals[0].enroll, 2542) // subdistrictTotals: this.subdistrictTotals.filterBy('level', 'is'),
    assert.equal(analysis.estIsStudents, 41);  // math.ceil(currentMultiplier.is * project.netUnits) = 0.09 * 450
    assert.equal(analysis.isLevelTotals.studentsWithAction, 41); // studentsWithAction: this.estIsStudents || 0,
  });

});
