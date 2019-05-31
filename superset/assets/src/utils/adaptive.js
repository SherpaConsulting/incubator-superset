import React from 'react';

export function provideBaatToken(Component) {
  class WrappedComponent extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        baatToken: null,
      }
    }

    componentDidMount() {
      const { config } = this.props;

      if (!config || !config.gui) return;

      fetch(config.gui.url + 'WebServices/generic/Baat.ashx', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
        .then(r => r.json())
        .then(json => {
          if (json.success) {
            this.setState({
              baatToken: json.token
            });
          } else {
            console.warn('Could not obtain BAAT token');
          }
        })
        .catch(err => {
          console.warn('Could not obtain BAAT token', err);
        });
    }

    render() {
      return <Component {...this.props} {...this.state} />;
    }
  }

  return WrappedComponent;
}

export function provideAdaptiveConfig(Component) {
  class WrappedComponent extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        adaptiveConfigLoaded: false,
        baselayers: [],
        layers: [],
      }
    }

    componentDidMount() {
      this.loadConfig();
    }

    gui() {
      const { config } = this.props;
      if (config && config.gui) return config.gui;

      try {
        var bootstrap = JSON.parse(document.getElementById("app").attributes["data-bootstrap"].value);
        var adaptiveConfig = JSON.parse(bootstrap.common.conf.ADAPTIVE_CONFIG);
        return adaptiveConfig.gui;
      } catch (err) {
        console.error('No Adaptive config available', err);
      }
    }

    loadConfig() {
      const gui = this.gui();
      if (!gui) return;

      fetch(gui.url + 'WebServices/client/Configuration.asmx/ReadAppConfig', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          guuid: gui.uuid
        })
      })
        .then(r => r.json())
        .then(json => {
          if (json.d.success) {
            const data = json.d.data;
            const layers = data.find(d => d.key === 'layers').value;

            this.setState({
              adaptiveConfigLoaded: true,
              baselayers: layers.filter(l => l.is_base_layer),
              layers: layers.filter(l => !l.is_base_layer)
            });
          } else {
            console.warn('Adaptive config load failed', json.d);
            this.setState({ adaptiveConfigError: err });
          }
        })
        .catch(err => {
          console.warn('Adaptive config load failed', err);
          this.setState({ adaptiveConfigError: err });
        });
    }

    render() {
      const gui = this.gui();
      if (!gui) return null;
      return <Component {...this.props} {...this.state} gui={gui} />;
    }
  }

  return WrappedComponent;
};
