import Component from '@ember/component';
import { computed, action, set } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { tracked } from '@glimmer/tracking';

export default class TransportationTdfTableNoteComponent extends Component {
  tagName = '';
  didUpdateAttrs() {
    super.didUpdateAttrs();
    this.setIsAddingNote(false);
  }

  @tracked addingNote = false;

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
    this.setIsAddingNote(false);
  }

  @action
  setIsAddingNote(isAdding) {
    set(this, 'addingNote', isAdding);
  }
}
