export const transitZoneColors = {
  '1': 'rgba(230, 214, 46, 0.1)',
  '2': 'rgba(230, 214, 46, 0.3)',
  '3': 'rgba(230, 214, 46, 0.5)',
  '4': 'rgba(230, 214, 46, 0.7)',
  '5': 'rgba(230, 214, 46, 0.9)',
};

export const transitZoneStyles = {
  'transit-zones-fill': {
    paint: {
      'fill-color': {
        property: 'ceqrzone',
        type: 'categorical',
        stops: [
          [1, transitZoneColors['1']],
          [2, transitZoneColors['2']],
          [3, transitZoneColors['3']],
          [4, transitZoneColors['4']],
          [5, transitZoneColors['5']],
        ],
      },
    },
  },
};
