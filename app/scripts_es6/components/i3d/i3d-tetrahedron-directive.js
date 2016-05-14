// * i3d-tetrahedron-directive.js
// * creates three.js component registered with Camera3d and added to scene<br>
//   pass in params as attrs
//
// * @dependencies: Camera3d, Transform3d<br>
//   @param {services/camera3d-service.js} Camera3d<br>
//   @param {services/transform3d-service.js} Transform3d<br>
//   @param {services/log-service.js} Log<br>
//   @param {utils/colourToHex.js} colourToHex<br>
//   @ngInject
//
// * NOTE: ngInject is used by ngAnnotate to generate a 
//   minification-safe injection annotation such as:
//   ```function($scope) => ['$scope', function($scope){}]```
//
// * NOTE:uses shaders ShaderMaterial to texture three.js PlaneBufferedGeometry
// * NOTE: Camera3d.addActorToScene(pid, id, node) adds the node as a child to 
//   Camera3d.actor[pid] if pid is defined,
//   and as a child of webgl scene otherwise (i.e. if root)
// * NOTE: all work constructing the node (THREE.js Object3d) is done in pre-link
//   function since pre-links are run after controller constructor and in
//   root-to-leaf order so that correct relative transforms are computed in webgl
//   RECALL: link-fs (===post-link-fs) are run in leaf-to-root order!! 
// * NOTE: controller must use services for $scope $element and $attrs whereas
//   pre-link (and post-link) receive these three args (in order) as well as
//   a fourth arg instance of the controller
// * NOTE: $destroy occurs when the angular jQuery wrapper is destroyed.
//   Thus the wrapper is removed from the DOM but not the 'raw' DOM element
//   nor, more importantly, the webgl node in the underlying webgl scenegraph


