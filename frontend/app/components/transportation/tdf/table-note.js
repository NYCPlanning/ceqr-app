import Component from '@ember/component';
import { computed } from '@ember-decorators/object';
import { isEmpty } from '@ember/utils';
import { action } from '@ember-decorators/object';

export default class TransportationTdfTableNoteComponent extends Component {
  addingNote = false;
  
  @computed('tableName')
  get tableNote() {
    return this.factor.tableNotes[this.tableName];
  }
  set tableNote(note) {
    this.factor.tableNotes[this.tableName] = note;
  }

  @computed('tableNote')
  get emptyNote() {
    return isEmpty(this.tableNote);
  }

  @action
  saveNote() {
    this.factor.save();
    this.set('addingNote', false);
  }
}
