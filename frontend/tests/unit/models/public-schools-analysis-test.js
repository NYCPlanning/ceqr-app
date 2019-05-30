import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Unit | Model | public schools analysis', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('calculates currentMultiplier correctly, tests that currentMultiplier is now multipliers property in futureResidentialDev', async function(assert) {
    let analysisMirage = server.create('public-schools-analysis');
    let project = await this.owner.lookup('service:store').findRecord(
      'project', analysisMirage.projectId, { include: 'public-schools-analysis' }
    );
    let analysis = await project.get('publicSchoolsAnalysis');

    assert.equal(analysis.district, 17); // district is this.subDistrictFromDb[0].district
    assert.equal(analysis.currentMultiplier.csd, 17);
    assert.equal(analysis.currentMultiplier.hs, 0.09)
    assert.equal(analysis.futureResidentialDev[0].multipliers.csd, 17)
  });
  //
  test('calculates esEffect correctly', async function(assert) {
    let analysisMirage = server.create('public-schools-analysis');
    let project = await this.owner.lookup('service:store').findRecord(
      'project', analysisMirage.projectId, { include: 'public-schools-analysis' }
    );
    let analysis = await project.get('publicSchoolsAnalysis');

    assert.equal(project.netUnits, 450) // project.totalUnits - project.seniorUnits = 500 - 50
    assert.equal(analysis.estEsStudents, 108) // math.ceil(currentMultiplier.ps * project.netUnits) = 0.24 * 450
    assert.equal(analysis.estIsStudents, 41) // math.ceil(currentMultiplier.is * project.netUnits) = 0.09 * 40
    assert.equal(analysis.estEsMsStudents, 149) // estEsStudents + estIsStudents
    assert.equal(analysis.esEffect, true); // if multipliers.thresholdPsIsStudents < estEsMsStudents, then true
    assert.equal(analysis.indirectEffect, true) // if esEffect or hsEffect are true
  });
  //
  test('calculates hsEffect correctly', async function(assert) {
    let analysisMirage = server.create('public-schools-analysis');
    let project = await this.owner.lookup('service:store').findRecord(
      'project', analysisMirage.projectId, { include: 'public-schools-analysis' }
    );
    let analysis = await project.get('publicSchoolsAnalysis');

    assert.equal(project.netUnits, 450) // totalUnits - seniorUnits = 500 - 50 = 450
    assert.equal(analysis.estHsStudents, 41) // math.ceil(currentMultiplier.hs * project.netUnits) = 0.09 * 450
    assert.equal(analysis.hsEffect, false); // if multipliers.thresholdHsStudents > estHsStudents, then false
    assert.equal(analysis.indirectEffect, true); // if esEffect or hsEffect are true
  });
  //
  test('concatenates subdistricts from DB and subdistricts from user correctly', async function(assert) {
    let analysisMirage = server.create('public-schools-analysis', 'subdistrictsFromUserAdded');
    let project = await this.owner.lookup('service:store').findRecord(
      'project', analysisMirage.projectId, { include: 'public-schools-analysis' }
    );
    let analysis = await project.get('publicSchoolsAnalysis');

    assert.equal(analysis.subdistricts.length, 2)
    assert.equal(analysis.subdistricts[1].id, 185);
    assert.equal(analysis.multiSubdistrict, true);
    assert.equal(analysis.subdistrictCartoIds[1], 24);
  });
  //
  test('concatenates buildings and allSchools correctly', async function(assert) {
    let analysisMirage = server.create('public-schools-analysis');
    let project = await this.owner.lookup('service:store').findRecord(
      'project', analysisMirage.projectId, { include: 'public-schools-analysis' }
    );
    let analysis = await project.get('publicSchoolsAnalysis');

    const bluebookBuildings = analysis.buildings.filter(obj => { return obj.source === 'bluebook'});
    const lcgmsBuildings = analysis.buildings.filter(obj => { return obj.source === 'lcgms'});
    const scaProjectsBuildings = analysis.buildings.filter(obj => { return obj.source === 'scaProjects'});
    const bluebookSchools = analysis.allSchools.filter(obj => { return obj.source === 'bluebook'});
    const lcgmsSchools = analysis.allSchools.filter(obj => { return obj.source === 'lcgms'});

    // buildings concatenates bluebook, lcgms, and scaProjects
    assert.equal(bluebookBuildings[0].name, 'I.S. 2 - K')
    assert.equal(lcgmsBuildings[0].name, 'Banana Bonanza')
    assert.equal(scaProjectsBuildings[1].name, 'Donuts Delight')

    // allSchools concatenates bluebook and lcgms
    assert.equal(bluebookSchools[0].name, 'I.S. 2 - K')
    assert.equal(lcgmsSchools[0].name, 'Banana Bonanza')
    // ^^ do we need to test that .compact works and that no null values are added to this allSchools concatenation?

    assert.equal(analysis.lcgmsCartoIds[1], 18)
    assert.equal(analysis.scaProjectsCartoIds[1], 52)
    assert.equal(analysis.buildingsBldgIds[3], 'K092') // should we test that only unique values are grabbed?
  });
  //
  test('calculates projectionOverMax correctly', async function(assert) {
    let analysisMirage = server.create('public-schools-analysis');
    let project = await this.owner.lookup('service:store').findRecord(
      'project', analysisMirage.projectId, { include: 'public-schools-analysis' }
    );
    let analysis = await project.get('publicSchoolsAnalysis');

    // maxProjection = datatables.enrollmentProjectionsMaxYear
    assert.equal(analysis.projectionOverMax, false) // project.buildYear (2023) < maxProjection (2027), then false
    assert.equal(analysis.buildYearMaxed, analysis.buildYear) // if projectionOverMax is true, buildYearMaxed should equal maxProjection, otherwise should equal buildYear
  });
  //
  test('calculates doeUtilChangesPerBldg correctly', async function(assert) {
    let analysisMirage = server.create('public-schools-analysis', 'doeUtilChangesReduced');
    let project = await this.owner.lookup('service:store').findRecord(
      'project', analysisMirage.projectId, { include: 'public-schools-analysis' }
    );
    let analysis = await project.get('publicSchoolsAnalysis');

    assert.equal(analysis.doeUtilChangesBldgIds[2], 'K221') // only grab unique building IDs!

    const buildingsNoHs = analysis.buildings.filter(b => (b.level != 'hs'));
    assert.equal(buildingsNoHs[0].bldg_id, 'K002'); // this would be the first buildings in bluebook that did not have hs level

    assert.equal(analysis.doeUtilChangesPerBldg[0].bldg_id, 'K221') // K221 is the first one in doeUtilChangesBldgIds to match the no hs level
    assert.equal(analysis.doeUtilChangesPerBldg[0].buildings[0].name, 'P.S. 221 - K') // there's only one school that matches this ID, with name 'P.S. 221 - K'
    assert.equal(analysis.doeUtilChangesPerBldg[0].doe_notices[0][0].at_scale_enroll, 294)

    assert.equal(analysis.doeUtilChangesCount, 2);
  });
  //
  test('calculates subdistrictTotals correctly', async function(assert) {
    let analysisMirage = server.create('public-schools-analysis');
    let project = await this.owner.lookup('service:store').findRecord(
      'project', analysisMirage.projectId, { include: 'public-schools-analysis' }
    );
    let analysis = await project.get('publicSchoolsAnalysis');

    assert.equal(analysis.borough, 'Brooklyn')
    assert.equal(analysis.allSchools[2].name, 'P.S. 91 - K') // 3rd school under bluebooks
    assert.equal(analysis.subdistrictTotals[0].allBuildings[2].name, 'P.S. 91 - K') // allBuildings = this.allSchools = concatenated bluebook & lcgms projects

    // HS tables
    assert.equal(analysis.subdistrictTotals[0].studentMultiplier, 0.09) // currentMultiplier.hs
    assert.equal(analysis.subdistrictTotals[0].enroll, 79875) // hsProjections.hs
    assert.equal(analysis.futureResidentialDev[0].hs_students, 5) // hs_students = this.total_units * this.multipliers.hs = 60 * 0.09
    assert.equal(analysis.subdistrictTotals[0].students, 4812); // this.hsStudentsFromHousing + (aggregate of hs_students in futureResidentialDev) = 4802 + 10
    assert.equal(analysis.subdistrictTotals[0].scaCapacityIncrease, 1300); // filter for includeInCapacity is true, aggregate all hs_capacity values in scaProjects
    assert.equal(analysis.subdistrictTotals[0].studentsWithAction, 41) // Math.ceil: estHsStudents = project.netUnits (450) * this.currentMultiplier.hs (0.09)
    assert.equal(analysis.subdistrictTotals[0].newCapacityWithAction, 450) // aggregate of hs_seats in this.schoolsWithAction

    // PS tables
    assert.equal(analysis.subdistrictTotals[1].studentMultiplier, 0.24) // this.currentMultiplier.ps
    assert.equal(analysis.subdistrictTotals[1].enroll, 3624) // enroll = futureEnrollmentProjections[n].ps (9456) * futureEnrollmentMultipliers[n].multiplier (0.383266818664257)
    assert.equal(analysis.subdistrictTotals[1].students, 864) // this.futureEnrollmentNewHousing[n].students + (aggregate of this.futureResidentialDev ps_students) = 838 + (14 + 12)
    assert.equal(analysis.subdistrictTotals[1].scaCapacityIncrease, 300) // filter for includeInCapacity is true, correct district and subdistrict, aggregate all ps_capacity values in scaProjects
    assert.equal(analysis.subdistrictTotals[1].studentsWithAction, 108) // Math.ceil: estEsStudents = project.netUnits (450) * this.currentMultiplier.ps (0.24)
    assert.equal(analysis.subdistrictTotals[1].newCapacityWithAction, 70) // aggregate of ps_seats in this.schoolsWithAction matched to current district and subdistrict

    // IS tables
    assert.equal(analysis.subdistrictTotals[2].studentMultiplier, 0.09) // this.currentMultiplier.is
    assert.equal(analysis.subdistrictTotals[2].enroll, 2594) // enroll = futureEnrollmentProjections[n].ms (4456) * futureEnrollmentMultipliers[n].multiplier (0.582024949124332)
    assert.equal(analysis.subdistrictTotals[2].students, 333) // this.futureEnrollmentNewHousing[n].students + (aggregate of this.futureResidentialDev ps_students) = 323 + (5 + 5)
    assert.equal(analysis.subdistrictTotals[2].scaCapacityIncrease, 200) // filter for includeInCapacity is true, correct district and subdistrict, aggregate all is_capacity values in scaProjects
    assert.equal(analysis.subdistrictTotals[2].studentsWithAction, 41) // Math.ceil (estEsStudents = project.netUnits (450) * this.currentMultiplier.is (0.09))
    assert.equal(analysis.subdistrictTotals[2].newCapacityWithAction, 350) // aggregate of is_seats in this.schoolsWithAction matched to current district and subdistrict
  });

});
