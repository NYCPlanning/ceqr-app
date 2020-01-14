export const transitZoneColors = {
  1: '#ffffb2',
  2: '#fecc5c',
  3: '#fd8d3c',
  4: '#f03b20',
  5: '#bd0026',
};

export const transitZoneStyles = {
  'transit-zones-fill': {
    paint: {
      'fill-color': {
        property: 'zone',
        type: 'categorical',
        stops: [
          ['1', transitZoneColors['1']],
          ['2', transitZoneColors['2']],
          ['3', transitZoneColors['3']],
          ['4', transitZoneColors['4']],
          ['5', transitZoneColors['5']],
        ],
      },
    },
  },
};