angular.module('app').directive("i3dTetrahedron", function(Camera3d, 
  Transform3d, Log, colourToHex){
  "use strict";

  
  // return DDO<br>
  // scope:true => unique micro-scope for each i3d-node - see pid NOTE
  return {
    restrict: 'E',
    scope: 'true', 
    replace: 'false',
    templateNamespace: 'svg',
    compile: function(elem, attrs){
  


      // vars used by pre-link-f and (trivially) by post-link-f
      // * NOTE attrs  are all strings! - for safety must convert values<br>
      //   strings do NOT work as boolean values in Material for exp.<br>
      //   objects form and transform must converted by ```JSON.parse```
      var form,
      radius,
      detail,
      textureurl,
      color,
      opacity,
      transparent, 
      wireframe,
      tetrahedronGeometry,
      shaderMaterial,
      tetrahedronMaterial,
      basic_material = () => {

        // basic material
        tetrahedronMaterial = new THREE.MeshBasicMaterial({color: color, 
           transparent: transparent, opacity: opacity, wireframe:wireframe});
        // three.js blending<br>
        // * NOTE! - brightening of opaque image intersections 
        //   sometimes occurs (?!)<br>
        //   This should NOT occur with the following:<br>
        //   tetrahedronMaterial.blendDst = THREE.OneMinusSrcAlphaFactor;
        // * NOTE! brightening does occur with:<br>
        //   tetrahedronMaterial.blendDst = THREE.DstAlphaFactor;
        tetrahedronMaterial.depthTest = false;
        tetrahedronMaterial.blending = THREE.CustomBlending;
        tetrahedronMaterial.blendSrc = THREE.SrcAlphaFactor;
        //tetrahedronMaterial.blendDst = THREE.DstAlphaFactor;
        tetrahedronMaterial.blendDst = THREE.OneMinusSrcAlphaFactor;
        tetrahedronMaterial.blendEquation = THREE.AddEquation; // default
      },

      texture_material = (texture) => {  
        // filters
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipMapLinearFilter;
    
        // assuming you want the texture to repeat in both directions:<br>
        // how many times to repeat in each direction - default is (1,1),
        texture.wrapS = THREE.RepeatWrapping; 
        texture.wrapT = THREE.RepeatWrapping;
          
        // shaderMaterial<br>
        // = new THREE.MeshLambertMaterial({ map : texture });<br>
        // color is defined by one float (!?) => f f f ? so 1.0 => white ?
        shaderMaterial = new THREE.ShaderMaterial({ 
          uniforms: {
            color: {type: 'f', value: 1.0},
            map: {type: 't', value: texture}
          },
          vertexShader: document.getElementById("vsh.glsl").text,
          fragmentShader: document.getElementById("fsh.glsl").text,
          transparent: true
        });

        // three.js blending<br>
        // * NOTE! - brightening of opaque image intersections 
        //   sometimes occurs (?!)<br>
        //   This should NOT occur with the following:<br>
        //   tetrahedronMaterial.blendDst = THREE.OneMinusSrcAlphaFactor;
        // * NOTE! brightening does occur with:<br>
        //   tetrahedronMaterial.blendDst = THREE.DstAlphaFactor;
        //shaderMaterial.depthTest = false;
        //shaderMaterial.blending = THREE.CustomBlending;
        shaderMaterial.blendSrc = THREE.SrcAlphaFactor; // default
        //shaderMaterial.blendDst = THREE.DstAlphaFactor;
        shaderMaterial.blendDst = THREE.OneMinusSrcAlphaFactor; // default
        shaderMaterial.blendEquation = THREE.AddEquation; // default

        // material
        tetrahedronMaterial = shaderMaterial;
      }, //texture_material

      realize = (id, pid, transform) => {
        // create a webgl tetrahedron-node
        var node = new THREE.Mesh(tetrahedronGeometry, tetrahedronMaterial);
        node.material.side = THREE.DoubleSide;
      
        // add the Object3d to the scene and store in Camera3d actors by id
        Camera3d.addActorToScene(id, node, pid);
  
        // transform tetrahedron - relative to parent in THREE.js scene !!!
        Transform3d.apply(transform, node);
      },


      //pre-link runs root-to-leaf
      prelink = (scope, elem, attrs) => {
  
        // NOTE! attrs are all strings! - convert via JSON.parse!<br>   
        // pid is 'parent-id'
        var id = attrs.id,
            p = scope.p || {},
            pid = p.pid,
            texture,
            transform;
  
        // clear and set $scope.p.pid = id for subsequent children<br>
        // $scope.p is a different object for each level 
        scope.p = {};
        scope.p.pid = id;
  
  
        // evaluations/defaults
        form = JSON.parse(attrs.form) || {};
        radius = form.r || 1.0;
        detail = form.detail || 0.0;
        color = form.color || 'green';
        wireframe = form.wireframe || false;
        textureurl = form.textureurl; // no textureurl => color, no texture
        transparent = form.transparent || true;
        opacity = form.opacity || 1.0;
        transform = JSON.parse(attrs.transform || '{}');
  

        // convert color name to hex for use in three.js material
        if(!/^(#|0x)/.test(color)){
          color = colourToHex(color);
        }
  
        // geometry<br>
        // radius default=1, detail default=0 (adds additional vertices)
        tetrahedronGeometry = new THREE.TetrahedronGeometry(radius, detail);
  
  
        // material<br>
        // texture map => ShaderMaterial
        /*
        .loadTexture (url, mapping, onLoad, onError)
          url -- the url of the texture
          mapping -- Can be an instance of THREE.UVMapping, 
            THREE.CubeReflectionMapping, 
            THREE.SphericalReflectionMapping, or 
            THREE.SphericalRefractionMapping. 
            Describes how the image is applied to the object.
            Use undefined instead of null as a default value. 
            See mapping property of texture for more details. 
          onLoad -- callback function
          onError -- callback function
        */
        if(textureurl){

          //match =>  textureurl is a cached THREE.js texture with same name<br>
          //no-match => textureul is a relative url for http load
          if(/(_png|_jpg|_gif|_bmp)/.test(textureurl)){
            // if texture is found use it - else use color<br>
            // * NOTE: when using preloaded cached textures no http load
            //   is attempted - this is CRITICAL to maintaining root-to-leaf
            //   adding of actors to the webgl tree (following pre-link order)
            //   so relative transforms are correctly applied in the hierarchy
            // * NOTE: use window[textureurl] which converts string to var name
            //   of a THREE.js texture
            if(textureurl){
              texture_material(window[textureurl]);
            }else{
              basic_material();
            }
            // realize in webgl
            realize(id, pid, transform);
          }else{
            texture = THREE.ImageUtils.loadTexture(textureurl, 
              THREE.UVMapping, function(){       
                 texture_material(texture);
                 // realize in webgl
                 realize(id, pid, transform);
            }, 
            null,  // onProgress()
            function(){  // onError() - use basic_material - color
              basic_material();
              realize(id, pid, transform);
            });//loadTexture
          }
        }else{
          // no textureurl - BasicMeshMaterial<br>
          basic_material();
          realize(id, pid, transform);
        }//if-textureurl



        // cleanup
        elem.on("$destroy", function() {
          //Camera3d.removeActorFromScene(id);
          //scope = null;
        });

      },//pre-link runs root-to-leaf
      //post-link runs leaf-to-root
      postlink =  (scope, elem, attrs) => {
      };//post-link
      // vars
      
      // compile returns link={pre,post}
      return {
        pre: prelink,
        post: postlink
      };
    }//compile
  };//return DDO
});

