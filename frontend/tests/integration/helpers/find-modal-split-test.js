import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import stubReadonlyStore from '../../helpers/stub-readonly-store';

module('Integration | Helper | find-modal-split', function(hooks) {
  setupRenderingTest(hooks);
  const modalSplit = { value: 10 };
  stubReadonlyStore(hooks, modalSplit);

  test('it returns an instance of findModalSplitTask.perform()', async function(assert) {
    await render(hbs`{{find-modal-split 'test'}}`);

    assert.dom(this.element).hasText('<Task:findModalSplitTask.perform()>');
  });

  test('it finds a record from the readonly store for the given id', async function(assert) {
    this.geoid = '1';
    await render(hbs`{{#let (get (find-modal-split geoid) 'value') as |modalSplit|}}
        {{get (get modalSplit 0) 'value'}}
        {{get (get modalSplit 0) 'geoid'}}
      {{/let}}`);

    const content = this.element.textContent.trim();
    assert.ok(content.includes(this.geoid));
    assert.ok(content.includes(modalSplit.value));
  });
});
