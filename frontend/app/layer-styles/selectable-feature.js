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
    'layout': {
      'line-cap': 'round',
      'line-join': 'round',
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
      'fill-color': 'rgba(59, 101, 216, 1)',
      'fill-opacity': 0.8,
    },
  },
  'selectable-feature-selected-fill-light': {
    paint: {
      'fill-color': 'rgba(59, 101, 216, 1)',
      'fill-opacity': 0.4,
    },
  },
  'selectable-feature-selected-line': {
    paint: {
      'line-color': 'black',
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
      'line-join': 'round'
    },
  },
};
