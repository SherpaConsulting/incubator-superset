import React from 'react';
import { WmsContext } from './WmsContext';

class WmsLayer extends React.Component {
  componentDidMount() {
    const { id, url, version, type, mime, layers, tileSize, zIndex } = this.props;
    const { addLayer } = this.context;

    switch (type) {
      case 'WMTS':
      case 'WMS':
        break;

      default:
        console.warn('Unsupported layer type', type);
        return;
    }

    let fullUrl = url;
    // 'https://geodata.state.nj.us/imagerywms/Natural2015
    // ?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=Natural2015'

    if (type === 'WMTS') {
      fullUrl += `&service=WMTS&request=GetTile&version=${version}&request=GetTile`;
    } else if (type === 'WMS') {
      let srs = 'srs';
      if (version === '1.3.0')
        srs = 'crs';
      fullUrl += `&service=WMS&request=GetMap&bbox={bbox-epsg-3857}&${srs}=EPSG:3857&` +
        `format=${mime || 'image/png'}&version=${version}&layers=${layers}&` +
        `width=${tileSize}&height=${tileSize}`;

      if (mime === 'image/png')
        fullUrl += '&transparent=true'
    }


    fullUrl = fullUrl.replace('?&', '?');

    console.log('Adding layer', url, fullUrl);

    addLayer({
      id,
      type: 'raster',
      source: {
        id,
        type: 'raster',
        tiles: [
          fullUrl
        ],
        tileSize
      },
      paint: {}
    }, zIndex);
  }

  componentWillUnmount() {
    const { id } = this.props;
    const { removeLayer } = this.context;
    removeLayer(id);
  }

  render() { return null; }
}

WmsLayer.contextType = WmsContext;

export default WmsLayer;