export const plutoLabelsStyles = {
  'pluto-labels': {
    layout: {
      'text-field': '{lot}',
      'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
      'text-size': 11,
      visibility: 'visible',
    },
    paint: {
      'text-opacity': {
        stops: [
          [16.5, 0],
          [17.5, 1],
        ],
      },
      'icon-color': 'rgba(193, 193, 193, 1)',
      'text-color': 'rgba(154, 154, 154, 1)',
      'text-halo-color': 'rgba(152, 152, 152, 0)',
    },
  },
};
