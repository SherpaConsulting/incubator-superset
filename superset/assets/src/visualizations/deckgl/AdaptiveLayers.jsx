import React from 'react';

export default class AdaptiveLayers extends React.Component {
  render() {
    const { basemap, layers } = this.props;
    console.log('AdaptiveLayers', basemap, layers);
    return null;
  }
}