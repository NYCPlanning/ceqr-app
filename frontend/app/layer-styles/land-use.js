export const landUseColors = {
  '01': '#f4f455',
  '02': '#f7d496',
  '03': '#FF9900',
  '04': '#f7cabf',
  '05': '#ea6661',
  '06': '#d36ff4',
  '07': '#dac0e8',
  '08': '#5CA2D1',
  '09': '#8ece7c',
  10: '#bab8b6',
  11: '#5f5f60',
};

export const landUseStyles = {
  'land-use': {
    paint: {
      'fill-opacity': 1,
      'fill-color': {
        property: 'landuse',
        type: 'categorical',
        stops: [
          ['01', landUseColors['01']],
          ['02', landUseColors['02']],
          ['03', landUseColors['03']],
          ['04', landUseColors['04']],
          ['05', landUseColors['05']],
          ['06', landUseColors['06']],
          ['07', landUseColors['07']],
          ['08', landUseColors['08']],
          ['09', landUseColors['09']],
          ['10', landUseColors['10']],
          ['11', landUseColors['11']],
        ],
      },
    },
  },
};
