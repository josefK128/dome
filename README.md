## dome 
* declarative i3d and animation using state-based declarative composition
and cinematography
* Each scene change (i3d, i2d, html-css-video, ui, cinematography) represented
and executed as a url-component
* URL = sequence of six template:model tuples (scene, i3d, i2d, html-css-video,   ui, cinematography)
* generative metaform based interactive 3D and VR environment for production and performance
* declarative action based production score and interactive shot 'overdub'
* input assertion guards, live injected unit-test and performance tuned e2e-test



### installation and setup:
* git clone https://github.com/josefK128/dome.git
* (optional) npm install (for dev libs/server only - runtime libs in app/libs)
* (possibly) edit index.html - if clone is not to the server $DocumentRoot
then the path from the $DocumentRoot to index.html must be substituted for
the original base href shown below:

  ```<base href="/dome/app/"/>```

  The current base href works iff the repo is cloned directly into the http
  server $DocumentRoot. In other cases, if the clone is made instead into
  $DocumentRoot/tmp/webgl for example, then the base-href should be edited:

  ```<base href="/tmp/webgl/dome/app/"/>```

* alternatively superset application can be run from the i3Dmedia.org server:
http://i3Dmedia.org/meta-y/app/index.html



### documentation:
* for full source and example documentation refer to the Wiki
  * github.com/josefK128/metaforms-wiki

* generate docco source-code comments (gulp docco) 



### declarative programming model
The system is based on declarative coding. The following is a detailed view
of an inherently procedural particle system recast in declarative form using
an angular directive which is realized via an svg-webgl template 
(app/views/templates/i3d/lists/particlesystems.i3d.html) 
```xml
<!-- particlesystems.i3d -->
<script type="text/ng-template" id="particlesystems.i3d">
  <i3d:particlesystem ng-repeat="(id,node) in i3d.actors.particlesystems"
       id={{id}} 
       form={{node.form}}
       transform={{node.transform}}
       children={{node.children}}>
       <ng-include src="'children.i3d'">
  </i3d:particlesystem> 
</script>
```

and a model (app/scripts_es6/models/i3d/i3d-simple/simple_ps_sph_phong.js)
```javascript        
particlesystems: {
  ps_phong: {form: {type: "'particlesystem.i3d'",
                    maxParticles: 10000,
                    textureUrl: 'images/p2.jpg',
                    options: {
                      positionRandomness: 1.3,
                      velocity: [1.0, 1.0, 1.0],
                      velocityRandomness: 1.5,
                      size: 15,
                      sizeRandomness: 1.0,
                      color: '0xaa88ff',
                      colorRandomness: 0.2,
                      turbulence: 1.0,
                      lifetime: 2
                    },
                    spawnerOptions: {
                      spawnRate: 100,
                      horizontalSpeed: 1.5,
                      verticalSpeed: 3.33,
                      timeScale: 1
                    }
             },
          transform: {t: [0.0,-50.0,0.0]},
          children:{}
  }//ps_phong
}//particlesystems
```

* This approach allows the detailed characteristics of the particle system 
(16 adjustable parameters) to be specified declaratively. Declarative webGL 
is more comprehensible changeable and maintainable than procedural code which 
quickly grows out of control and is not readily understood. Further, 
declarative code is more simple to use for beginning programmers and
inexperienced framework users, or even non-programmer artists.



### ui and camera 
* The ui layer on the top left is, in this case, the same for all scenes. The top
display is overall fps. It can be toggled on/off with the 'hidefps' button below.
The rest of the ui can also be hidden using the 'ui' button' which toggles
on/off the non-fps ui. The 'scene' button toggles on/off the scene name bar
which changes color for internal monitoring of state (and can be ignored).
The scene buttons are used to change between scenes, but as mentioned above, 
the GPUParticleSystem GUI does not disappear on scene change since it is not
placed on a specific subview layer, so the recommended scene traversal after
the once-displayed opening is, 'head' followed by 'cubenado' - or else straight
to 'cubenado'.

* The controls section has buttons 'home' and 'center' which return the camera3d
to its initial position and zoom (home), and initial position only (cntr).
The camaera3d is briefly explained in the next section. Other controls are:
  * hide2Daxes - toggles off/on the 2d svg axes markers which extend to a huge
    area about 400 times larger than the area in the viewport. For simplicity
    no use is made of the i2d svg layer or camera2d
  * hide2d - toggles off/on all of the i2d layer (not used, as mentioned)
  * hidebase - toggles off/on the html/css/css3d/video layer (only used
    trivially in the 'head' scene to show a ui-grid (for no reason)
  * hidefps - (mentioned above)
  * hide3d - toggles off/on the i3d webgl layer

* The camera3d is initially located on the equatorial plane on the positive 
z-axis (RHS) on the surface of an origin-centered sphere which is shown as a 
blue wireframe. The wireframe can be hidden/shown by toggling the 'csph' button.
The camerasphere has an attached lights apparatus positioned and implemented
according to the model for the camerasphere-template (again, following a
declarative methodology for scene object specification and composition).
The lights in this case are a canonical 'key', 'fill', 'back' triple with
appropriate positions, intensities and colors (which are all specifiable in
the particular model chosen). The 'key' 'fill' and 'back' buttons toggle off/on
the respective light in the apparatus.

The camera also has key controls such as:
  * arrows for pan (L-R) and tilt (Up-Down)
  * alt-g for clockwise camera rotation around the y-axis
  * alt-h for ccw
  * alt-j for clockwise rotation around the x-axis
  * alt-k for ccw
  * alt-a for dolly-z in
  * alt-s for dolly-z out
  * more at wiki: https://github.com/josefK/metaweb-wiki/wiki (interactive
    cameras, as well as further docs about the media framework)
  * note that some key combinations may now conflict with browser functions
    and that I am working on an enhanced interactive controller via new means
    to correct and possibly replace the keyboard controls.



### additional links
* angular 2 work: https://github.com/josefK/meta-forms-mf2/mf2 (full-stack)
* www.i3Dmedia.org



###### note
* metaweb/meta-web/dome framework copyright mark rudolph 2015






