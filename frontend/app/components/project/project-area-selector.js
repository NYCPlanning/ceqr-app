import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed, action, set } from '@ember/object';

export default class ProectAreaSelectorComponent extends Component {
  tagName = '';
  store = service();
  @service() store;
  @service() ceqrData;

  @computed('project.bblsVersion', function () {
    const bblsVersion = this.project.get('bblsVersion');

    if (bblsVersion) {
      return bblsVersion;
    }
    return '';
  })
  bblsVersion;

  @action
  changeDataPackage(dp) {
    console.info("change data package in pas", dp);
    set(this.project, 'dataPackage', dp);
  }

  @action
  toggleBbl(_bbl) {
    console.info("toggleBbl", _bbl);
    const bbl = _bbl.toString();

    if (this.project.get('bbls').includes(bbl)) {
      this.send('removeBbl', bbl);
    } else {
      this.send('addBbl', bbl);
    }
  }

  @action
  async addBbl(_bbl) {
    console.info("addBbl", _bbl);
    set(this, 'error', null);
    const bbl = _bbl.toString();

    const bblRegex = /\b[1-5]{1}[0-9]{5}[0-9]{4}\b/;

    if (!bbl.match(bblRegex)) {
      set(this, 'error', {
        message:
          'BBL must be a 10 digit integer, beginning with an integer from 1 to 5',
      });
      set(this, 'bbl', null);
      return;
    }

    // if additional bbl is not in same boro
    if (
      this.project.get('bbls').length > 0 &&
      parseFloat(bbl.charAt(0)) !==
        parseFloat(this.project.get('bbls.firstObject').charAt(0))
    ) {
      set(this, 'error', {
        message:
          'All BBLs must be in the same borough. CEQR App currently does not support multi-borough project areas.',
      });
      set(this, 'bbl', null);
      return;
    }

    const bblVersion = this.project.get('dataPackage.schemas.mappluto.table');
    const valid_bbl = await this.ceqrData.valid_bbl(bbl, bblVersion);

    // if no bbl exists
    if (!valid_bbl) {
      set(this, 'error', {
        message:
          'The entered BBL does not exist in the current version of MapPLUTO',
      });
      set(this, 'bbl', null);
      return;
    }

    this.project.get('bbls').pushObject(bbl);
    set(this, 'bbl', null);
  }

  @action
  removeBbl(bbl) {
    console.info("removeBbl", bbl);
    this.project.get('bbls').removeObject(bbl);
  }
}
