import React from 'react';
import { _MapContext as MapContext } from 'react-map-gl';

export const WmsContext = React.createContext({});

class WmsContextProviderImpl extends React.Component {
  constructor(props) {
    super(props);

    this.addLayer = this.addLayer.bind(this);

    this.layers = [];
  }

  componentDidMount() {
    const { map } = this.props;

    if (map) {
      map.on('load', () => {
        this.mapLoaded = true;
        this.layers.forEach(({ layer }) => {
          console.log('Add layer to map', layer)
          map.addLayer(layer);
        })
      });
    }
  }

  addLayer(layer, zIndex) {
    const { map } = this.props;

    this.layers.push({ layer, zIndex });
    this.layers.sort((a, b) => a.zIndex - b.zIndex);

    if (this.mapLoaded) {
      map.addLayer(layer);
    }
  }

  render() {
    return (
      <WmsContext.Provider value={{
        addLayer: this.addLayer
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