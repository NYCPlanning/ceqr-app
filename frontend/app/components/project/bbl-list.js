import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  store: service(),
  
  borough: computed('project.bbls.[]', function() {
    const bbls = this.project.get('bbls');
    
    if (bbls.length === 0) return null;

    const boroCode = parseInt(bbls.get('firstObject').charAt(0))

    switch (boroCode) {
      case 1: return 'Manhattan';
      case 2: return 'Bronx';
      case 3: return 'Brooklyn';
      case 4: return 'Queens';
      case 5: return 'Staten Island';
      default: return null;
    }
  }),

  bblsVersion: computed('project.bblsVersion', function() {
    const bblsVersion = this.project.get('bblsVersion');
    
    if (bblsVersion) {
      return bblsVersion
    } else {
      return 
    }
  }),

  actions: {
    async addBbl(bbl) {
      this.set('error', null);
      
      const bblRegex = /\b[1-5]{1}[0-9]{5}[0-9]{4}\b/;
      
      if (!bbl.match(bblRegex)) {
        this.set('error', {message: 'BBL must be a 10 digit integer, beginning with an integer from 1 to 5'});
        this.set('bbl', null);
        return;
      }

      const results = await this.store.query('bbl', { filter: { bbl } });
      
      // if no bbl exists
      if (results.length !== 1) {
        this.set('error', {message: 'The entered BBL does not exist in the current version of MapPLUTO'});
        this.set('bbl', null);
        return;
      }

      // if additional bbl is not in same boro
      if (
        this.project.get('boroCode') &&
        parseInt(bbl.charAt(0)) !== this.project.get('boroCode')
      ) {
        this.set('error', {message: 'All BBLs must be in the same borough. CEQR App currently does not support multi-borough project areas.'});
        this.set('bbl', null);
        return;
      }

      this.project.set('bblsVersion', results.get('firstObject.version'));
      this.project.get('bbls').pushObject(bbl);
      this.set('bbl', null);
    },

    removeBbl(bbl) {
      this.project.get('bbls').removeObject(bbl);
    },
  }
});
