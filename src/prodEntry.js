// In the production build we need to set the public path based on the bundle's
// location.  The 'bundle' global variable has a helper to tell us where that is
// and then we require the main index.
__webpack_public_path__ = bundle.location() + '/static/';

require ('./index');