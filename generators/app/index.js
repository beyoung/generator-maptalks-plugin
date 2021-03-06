'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.argument('appname', { type: String, required: false });
  }

  prompting() {
    this.log(
      yosay(`Welcome to the premium ${chalk.red('generator-maptalks-plugin')} generator!`)
    );
    let prompts = [];
    if (this.options.appname === undefined) {
      prompts = [
        {
          type: 'input',
          name: 'name',
          message: 'please input a root directory for your maptalks plugin?',
          default: 'myplugin'
        }
      ];
    }

    return this.prompt(prompts).then(props => {
      this.props = props
    });
  }
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  writing() {
    let appname = '';
    if (this.options.appname === undefined) {
      appname = this.props.name;
    } else {
      appname = this.options.appname;
    }
    let pluginSubfix = 'maptalks.';
    let dist = 'dist';
    let files = [
      'gulpfile.js',
      'index.js',
      'package.json',
      'README.md',
      '.gitignore',
      '.babelrc'
    ];
    let currentPath = this.destinationPath(pluginSubfix + appname);
    mkdirp.sync(currentPath);

    this.destinationRoot(currentPath);
    let _this = this;
    files.forEach(function (item) {
      if (item == 'package.json') {
        _this.fs.copy(_this.templatePath(item), _this.destinationPath(item), {
          process: function (content) {
            var regEx = new RegExp('myplugin', 'g');
            var newContent = content.toString().replace(regEx, appname);
            return newContent;
          }
        });
      }
      else if (item == 'index.js') {
        _this.fs.copy(_this.templatePath(item), _this.destinationPath(item), {
          process: function (content) {
            var regEx = new RegExp('HelloLayer', 'g');
            var newContent = content.toString().replace(regEx, _this.capitalizeFirstLetter(appname) + 'Layer');
            return newContent;
          }
        });
      } else {
        _this.fs.copy(_this.templatePath(item), _this.destinationPath(item));
      }
    });

    mkdirp.sync(this.destinationPath(dist));
  }

  install() {
    this.installDependencies();
  }
};
