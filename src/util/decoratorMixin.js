
function onChange(target) {
  target.prototype.onChange = function (value, flag) {
     this.setState({
       [flag]: value,
     })
  };
}

export { onChange };
