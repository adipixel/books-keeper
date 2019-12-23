module.exports = {
  root: true,
  extends: 'react-app',
  rules: {
    // https://eslint.org/docs/rules/max-lines
    'max-lines': [
      'error',
      { max: 200, skipBlankLines: true, skipComments: true },
    ],
  },
};
