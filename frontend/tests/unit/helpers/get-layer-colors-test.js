import { getLayerColors } from 'labs-ceqr/helpers/get-layer-colors';
import { module, test } from 'qunit';

module('Unit | Helper | get layer colors', function() {
  test('it returns a dict of colors for selectable-features', function(assert) {
    const layerColors = getLayerColors(['selectable-features']);
    assert.ok(layerColors instanceof Object);
  });

  test('it returns a dict of colors for project-bbls', function(assert) {
    const layerColors = getLayerColors(['project-bbls']);
    assert.ok(layerColors instanceof Object);
  });

  test('it returns an empty dict if the layer does not have colors', function(assert) {
    const layerColors = getLayerColors(['colorless-layer']);
    assert.ok(layerColors instanceof Object);
    assert.equal(Object.keys(layerColors).length, 0);
  });
})
