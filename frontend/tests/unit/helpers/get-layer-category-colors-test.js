import { getLayerCategoryColors } from 'labs-ceqr/helpers/get-layer-category-colors';
import { module, test } from 'qunit';

module('Unit | Helper | get layer category colors', function() {
  test('it returns an array of category/color objects for land-use', function(assert) {
    const categoryColors = getLayerCategoryColors(['land-use']);
    assert.ok(Array.isArray(categoryColors));
    assert.ok(categoryColors.every((cc => cc.category && cc.color)));
  });

  test('it returns an array of category/color objects for transit-zone', function(assert) {
    const categoryColors = getLayerCategoryColors(['transit-zone']);
    assert.ok(Array.isArray(categoryColors));
    assert.ok(categoryColors.every((cc => cc.category && cc.color)));
  });

  test('it returns an empty array if the layer does not have category colors', function(assert) {
    const categoryColors = getLayerCategoryColors(['colorless-layer']);
    assert.ok(Array.isArray(categoryColors));
    assert.equal(categoryColors, 0);
  });
});
