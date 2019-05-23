import React from 'react';
import WmsLayer from './WmsLayer';
import { provideAdaptiveConfig, provideBaatToken } from 'src/utils/adaptive';
import WmsContextProvider from './WmsContext';
import AdaptiveLayersSwitch from './AdaptiveLayersSwitch';

const AdaptiveConfig = {
  baseUrl: 'https://a3latest.avinet.no/',
  name: 'Adaptive3 latest',
  guiId: 1,
  guiUuid: 'f434dede-e23b-4149-bcd0-37651d1dd66e'
};

class AdaptiveLayers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeLayers: null
    };

    this.onActiveLayersChange = this.onActiveLayersChange.bind(this);
  }

  onActiveLayersChange(activeLayers) {
    console.log("Toggled some layers", activeLayers);
    this.setState({ activeLayers });
  }

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
      // Config indicates what layers from the configured instance should be used in this chart
      config: { baselayer, layers, displayLayerSwitch },
      // The following are all available layer configs as received from Adaptive
      baselayers: baselayerConfigs,
      layers: layerConfigs,
      adaptiveConfigLoaded
    } = this.props;

    // Postpone render until config is available
    if (!adaptiveConfigLoaded) return null;

    const {
      activeLayers
    } = this.state;

    // Map selected layer UUIDs to layer objects and use array index as zIndex to preserve
    // configured render order when toggling layers on/off
    const availableLayers = layers
      .map((layer, idx) => ({ zIndex: idx, layer: layerConfigs.find(l => l.uuid === layer) }))
      .filter(l => !!l.layer);

    // Filter available layers with the active layers list to only display layers toggled on. If
    // activeLayers is not set yet, render all layers.
    const renderedLayers = availableLayers
      .filter(l => !activeLayers || activeLayers.indexOf(l.layer.uuid) !== -1);

    return <WmsContextProvider>
      {baselayer && this.renderLayer(-1, baselayerConfigs.find(layer => layer.uuid === baselayer))}
      {layers && renderedLayers.map((l) => this.renderLayer(l.zIndex, l.layer))}
      {layers && displayLayerSwitch && (
        <AdaptiveLayersSwitch
          layers={availableLayers.map(({ layer }) => layer)}
          activeLayers={activeLayers || layers}
          onChange={this.onActiveLayersChange}
        />
      )}
    </WmsContextProvider>
  }
}

export default
  provideAdaptiveConfig({ adaptiveUrl: AdaptiveConfig.baseUrl, guiUuid: AdaptiveConfig.guiUuid })(
    provideBaatToken({ adaptiveUrl: AdaptiveConfig.baseUrl })(
      AdaptiveLayers
    )
  );