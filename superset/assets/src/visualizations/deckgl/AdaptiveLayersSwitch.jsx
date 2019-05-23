import React from 'react';
import './AdaptiveLayersSwitch.css';

export default class AdaptiveLayersSwitch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };

    this.onToggleSwitch = this.onToggleSwitch.bind(this);
    this.onToggleLayer = this.onToggleLayer.bind(this);
  }

  onToggleSwitch() {
    this.setState(state => ({
      show: !state.show
    }));
  }

  onToggleLayer(layer) {
    const { layers, activeLayers, onChange } = this.props;
    if (onChange) {
      const idx = activeLayers.indexOf(layer);
      if (idx === -1) {
        onChange(layers.map(l => l.uuid).filter(l => activeLayers.indexOf(l) !== -1 || l === layer));
      } else {
        onChange(layers.map(l => l.uuid).filter(l => activeLayers.indexOf(l) !== -1 && l !== layer));
      }
    }
  }

  render() {
    const { layers, activeLayers } = this.props;
    const { show } = this.state;

    const isActive = uuid => activeLayers.indexOf(uuid) !== -1;

    console.log('Rendered switch', layers, activeLayers);
    return (
      <div className="adaptive-layers-switch">
        <button className="btn btn-sm btn-default" onClick={this.onToggleSwitch}><i className="fa fa-map"/></button>
        {show &&
          <div className="adaptive-layers-switch--content">
            {layers.map(layer => (
              <div
                key={layer.uuid}
                className={"adaptive-layers-switch--layer" + (isActive(layer.uuid) ? ' active' : '')}
                onClick={() => this.onToggleLayer(layer.uuid)}
              >
                <i className={"fa " + (isActive(layer.uuid) ? "fa-check-square-o" : "fa-square-o")} />
                {layer.name}
              </div>
            ))}
          </div>
        }
      </div>
    );
  }
}
