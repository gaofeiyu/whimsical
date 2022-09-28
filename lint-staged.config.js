module.exports = {
  'packages/**/*': 'prettier --write --ignore-unknown',
  'packages/**.{js,jsx,ts,tsx}': 'eslint --ext .js,.jsx,.ts,.tsx',
  'packages/**/*.{css}': 'stylelint --allow-empty-input --fix',
};
