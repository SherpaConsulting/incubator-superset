import React from 'react';
import PropTypes from 'prop-types';
import { t } from '@superset-ui/translation';
import ControlHeader from '../ControlHeader';
import VirtualizedSelect from 'react-virtualized-select';
import OnPasteSelect from '../../../components/OnPasteSelect';
import AdaptiveCollectionControl from './AdaptiveCollectionControl';
import { SupersetClient } from '@superset-ui/connection';
import shortid from 'shortid';

const AdaptiveConfig = {
  baseUrl: 'https://a3latest.avinet.no/',
  name: 'Adaptive3 latest',
  guiUuid: 'f434dede-e23b-4149-bcd0-37651d1dd66e'
};

export default class AdaptiveControl extends React.Component {

  constructor(props) {
    super(props);

    this.onBasemapChange = this.onBasemapChange.bind(this);
    this.onLayersChange = this.onLayersChange.bind(this);

    this.state = {
      values: [],
      basemaps: [],
      layers: []
    }
  }

  componentDidMount() {
    this.loadConfig();
  }

  loadConfig() {
    fetch(AdaptiveConfig.baseUrl + 'WebServices/client/Configuration.asmx/ReadAppConfig', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          guuid: AdaptiveConfig.guiUuid
        })
      })
      .then(r => r.json())
      .then(json => {
        if (json.d.success) {
          const data = json.d.data;
          const layers = data.find(d => d.key === 'layers').value;

          const toOption = l => ({ label: l.name, value: l.id, layer: l });

          this.setState({
            basemaps: layers.filter(l => l.is_base_layer).map(toOption),
            layers: layers.filter(l => !l.is_base_layer).map(toOption)
          });
        }
      });
  }

  onBasemapChange(opt) {
    let basemap = null;
    if (opt) {
      basemap = opt.value;
    }
    this.onChange({ basemap });
  }

  onLayersChange(layers) {
    console.log(layers);
    this.onChange({ layers: layers.join(',') });
  }

  onChange(newValues) {
    this.props.onChange({ ...this.props.value, ...newValues });
  }

  render() {
    const {
      basemaps,
      layers,
    } = this.state;

    const {
      name,
      value,
    } = this.props;

    const {
      basemap: selectedBasemap,
      layers: selectedLayers,
    } = value || {};

    console.log(selectedLayers)

    return (
      <div className="adaptive-configuration">
        <ControlHeader label={t('Basemap from ') + ' ' + AdaptiveConfig.name} />
        <OnPasteSelect
          name={`adaptive-basemap-${name}`}
          placeholder={t('choose a basemap')}
          options={basemaps}
          value={selectedBasemap}
          labelKey="label"
          valueKey="value"
          clearable
          closeOnSelect
          onChange={this.onBasemapChange}
          selectWrap={VirtualizedSelect}
        />
        <AdaptiveCollectionControl
          label={t('Layers from') + ' ' + AdaptiveConfig.name}
          name={`adaptive-layers-${name}`}
          placeholder={t('choose layers')}
          controlProps={{
            placeholder: t('choose layer'),
            options: layers,
            labelKey: "label",
            valueKey: "value",
          }}
          value={selectedLayers !== undefined ? selectedLayers.split(',') : []}
          onChange={this.onLayersChange}
          selectWrap={VirtualizedSelect}
        />
      </div>
    );
  }
}