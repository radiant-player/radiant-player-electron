import _ from 'lodash';

import request from 'request';

class BarakaLyrics {
  constructor() {
    this._ = _;
    this.request = request;
  }
}

module.exports = BarakaLyrics;
