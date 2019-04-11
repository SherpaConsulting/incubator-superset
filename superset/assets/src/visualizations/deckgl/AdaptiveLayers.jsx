import React from 'react';
import WmsLayer from './WmsLayer';
import { provideAdaptiveConfig, provideBaatToken } from 'src/utils/adaptive';
import { addDangerToast } from 'src/messageToasts/actions';
import WmsContextProvider from './WmsContext';

const AdaptiveConfig = {
  baseUrl: 'https://a3latest.avinet.no/',
  name: 'Adaptive3 latest',
  guiId: 1,
  guiUuid: 'f434dede-e23b-4149-bcd0-37651d1dd66e'
};

class AdaptiveLayers extends React.Component {
  renderLayer(idx, layer) {
    if (!layer) return null;

    let url = layer.url.split('|')[0];

    const requiresBaat = url.indexOf('BaatGatekeeper') !== -1;
  
    if (
      (requiresBaat || layer.layer_type_value === 'WMS')
      && url.indexOf('?') === -1
    ) {
      url += '?';
    }
  
    if (requiresBaat) {
      if (!this.props.baatToken)
        return null;
  
      url += '&GKT=' + this.props.baatToken;
    }
  
    if (layer.is_internal) {
      url += '&GUI=' + AdaptiveConfig.guiId;
    }
  
    return (
      <WmsLayer
        key={layer.uuid}
        id={layer.uuid}
        zIndex={idx}
        url={url}
        layers={layer.layers}
        version={layer.version_value}
        tileSize={layer.tile_size}
        type={layer.layer_type_value}
        mime={layer.image_format_value}
      />
    );
  }

  render() {
    const {
      config: { baselayer: selectedBaselayer, layers: selectedLayers },
      baselayers,
      layers,
      adaptiveConfigLoaded
    } = this.props;

    if (!adaptiveConfigLoaded) return null;

    return <WmsContextProvider>
      {selectedBaselayer && this.renderLayer(-1, baselayers.find(layer => layer.uuid === selectedBaselayer))}
      {selectedLayers && selectedLayers.map((layer, idx) => this.renderLayer(idx, layers.find(l => l.uuid === layer)))}
    </WmsContextProvider>
  }
}

export default
  provideAdaptiveConfig({ adaptiveUrl: AdaptiveConfig.baseUrl, guiUuid: AdaptiveConfig.guiUuid })(
    provideBaatToken({ adaptiveUrl: AdaptiveConfig.baseUrl })(
      AdaptiveLayers
    )
  );