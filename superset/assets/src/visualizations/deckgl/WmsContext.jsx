import React from 'react';
import { _MapContext as MapContext } from 'react-map-gl';
import { map } from 'd3';

export const WmsContext = React.createContext({});

class WmsContextProviderImpl extends React.Component {
  constructor(props) {
    super(props);

    this.addLayer = this.addLayer.bind(this);
    this.removeLayer = this.removeLayer.bind(this);

    this.layers = [];
  }

  componentDidMount() {
    const { map } = this.props;

    if (map) {
      if (map.loaded()) {
        this.onMapLoad();
      } else {
        map.on('load', () => {
          this.onMapLoad();
        });
      }
    }
  }

  onMapLoad() {
    const { map } = this.props;
    this.mapLoaded = true;
    this.layers.forEach(({ layer }) => {
      map.addLayer(layer);
    });
  }

  addLayer(layer, zIndex) {
    const { map } = this.props;

    this.layers.push({ layer, zIndex });
    this.layers.sort((a, b) => a.zIndex - b.zIndex);

    if (this.mapLoaded) {
      const idx = this.layers.findIndex(({ layer: l }) => l.id === layer.id);
      var beforeId = null;
      if (idx < this.layers.length - 1)
        beforeId = this.layers[idx + 1].layer.id;

      map.addLayer(layer, beforeId);
    }
  }

  removeLayer(id) {
    const { map } = this.props;

    if (map.getLayer(id))
      map.removeLayer(id);
    if (map.getSource(id))
      map.removeSource(id);
    this.layers = this.layers.filter(({ layer }) => layer.id !== id);
  }

  render() {
    return (
      <WmsContext.Provider value={{
        addLayer: this.addLayer,
        removeLayer: this.removeLayer
      }}>
        {this.props.children}
      </WmsContext.Provider>
    );
  }
}

const WmsContextProvider = (props) => (
  <MapContext.Consumer>
    {({ map }) => map ? <WmsContextProviderImpl {...props} map={map} /> : null}
  </MapContext.Consumer>
);

export default WmsContextProvider;