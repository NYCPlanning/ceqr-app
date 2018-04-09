import Service from '@ember/service';

export default Service.extend({
  analysisThreshold: () => ([
    {name: "Bronx", es: 90, hs: 787},
    {name: "Brooklyn", es: 121, hs: 1068},
    {name: "Manhattan", es: 310, hs: 2492},
    {name: "Queens", es: 124, hs: 1068},
    {name: "Staten Island", es: 165, hs: 1068}, 
  ]),
  
  thresholdFor: (boro) => {
    const boroughs = {
      Bronx: {es: 90, hs: 787},
      Brooklyn: {es: 121, hs: 1068},
      Manhattan: {es: 310, hs: 2492},
      Queens: {es: 124, hs: 1068},
      "Staten Island": {es: 165, hs: 1068},
    }

    return boroughs[boro];
  },
});