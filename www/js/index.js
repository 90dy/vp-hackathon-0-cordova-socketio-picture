/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {
  startCamera: function(onSuccess){
    CameraPreview.startCamera({camera: "back", tapPhoto: true, previewDrag: false, toBack: true}, onSuccess);
  },

  stopCamera: function(onSuccess){
    CameraPreview.stopCamera(onSuccess);
  },

  takePicture: function(onSuccess){
    CameraPreview.takePicture(function(imgData){
      onSuccess('data:image/jpeg;base64,' + imgData);
    });
  },

  switchCamera: function(onSuccess){
    CameraPreview.switchCamera(onSuccess);
  },

  show: function(){
    CameraPreview.show();
  },

  hide: function(){
    CameraPreview.hide();
  },

  changeColorEffect: function(){
    var effect = document.getElementById('selectColorEffect').value;
    CameraPreview.setColorEffect(effect);
  },

  changeFlashMode: function(){
    var mode = document.getElementById('selectFlashMode').value;
    CameraPreview.setFlashMode(mode);
  },

  changeZoom: function(){
    var zoom = document.getElementById('zoomSlider').value;
    document.getElementById('zoomValue').innerHTML = zoom;
    CameraPreview.setZoom(zoom);
  },

  changePreviewSize: function(){
    window.smallPreview = !window.smallPreview;
    if (window.smallPreview) {
      CameraPreview.setPreviewSize({width: 100, height: 100});
    } else {
      CameraPreview.setPreviewSize({width: window.screen.width, height: window.screen.height});
    }
  },

  showSupportedPictureSizes: function(){
    CameraPreview.getSupportedPictureSizes(function(dimensions){
      dimensions.forEach(function(dimension) {
        console.log(dimension.width + 'x' + dimension.height);
      });
    });
  },

  init: function(){
    /*document.getElementById('startCameraAboveButton').addEventListener('click', this.startCameraAbove, false);
    document.getElementById('startCameraBelowButton').addEventListener('click', this.startCameraBelow, false);

    document.getElementById('stopCameraButton').addEventListener('click', this.stopCamera, false);
    document.getElementById('switchCameraButton').addEventListener('click', this.switchCamera, false);
    document.getElementById('showButton').addEventListener('click', this.show, false);
    document.getElementById('hideButton').addEventListener('click', this.hide, false);
    document.getElementById('takePictureButton').addEventListener('click', this.takePicture, false);
    document.getElementById('selectColorEffect').addEventListener('change', this.changeColorEffect, false);
    document.getElementById('selectFlashMode').addEventListener('change', this.changeFlashMode, false);

    if(navigator.userAgent.match(/Android/i)  == "Android"){
      document.getElementById('zoomSlider').addEventListener('change', this.changeZoom, false);
    }else{
      document.getElementById('androidOnly').style.display = 'none';
    }

    window.smallPreview = false;
    document.getElementById('changePreviewSize').addEventListener('click', this.changePreviewSize, false);

    document.getElementById('showSupportedPictureSizes').addEventListener('click', this.showSupportedPictureSizes, false);
    */

    // legacy - not sure if this was supposed to fix anything
    window.addEventListener('orientationchange', function() {
      this.stopCamera(this.startCamera);
    }, false);
  }
};

document.addEventListener('deviceready', function() {
  app.init();



  var socket = io('http://10.102.187.168:1337/camera');

  socket.on('connect', function() {
    console.log("socket-io : Connected");

    app.startCamera(function () {
      console.log('camera started')
      setTimeout(function () {

        CameraPreview.getWhiteBalanceMode(function(whiteBalanceMode){
          console.log(whiteBalanceMode);
        });
        CameraPreview.getSupportedWhiteBalanceModes(function(whiteBalanceModes){
          console.log(whiteBalanceModes);
        });
        CameraPreview.setWhiteBalanceMode('lock')
        CameraPreview.getFocusMode(function(currentFocusMode){
          console.log(currentFocusMode);
        });

        CameraPreview.getSupportedFocusModes(function(focusModes){
          focusModes.forEach(function(focusMode) {
            console.log(focusMode + ', ');
          });
        });
      }, 5000);        
    });


    socket.on('capture', function(data) {
      console.log(data);
      app.takePicture(function (img) {
        console.log(img);
        cordovaHTTP.post(
          'http://10.102.187.168:80/v1/samples/' + data.ref + '/image',
          { image: img },
          {},
          function(response) {
            console.log(response);
          },
          function(response) {
            console.error(response);
          }
        )
      })
    });

    socket.on('message', function() {
      console.log("socket-io : Message");
    })
  })



}, false);
