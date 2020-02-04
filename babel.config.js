module.exports = {
  presets: ['@vue/babel-preset-app'],
  plugins: [
    [
      'import',
      { libraryName: 'ant-design-vue', libraryDirectory: 'es', style: true }
    ]
  ]
};
