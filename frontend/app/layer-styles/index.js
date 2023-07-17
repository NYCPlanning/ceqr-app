import { subwayStyles } from 'labs-ceqr/layer-styles/subway';
import {
  selectableFeatureStyles,
  selectableFeatureColors,
} from 'labs-ceqr/layer-styles/selectable-feature';
import {
  projectBblStyles,
  projectBblColors,
} from 'labs-ceqr/layer-styles/project-bbl';
import {
  transitZoneStyles,
  transitZoneColors,
} from 'labs-ceqr/layer-styles/transit-zone';
import { landUseStyles, landUseColors } from 'labs-ceqr/layer-styles/land-use';
import { plutoLineStyles } from 'labs-ceqr/layer-styles/pluto-line';
import { plutoLabelsStyles } from 'labs-ceqr/layer-styles/pluto-labels';

export const styles = {
  ...subwayStyles,
  ...selectableFeatureStyles,
  ...projectBblStyles,
  ...transitZoneStyles,
  ...landUseStyles,
  ...plutoLineStyles,
  ...plutoLabelsStyles,
};

export const colors = {
  'transit-zone': transitZoneColors,
  'land-use': landUseColors,
  'selectable-features': selectableFeatureColors,
  'project-bbls': projectBblColors,
};
