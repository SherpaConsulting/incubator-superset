import React from 'react';
import PropTypes from 'prop-types';
import { t } from '@superset-ui/translation';
import ControlHeader from '../ControlHeader';
import VirtualizedSelect from 'react-virtualized-select';
import OnPasteSelect from '../../../components/OnPasteSelect';
import AdaptiveCollectionControl from './AdaptiveCollectionControl';
import { SupersetClient } from '@superset-ui/connection';
import shortid from 'shortid';
import { provideAdaptiveConfig } from 'src/utils/adaptive';
import CheckboxControl from './CheckboxControl';

function toOption(layer) {
  return { label: layer.name, value: layer.uuid };
}

class AdaptiveControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      baselayers: [],
      layers: []
    }

    this.onBaselayerChange = this.onBaselayerChange.bind(this);
    this.onLayersChange = this.onLayersChange.bind(this);
    this.onDisplayLayerSwitchChange = this.onDisplayLayerSwitchChange.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.baselayers !== state.prevBaselayers
      || props.layers !== state.prevLayers) {
      return {
        prevBaselayers: props.baselayers,
        prevLayers: props.layers,
        baselayers: props.baselayers.map(toOption),
        layers: props.layers.map(toOption),
      };
    }
    return null;  }

  onBaselayerChange(opt) {
    let baselayer = null;
    if (opt) {
      baselayer = opt.value;
    }
    this.onChange({ baselayer });
  }

  onLayersChange(layers) {
    this.onChange({ layers });
  }

  onDisplayLayerSwitchChange(displayLayerSwitch) {
    this.onChange({ displayLayerSwitch });
  }

  onChange(newValue) {
    this.props.onChange({ ...this.props.value, gui: this.props.gui, ...newValue });
  }

  render() {
    const {
      adaptiveConfigLoaded,
      gui,
      name,
      value,
    } = this.props;

    const {
      baselayers,
      layers,
    } = this.state;

    const {
      baselayer: selectedBaselayer,
      layers: selectedLayers,
      displayLayerSwitch
    } = value || {};

    return (
      <div className="adaptive-configuration">
        {!adaptiveConfigLoaded
          ? <div className='loading'>{t('Loading')}</div>
          : (
            <React.Fragment>
              <div className="row space-1">
                <div className="col-xs-12">
                  <div className="Control">
                    <ControlHeader label={t('Base layer from') + ' ' + gui.name} />
                      <OnPasteSelect
                        name={`adaptive-basemap-${name}`}
                        placeholder={t('choose a baselayer')}
                        options={baselayers}
                        value={selectedBaselayer}
                        labelKey="label"
                        valueKey="value"
                        clearable
                        closeOnSelect
                        onChange={this.onBaselayerChange}
                        selectWrap={VirtualizedSelect}
                      />
                  </div>
                </div>
              </div>
              <div className="row space-1">
                <div className="col-xs-12">
                  <AdaptiveCollectionControl
                    label={t('Layers from') + ' ' + gui.name}
                    name={`adaptive-layers-${name}`}
                    placeholder={t('choose layers')}
                    controlProps={{
                      placeholder: t('choose layer'),
                      options: layers,
                      labelKey: "label",
                      valueKey: "value",
                    }}
                    value={selectedLayers !== undefined ? selectedLayers : []}
                    onChange={this.onLayersChange}
                    selectWrap={VirtualizedSelect}
                  />
                </div>
              </div>
              <div className="row space-1">
                <div className="col-xs-12">
                  <CheckboxControl
                    label={t('Display layer switch')}
                    value={displayLayerSwitch}
                    onChange={this.onDisplayLayerSwitchChange}
                  />
                </div>
              </div>
            </React.Fragment>
          )
        }
      </div>
    );
  }
}

export default provideAdaptiveConfig(AdaptiveControl);