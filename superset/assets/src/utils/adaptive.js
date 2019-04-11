import React from 'react';

export function provideBaatToken({ adaptiveUrl }) {
  return (Component) => {
    class WrappedComponent extends React.Component {
      constructor(props) {
        super(props);

        this.state = {
          baatToken: null,
        }
      }

      componentDidMount() {
        fetch(adaptiveUrl + 'WebServices/generic/Baat.ashx', {
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
            }
          });
      }

      render() {
        return <Component {...this.props} {...this.state} />;
      }
    }

    return WrappedComponent;
  };
}

export function provideAdaptiveConfig({ adaptiveUrl, guiUuid }) {
  return (Component) => {
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

      loadConfig() {
        fetch(adaptiveUrl + 'WebServices/client/Configuration.asmx/ReadAppConfig', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            guuid: guiUuid
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
            }
          });
      }

      render() {
        return <Component {...this.props} {...this.state} />;
      }
    }

    return WrappedComponent;
  };
};
