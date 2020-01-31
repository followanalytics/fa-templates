var config_json = require('./definition.json');
var zipper = require('zip-a-folder');

const templateVersion = config_json.template_options.version;
const templateName = config_json.template_options.technical_name;
zipper.zipFolder('./dist', './' + templateName + '-' + templateVersion + '.zip', function (error) {
  if (error) {
    console.log('Error: ' + error);
  }
  else console.log('Template zipped successfully!');
});
