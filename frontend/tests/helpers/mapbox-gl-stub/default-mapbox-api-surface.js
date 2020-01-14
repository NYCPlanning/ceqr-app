// Stub for MapboxGL subclasses known as User Interaction Handlers
// see https://docs.mapbox.com/mapbox-gl-js/api/#user%20interaction%20handlers
export const UserInteractionHandlerStub = {
  isEnabled: () => {},
  isActive: () => {},
  enable: () => {},
  disable: () => {},
};

// default mapbox instance stub with a few common methods. this is incomplete,
// usually the methods should be added to specific tests
export const defaultMapboxEventStub = {
  mapInstance: {
    addControl: () => {},
    addLayer: () => {},
    areTilesLoaded: () => true,
    fitBounds: () => {},
    getBearing: () => {},
    getCanvas: () => ({ style: {} }),
    getCenter: () => ({ lat: 0, lng: 0, toArray: () => [0, 0] }),
    getStyle: () => ({ sources: {}, layers: {} }),
    getZoom: () => {},
    off: () => {},
    on: () => {},
    queryRenderedFeatures: () => [],
    querySourceFeatures: () => [],
    removeControl: () => {},
    removeLayer: () => {},
    resize: () => {},
    setFilter: () => {},
    setPaintProperty: () => {},
    unproject: () => ({ lat: 0, lng: 0, toArray: () => [0, 0] }),

    scrollZoom: UserInteractionHandlerStub,
    boxZoom: UserInteractionHandlerStub,
    dragRotate: UserInteractionHandlerStub,
    dragPan: UserInteractionHandlerStub,
    keyboard: UserInteractionHandlerStub,
    doubleClickZoom: UserInteractionHandlerStub,
    touchZoomRotate: UserInteractionHandlerStub,
  },
  draw: {
    add: () => {},
    set: () => {},
    getAll: () => ({ features: [] }),
    getSelected: () => [],
    getSelectedPoints: () => ({ features: [] }),
    getSelectedIds: () => [],
    getMode: () => 'simple_select',
    changeMode: () => {},
  },
};
