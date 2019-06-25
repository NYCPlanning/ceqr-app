import { subwayStyles } from 'labs-ceqr/layer-styles/subway';
import { selectableFeatureStyles } from 'labs-ceqr/layer-styles/selectable-feature';
import { projectBblStyles } from 'labs-ceqr/layer-styles/project-bbl';

export const styles  = {
  ...subwayStyles,
  ...selectableFeatureStyles,
  ...projectBblStyles,
};
