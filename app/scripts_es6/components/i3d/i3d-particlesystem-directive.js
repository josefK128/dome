// * i3d-particlesystem-directive.js
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
// * NOTE:uses attribute to initialize GPUParticleSystem2.js, a slight
//   modification of three.js GPUParticleSystem.js to allow declarative
//   configuration of particle system via this directive
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


angular.module('app').directive("i3dParticlesystem", function(Camera3d, 
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
      // particlesystem vars
      var scene = Camera3d.scene(),
          particleSystem,
          maxParticles = 10000,
          textureUrl = 'images/p2.jpg',
          transform = {t: [0.0,-50.0,0.0]},
          transl = transform['t'],
          // options
          options,
      	  position = new THREE.Vector3(transl[0],transl[1],transl[2]),
          positionRandomness = 0.3,
          velocity = new THREE.Vector3(1.0, 1.0, 1.0),  // was 0,0,0 !
          velocityRandomness = 0.5,
          size = 5,
          sizeRandomness = 1,
          color = '0xaa88ff',
          colorRandomness = 0.2,
          turbulence = 0.5,
          lifetime = 2, 
          // spawnerOptions
          spawnerOptions,
          spawnRate = 100,
          horizontalSpeed = 1.5,
          verticalSpeed = 1.33,
          timeScale = 1,
          // animation
          tick = 0,
          clock = new THREE.Clock(true),
          r = 0.0,
          s = 0.0,
          y = 0.0,
          TWOPI = 6.28,
          // gui
          gui = new DAT.GUI({
            height: 9*32-1  // nlines*32-1
          }),
          realize = (id, pid, transform) => {

            // add the Object3d to the scene and store in Camera3d actors by id
            Camera3d.addActorToScene(id, particleSystem, pid);
            console.log(`added to scene particlesystem with texture ${textureUrl}`);
            console.log(`particlesystem has id = ${id}`);
      
            // transform particleSystem - relative to parent in THREE.js scene !!!
            Transform3d.apply(transform, particleSystem);
          },
          //pre-link runs root-to-leaf
          prelink = (scope, elem, attrs) => {
    
            // NOTE! attrs are all strings! - convert via JSON.parse!<br>   
            // pid is 'parent-id'
            var id = attrs.id,
                p = scope.p || {},
                pid = p.pid,
                tr = JSON.parse(attrs.transform),
                form = JSON.parse(attrs.form),
                o,
                spo,
                t,
                v,
                q;

            // short vars
            if(form){
              o = form['options']; 
              spo = form['spawnerOptions']; 
            }


            // diagnostics
//            if(tr){
//              console.log(`tr['t'] = ${tr['t']}`);
//            }else{
//              console.log(`tr['t'] does not exist!`);
//            }
//
//            if(o){
//              for(q in o){
//                if(o.hasOwnProperty(q)){
//                  console.log(`attrs.form.options has property ${q}`);
//                }
//              }
//            }else{
//              console.log(`attrs.form.options does not exist!`);
//            }
//
//            if(spo){
//              for(q in spo){
//                if(spo.hasOwnProperty(q)){
//                  console.log(`attrs.form.spawnerOptions has property ${q}`);
//                }
//              }
//            }else{
//              console.log(`attrs.form.spawnerOptions does not exist!`);
//            }

            // declarative attr-values from model OR defaults (from above) 
            // particlesystem vars
            if(tr){
              transform = tr || transform; // for Transform3d - object
              t = tr.t;
              console.log(`setting position t = ${t}`);
              position = new THREE.Vector3(t[0],t[1],t[2]);
            }
            if(form){
              console.log('setting maxParticles and textureUrl');
              console.log(`form.maxParticles = ${form.maxParticles}`);
              console.log(`form.textureUrl = ${form.textureUrl}`);
              maxParticles = form.maxParticles || maxParticles;
              textureUrl =  form.textureUrl || textureUrl;
              // options
              if(o){
                console.log('setting options');
                for(q in o){
                  if(o.hasOwnProperty(q)){
                    console.log(`options has pr ${q} val ${o[q]}`);
                  }
                }
                positionRandomness = o.positionRandomness || positionRandomness;
                if(o.velocity){
                  v = o.velocity;
                  velocity = new THREE.Vector3(v[0], v[1], v[2]) || velocity;  
                }
                velocityRandomness = o.velocityRandomness || velocityRandomness;
                size = o.size || size ;
                sizeRandomness = o.sizeRandomness || velocityRandomness;
                color = o.color || color;
                colorRandomness = o.colorRandomness || colorRandomness;
                turbulence = o.turbulence || turbulence;
                lifetime = o.lifetime || lifetime;
              }
              // spawnerOptions
              if(spo){
                console.log('setting spawnerOptions');
                for(q in spo){
                  if(spo.hasOwnProperty(q)){
                    console.log(`spawnerOptions has pr ${q} val ${spo[q]}`);
                  }
                }
                spawnRate = spo.spawnRate || spawnRate;
                horizontalSpeed = spo.horizontalSpeed || horizontalSpeed;
                verticalSpeed = spo.verticalSpeed || verticalSpeed;
                timeScale = spo.timeScale || timeScale;
              }
            }


            // convert color name to hex for use in three.js material
            if(!/^(#|0x)/.test(color)){
              console.log(`convert to hex color = ${color}`);
              color = colourToHex(color);
            }


            // GPU particlesystem - init
            // The GPU Particle system extends THREE.Object3D, and so you can use it
            // as you would any other scene graph component.	Particle positions will be
            // relative to the position of the particle system, but you will probably only need one
            // system for your whole scene
            particleSystem = new THREE.GPUParticleSystem({
            	maxParticles: maxParticles,
              texture: textureUrl
            });
      
            // options passed during each spawned
            options = {
            	position: position,
            	positionRandomness: positionRandomness,
            	velocity: velocity,
            	velocityRandomness: velocityRandomness,
            	color: color,
            	colorRandomness: colorRandomness,
            	turbulence: turbulence,
            	lifetime: lifetime,
            	size: size,
            	sizeRandomness: sizeRandomness
            };
            spawnerOptions = {
            	spawnRate: spawnRate,        
            	horizontalSpeed: horizontalSpeed,
            	verticalSpeed: verticalSpeed,
            	timeScale: timeScale
            };
      
            // init gui
            gui.add(options, "velocityRandomness", 0, 3);
            gui.add(options, "positionRandomness", 0, 3);
            gui.add(options, "size", 1, 20);
            gui.add(options, "sizeRandomness", 0, 25);
            gui.add(options, "colorRandomness", 0, 1);
            gui.add(options, "lifetime", 0.1, 10);
            gui.add(options, "turbulence", 0, 1);
            gui.add(spawnerOptions, "spawnRate", 10, 10000);
            gui.add(spawnerOptions, "timeScale", -1, 1);
            
            // add specific animation for particle system to object of
            // frame-update animations called fr Camera3D in its animation loop
            if(!scene['animations']){
              scene['animations'] = {};
            }
            scene['animations'][id] = () => {
              var delta = clock.getDelta() * spawnerOptions.timeScale;
              tick += delta;
              if (tick < 0){ 
                tick = 0;
              }
              if (delta > 0) {
                if(y > 50.0){
                  y = -50 + Math.random();
                  r = 2.0 + Math.random();
                  s = Math.random();
                }else{
                  r += 2.0 * Math.random();
                  s += 0.1 * Math.random();
                  y += 4.0 * spawnerOptions.verticalSpeed * Math.max(r,s);   // was 4.0
                }
                options.position.x = r*Math.sin(s * TWOPI);
                options.position.y = y;                   
                options.position.x = r*Math.cos(s * TWOPI);
          
                for (var x = 0; x < spawnerOptions.spawnRate * delta; x++) {
              	// Yep, that's really it.	Spawning particles is super cheap, and once you spawn them, the rest of
              	// their lifecycle is handled entirely on the GPU, driven by a time uniform updated below
              	particleSystem.spawnParticle(options);
                }
              }

              particleSystem.update(tick);
            };
    
              
            // diagnostics
            console.log("added particlesystem update f to scene['animations']");
//            console.log(`scene['animations'] = ${scene['animations']}`);
//            if(scene['animations']){
//              for(let f of Object.keys(scene['animations'])){
//                console.log(`scene['animations'] has pr f = ${f}`);
//                console.log(`scene['animations'][f] = ${scene['animations'][f]}`);
//                scene['animations'][f]();
//              }
//            }
    
            // clear and set $scope.p.pid = id for subsequent children<br>
            // $scope.p is a different object for each level 
            scope.p = {};
            scope.p.pid = id;
            // add actor to scene
            realize(id, pid, transform);
    
            // cleanup
            elem.on("$destroy", function() {
              console.log(`particle system ${id} removing animation function`);
              delete scene['animations'][id];
            });
    
          },//pre-link runs root-to-leaf
          //post-link runs leaf-to-root
          postlink =  (scope, elem, attrs) => {
          };//post-link
      
      // compile returns link={pre,post}
      return {
        pre: prelink,
        post: postlink
      };
    }//compile
  };//return DDO
});

