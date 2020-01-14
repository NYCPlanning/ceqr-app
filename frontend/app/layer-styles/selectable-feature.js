export const selectableFeatureColors = {
  'selected-fill-bold': 'rgba(59, 101, 216, 0.8)',
  'selected-fill-light': 'rgba(59, 101, 216, 0.4)',
  'selected-line': 'black',
};

export const selectableFeatureStyles = {
  'selectable-feature-content': {
    paint: {
      'fill-opacity': 0,
    },
  },
  'selectable-feature-line': {
    paint: {
      'line-color': '#444',
      'line-opacity': 0.5,
      'line-width': {
        stops: [
          [11, 1],
          [16, 3],
        ],
      },
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
  },
  'selectable-feature-label': {
    paint: {
      'text-color': '#626262',
      'text-halo-color': '#FFFFFF',
      'text-halo-width': 2,
      'text-halo-blur': 2,
      'text-opacity': {
        stops: [
          [
            12,
            0,
          ],
          [
            13,
            1,
          ],
        ],
      },
    },
    layout: {
      'text-field': '{ctlabel}',
      'text-font': [
        'Open Sans Semibold',
        'Arial Unicode MS Bold',
      ],
      'text-size': {
        stops: [
          [
            11,
            8,
          ],
          [
            14,
            16,
          ],
        ],
      },
    },
  },
  'selectable-feature-hover': {
    paint: {
      'line-color': '#585858',
      'line-opacity': 0.3,
      'line-width': {
        stops: [
          [8, 4],
          [11, 7],
        ],
      },
    },
  },
  'selectable-feature-selected-fill-bold': {
    paint: {
      'fill-color': selectableFeatureColors['selected-fill-bold'],
    },
  },
  'selectable-feature-selected-fill-light': {
    paint: {
      'fill-color': selectableFeatureColors['selected-fill-light'],
    },
  },
  'selectable-feature-selected-line': {
    paint: {
      'line-color': selectableFeatureColors['selected-line'],
      'line-opacity': 0.5,
      'line-width': {
        stops: [
          [11, 1],
          [16, 3],
        ],
      },
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
  },
};
