cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-camera-preview.CameraPreview",
        "file": "plugins/cordova-plugin-camera-preview/www/CameraPreview.js",
        "pluginId": "cordova-plugin-camera-preview",
        "clobbers": [
            "CameraPreview"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.3.2",
    "cordova-plugin-camera-preview": "0.9.0"
};
// BOTTOM OF METADATA
});