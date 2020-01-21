import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  store: service(),
  'ceqr-data': service(),

  bblsVersion: computed('project.bblsVersion', function() {
    const bblsVersion = this.project.get('bblsVersion');

    if (bblsVersion) {
      return bblsVersion;
    } return '';
  }),

  actions: {
    changeDataPackage(dp) {
      this.project.set('dataPackage', dp);
    },

    toggleBbl(_bbl) {
      const bbl = _bbl.toString();

      if (this.project.get('bbls').includes(bbl)) {
        this.send('removeBbl', bbl);
      } else {
        this.send('addBbl', bbl);
      }
    },

    async addBbl(_bbl) {
      this.set('error', null);
      const bbl = _bbl.toString();

      const bblRegex = /\b[1-5]{1}[0-9]{5}[0-9]{4}\b/;

      if (!bbl.match(bblRegex)) {
        this.set('error', { message: 'BBL must be a 10 digit integer, beginning with an integer from 1 to 5' });
        this.set('bbl', null);
        return;
      }

      // if additional bbl is not in same boro
      if (
        this.project.get('bbls').length > 0
        && parseFloat(bbl.charAt(0)) !== parseFloat(this.project.get('bbls.firstObject').charAt(0))
      ) {
        this.set('error', { message: 'All BBLs must be in the same borough. CEQR App currently does not support multi-borough project areas.' });
        this.set('bbl', null);
        return;
      }

      const bblVersion = this.project.get('dataPackage.schemas.mappluto.table');
      const valid_bbl = await this['ceqr-data'].valid_bbl(bbl, bblVersion);

      // if no bbl exists
      if (!valid_bbl) {
        this.set('error', { message: 'The entered BBL does not exist in the current version of MapPLUTO' });
        this.set('bbl', null);
        return;
      }

      this.project.get('bbls').pushObject(bbl);
      this.set('bbl', null);
    },

    removeBbl(bbl) {
      this.project.get('bbls').removeObject(bbl);
    },
  },
});
