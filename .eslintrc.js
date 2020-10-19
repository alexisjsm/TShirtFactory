module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: ['plugin:jest/recommended', 'standard', 'prettier'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['jest', '@babel'],
  rules: { 
    
  }
}
