const zipdir = require('zip-dir');
const del = require('del');
const path = require('path');
const settings = require('../public/settings.json')
const moment = require('moment')
const format = 'YYYY-MM-DD_HH-mm-ss'
const date = new Date();
const dateTime = moment(date).format(format);
const data = require(path.join('..', 'package.json'));
const fs = require("fs");
const appVersion = data.version;
const appName = data.name;
const buildType = process.env.REACT_APP_BUILD || '';
const saveTo = `build/${appVersion}_${appName}_${buildType}_${dateTime}.zip`;

settings.settings.cmsData.version = appVersion

fs.writeFile(path.join('build', 'settings.json'), JSON.stringify(settings, null, 4), () => {
    del.sync(['build/*.zip']);
    zipdir('build/', {saveTo}, () => {
    });
})