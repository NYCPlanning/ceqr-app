import { subwayStyles } from 'labs-ceqr/layer-styles/subway';
import { selectableFeatureStyles } from 'labs-ceqr/layer-styles/selectable-feature';
import { projectBblStyles } from 'labs-ceqr/layer-styles/project-bbl';
import { transitZoneStyles, transitZoneColors } from 'labs-ceqr/layer-styles/transit-zone';
import { landUseStyles, landUseColors } from 'labs-ceqr/layer-styles/land-use';

export const styles  = {
  ...subwayStyles,
  ...selectableFeatureStyles,
  ...projectBblStyles,
  ...transitZoneStyles,
  ...landUseStyles,
};

export const colors = {
  'transit-zone': transitZoneColors,
  'land-use': landUseColors,
};
