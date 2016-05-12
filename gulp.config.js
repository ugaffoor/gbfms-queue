module.exports = {
  DESTINATION: './dist',
  VENDOR_DESTINATION: './dist/vendors',
  TEMP: './.tmp',
  CSS_DESTINATION: './dist/css',
  APP_DESTINATION: './dist/app',
  MODULE_NAME: 'kd.bundle.angular',

  INDEX_FILE: './kapp_src.jsp',

  JADE_SRC: [
    './app/**/*.jade'
  ],

  APP_SRC: [
    './app/**/*.js'
  ],

  TEMPLATE_SRC: [
    './app/**/*.html',
    './.tmp/**/*.html'
  ],

  SASS_SRC: [
    './app/**/*.scss',
    '!./app/**/_*.scss'
  ],

  FONTS_SRC: [
    './thirdparty/font-awesome/fonts/*.{ttf,woff,woff2,eof,svg}'
  ],

  APPLICATION_SRC: [
    './app/**/*.js'
  ],

  UGLIFY_OPTONS: {
    mangle: false,
    output: {
      beautify: {
        quote_style: 3
      },
      ascii_only: true
    }
  }
};
