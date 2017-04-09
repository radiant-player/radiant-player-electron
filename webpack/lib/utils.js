const path = require('path');

const root = path.resolve(path.join(__dirname, '..', '..'));
const resolveRoot = filePath => path.resolve(root, filePath);

module.exports = {
  root,
  resolveRoot,
};
