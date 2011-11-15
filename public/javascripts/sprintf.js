
/*
 * fake something like printf functionality
 */
String.prototype.sprintf = String.prototype.sprintf || function () {

    _self = this;

    // FIXME: check what each browser thinks an array is
    if (arguments.length < 2 && typeof arguments[0] === 'object') {

        // FIXME: assumes a lot here
        arguments = arguments[0];

    }

    for (var i=0; i < arguments.length; i++) {

        switch (typeof arguments[i]) {

            case 'string':
            _self = _self.replace( /%s/, arguments[i]);
            break;

            case 'number':
            _self = _self.replace( /%d/, arguments[i]);
            break;

            case 'boolean':
            _self = _self.replace( /%b/, arguments[i]);
            break;

            default:
            break;

        }

    }

    return _self;

}

Array.prototype.contains = Array.prototype.contains || function(v) {
  for (var i=0; i < this.length; i++) {
    if(this[i] == v) return true;
  }
  return false;
}