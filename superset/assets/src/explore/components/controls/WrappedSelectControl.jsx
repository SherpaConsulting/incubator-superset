import React from 'react';
import SelectControl from './SelectControl';

const WrappedSelectControl = (props) => {
  function onChange(value) {
    props.onChange({ value });
  }
  return <SelectControl {...props} showHeader={false} onChange={onChange} />;
};

export default WrappedSelectControl;
