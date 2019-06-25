export const subwayStyles = {
  'subway-routes': {
    paint: {
      'line-color': {
        property: 'rt_symbol',
        type: 'categorical',
        stops: [
          ['4', 'rgba(0, 147, 60, 1)'],
          ['N', 'rgba(252, 204, 10, 1)'],
          ['L', 'rgba(167, 169, 172, 1)'],
          ['J', 'rgba(153, 102, 51, 1)'],
          ['G', 'rgba(108, 190, 69, 1)'],
          ['B', 'rgba(255, 99, 25, 1)'],
          ['A', 'rgba(0, 57, 166, 1)'],
          ['SI', 'rgba(0, 57, 166, 1)' ],
          ['7', 'rgba(185, 51, 173, 1)'],
          ['1', 'rgba(238, 53, 46, 1)'],
        ],
      },
      'line-width': {
        stops: [
          [10, 1],
          [15, 4],
        ],
      },
    },
  },
  'subway-stops': {
    paint: {
      'circle-color': 'rgba(255, 255, 255, 1)',
      'circle-opacity': {
        stops: [
          [11, 0],
          [12, 1],
        ],
      },
      'circle-stroke-opacity': {
        stops: [
          [11, 0],
          [12, 1],
        ],
      },
      'circle-radius': {
        stops: [
          [10, 2],
          [14, 5],
        ],
      },
      'circle-stroke-width': 1,
      'circle-pitch-scale': 'map',
    },
  },
};
