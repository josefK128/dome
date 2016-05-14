"use strict";
angular.module('app').directive("i3dParticlesystem", ["Camera3d", "Transform3d", "Log", "colourToHex", function(Camera3d, Transform3d, Log, colourToHex) {
  "use strict";
  return {
    restrict: 'E',
    scope: 'true',
    replace: 'false',
    templateNamespace: 'svg',
    compile: function(elem, attrs) {
      var scene = Camera3d.scene(),
          particleSystem,
          maxParticles = 10000,
          textureUrl = 'images/p2.jpg',
          transform = {t: [0.0, -50.0, 0.0]},
          transl = transform['t'],
          options,
          position = new THREE.Vector3(transl[0], transl[1], transl[2]),
          positionRandomness = 0.3,
          velocity = new THREE.Vector3(1.0, 1.0, 1.0),
          velocityRandomness = 0.5,
          size = 5,
          sizeRandomness = 1,
          color = '0xaa88ff',
          colorRandomness = 0.2,
          turbulence = 0.5,
          lifetime = 2,
          spawnerOptions,
          spawnRate = 100,
          horizontalSpeed = 1.5,
          verticalSpeed = 1.33,
          timeScale = 1,
          tick = 0,
          clock = new THREE.Clock(true),
          r = 0.0,
          s = 0.0,
          y = 0.0,
          TWOPI = 6.28,
          gui = new DAT.GUI({height: 9 * 32 - 1}),
          realize = function(id, pid, transform) {
            Camera3d.addActorToScene(id, particleSystem, pid);
            console.log(("added to scene particlesystem with texture " + textureUrl));
            console.log(("particlesystem has id = " + id));
            Transform3d.apply(transform, particleSystem);
          },
          prelink = function(scope, elem, attrs) {
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
            if (form) {
              o = form['options'];
              spo = form['spawnerOptions'];
            }
            if (tr) {
              transform = tr || transform;
              t = tr.t;
              console.log(("setting position t = " + t));
              position = new THREE.Vector3(t[0], t[1], t[2]);
            }
            if (form) {
              console.log('setting maxParticles and textureUrl');
              console.log(("form.maxParticles = " + form.maxParticles));
              console.log(("form.textureUrl = " + form.textureUrl));
              maxParticles = form.maxParticles || maxParticles;
              textureUrl = form.textureUrl || textureUrl;
              if (o) {
                console.log('setting options');
                for (q in o) {
                  if (o.hasOwnProperty(q)) {
                    console.log(("options has pr " + q + " val " + o[q]));
                  }
                }
                positionRandomness = o.positionRandomness || positionRandomness;
                if (o.velocity) {
                  v = o.velocity;
                  velocity = new THREE.Vector3(v[0], v[1], v[2]) || velocity;
                }
                velocityRandomness = o.velocityRandomness || velocityRandomness;
                size = o.size || size;
                sizeRandomness = o.sizeRandomness || velocityRandomness;
                color = o.color || color;
                colorRandomness = o.colorRandomness || colorRandomness;
                turbulence = o.turbulence || turbulence;
                lifetime = o.lifetime || lifetime;
              }
              if (spo) {
                console.log('setting spawnerOptions');
                for (q in spo) {
                  if (spo.hasOwnProperty(q)) {
                    console.log(("spawnerOptions has pr " + q + " val " + spo[q]));
                  }
                }
                spawnRate = spo.spawnRate || spawnRate;
                horizontalSpeed = spo.horizontalSpeed || horizontalSpeed;
                verticalSpeed = spo.verticalSpeed || verticalSpeed;
                timeScale = spo.timeScale || timeScale;
              }
            }
            if (!/^(#|0x)/.test(color)) {
              console.log(("convert to hex color = " + color));
              color = colourToHex(color);
            }
            particleSystem = new THREE.GPUParticleSystem({
              maxParticles: maxParticles,
              texture: textureUrl
            });
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
            gui.add(options, "velocityRandomness", 0, 3);
            gui.add(options, "positionRandomness", 0, 3);
            gui.add(options, "size", 1, 20);
            gui.add(options, "sizeRandomness", 0, 25);
            gui.add(options, "colorRandomness", 0, 1);
            gui.add(options, "lifetime", 0.1, 10);
            gui.add(options, "turbulence", 0, 1);
            gui.add(spawnerOptions, "spawnRate", 10, 10000);
            gui.add(spawnerOptions, "timeScale", -1, 1);
            if (!scene['animations']) {
              scene['animations'] = {};
            }
            scene['animations'][id] = function() {
              var delta = clock.getDelta() * spawnerOptions.timeScale;
              tick += delta;
              if (tick < 0) {
                tick = 0;
              }
              if (delta > 0) {
                if (y > 50.0) {
                  y = -50 + Math.random();
                  r = 2.0 + Math.random();
                  s = Math.random();
                } else {
                  r += 2.0 * Math.random();
                  s += 0.1 * Math.random();
                  y += 4.0 * spawnerOptions.verticalSpeed * Math.max(r, s);
                }
                options.position.x = r * Math.sin(s * TWOPI);
                options.position.y = y;
                options.position.x = r * Math.cos(s * TWOPI);
                for (var x = 0; x < spawnerOptions.spawnRate * delta; x++) {
                  particleSystem.spawnParticle(options);
                }
              }
              particleSystem.update(tick);
            };
            console.log("added particlesystem update f to scene['animations']");
            scope.p = {};
            scope.p.pid = id;
            realize(id, pid, transform);
            elem.on("$destroy", function() {
              console.log(("particle system " + id + " removing animation function"));
              delete scene['animations'][id];
            });
          },
          postlink = function(scope, elem, attrs) {};
      return {
        pre: prelink,
        post: postlink
      };
    }
  };
}]);

//# sourceMappingURL=i3d-particlesystem-directive.js.map
