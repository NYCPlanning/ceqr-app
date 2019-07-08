import { expressions as exp } from '@carto/carto-vl';

export const subwayStyles = {
  'subway-routes': {
    paint: {
      'color': exp.ramp(exp.buckets(exp.prop('rt_symbol'),
      ['4', 'N', 'L', 'J', 'G', 'B', 'A', 'SI', '7', '1']),
        [
          exp.rgba(0, 147, 60, 1),
          exp.rgba(252, 204, 10, 1),
          exp.rgba(167, 169, 172, 1),
          exp.rgba(153, 102, 51, 1),
          exp.rgba(108, 190, 69, 1),
          exp.rgba(255, 99, 25, 1),
          exp.rgba(0, 57, 166, 1),
          exp.rgba(0, 57, 166, 1),
          exp.rgba(185, 51, 173, 1),
          exp.rgba(238, 53, 46, 1)
        ]
      )
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
