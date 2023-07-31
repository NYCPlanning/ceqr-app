import Component from '@ember/component';
import { computed, action, set } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default class TransportationTdfTableNoteComponent extends Component {
  tagName = '';
  didUpdateAttrs() {
    super.didUpdateAttrs();
    set(this, 'addingNote', false);
  }

  addingNote = false;

  @computed('factor.tableNotes', 'tableName')
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
    set(this, 'addingNote', false);
  }
}
