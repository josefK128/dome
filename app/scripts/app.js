"use strict";
angular.module("app", ['ui.router', 'ui.grid']).config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function($stateProvider, $urlRouterProvider, $locationProvider) {
  'use strict';
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false,
    rewriteLinks: false
  });
  $urlRouterProvider.otherwise('/');
  var metastate = {
    url: '^/{scene}/{i3d}/{i2d}/{base}/{ui}/{shot}',
    onEnter: function() {
      var delta_params = metastate.stateObj.delta_params,
          scope,
          name,
          tuple,
          template,
          model,
          template_view,
          shot,
          Camera3d,
          narrative,
          node;
      narrative = metastate.narrative || metastate.Mediator.component('narrative');
      scope = scope || narrative.scope();
      Camera3d = Camera3d || metastate.Camera3d;
      var $__12 = true;
      var $__13 = false;
      var $__14 = undefined;
      try {
        for (var $__10 = void 0,
            $__9 = (Object.keys(delta_params))[Symbol.iterator](); !($__12 = ($__10 = $__9.next()).done); $__12 = true) {
          var p = $__10.value;
          {
            if (delta_params[p].length > 0) {
              name = delta_params[p];
              tuple = name.split(":");
              template = tuple[0] || "";
              model = tuple[1] || "";
              switch (p) {
                case 'scene':
                  break;
                case 'i3d':
                  template_view = metastate.cache.get((template + ".svg"));
                  scope.i3d = metastate.Models.get('i3d', template, model) || {};
                  Camera3d.changeTemplateScene(template);
                  $("#i3d").html(template_view);
                  metastate.compile($("#i3d").contents())(scope);
                  break;
                case 'i2d':
                  template_view = metastate.cache.get((template + ".svg"));
                  scope.i2d = metastate.Models.get('i2d', template, model) || {};
                  $("#i2d").html(template_view);
                  metastate.compile($("#i2d").contents())(scope);
                  break;
                case 'base':
                  template_view = metastate.cache.get((template + ".html"));
                  scope.base = metastate.Models.get('base', template, model) || {};
                  scope.shot = scope.shot || {};
                  $("#base").html(template_view);
                  metastate.compile($("#base").contents())(scope);
                  break;
                case 'ui':
                  template_view = metastate.cache.get((template + ".html"));
                  scope.ui = metastate.Models.get('ui', template, model) || {};
                  scope.shot = scope.shot || {};
                  $("#ui").html(template_view);
                  metastate.compile($("#ui").contents())(scope);
                  break;
                case 'shot':
                  template_view = metastate.cache.get((template + ".svg"));
                  if (!/^scope/.test(model)) {
                    scope.shot = metastate.Models.get('shot', template, model) || {};
                  } else {
                    scope.shot = scope.shot || {};
                  }
                  var delta = scope.shot.delta || {};
                  var branches = delta.branches || {};
                  var $__5 = true;
                  var $__6 = false;
                  var $__7 = undefined;
                  try {
                    for (var $__3 = void 0,
                        $__2 = (Object.keys(branches))[Symbol.iterator](); !($__5 = ($__3 = $__2.next()).done); $__5 = true) {
                      var p$__23 = $__3.value;
                      {
                        node = $(("#" + p$__23));
                        node.append(template_view);
                        metastate.compile(node.contents())(scope);
                      }
                    }
                  } catch ($__8) {
                    $__6 = true;
                    $__7 = $__8;
                  } finally {
                    try {
                      if (!$__5 && $__2.return != null) {
                        $__2.return();
                      }
                    } finally {
                      if ($__6) {
                        throw $__7;
                      }
                    }
                  }
                  break;
                default:
              }
            }
          }
        }
      } catch ($__15) {
        $__13 = true;
        $__14 = $__15;
      } finally {
        try {
          if (!$__12 && $__9.return != null) {
            $__9.return();
          }
        } finally {
          if ($__13) {
            throw $__14;
          }
        }
      }
    }
  };
  $stateProvider.state('delta', metastate);
}]).run(["$state", "$templateCache", "$location", "$compile", "$timeout", "$rootScope", "Models", "Camera3d", "Mediator", "Log", "Mockserver", "Mixin", "Transform3d", "config", function($state, $templateCache, $location, $compile, $timeout, $rootScope, Models, Camera3d, Mediator, Log, Mockserver, Mixin, Transform3d, config) {
  'use strict';
  var observer;
  var metastate = $state.get('delta');
  metastate.cache = $templateCache;
  metastate.location = $location;
  metastate.compile = $compile;
  metastate.timeout = $timeout;
  metastate.Models = Models;
  metastate.Camera3d = Camera3d;
  metastate.Mediator = Mediator;
  metastate.Log = Log;
  metastate.config = config;
  observer = new MutationSummary({
    queries: [{attribute: 'transform'}, {attribute: 'form'}],
    rootNode: document.getElementById('i3d'),
    callback: function(summaries) {
      var dtransform = summaries[0],
          dform = summaries[1],
          actor,
          delta = [],
          m = new THREE.Matrix4(),
          mr,
          mt,
          ms,
          k;
      var $__12 = true;
      var $__13 = false;
      var $__14 = undefined;
      try {
        for (var $__10 = void 0,
            $__9 = (dtransform.valueChanged)[Symbol.iterator](); !($__12 = ($__10 = $__9.next()).done); $__12 = true) {
          var node = $__10.value;
          {
            var transform = JSON.parse(node.getAttribute('transform'));
            var transformp = JSON.parse(dtransform.getOldAttribute(node, 'transform'));
            actor = Camera3d.actor(node.id);
            var $__5 = true;
            var $__6 = false;
            var $__7 = undefined;
            try {
              for (var $__3 = void 0,
                  $__2 = (Object.keys(transform))[Symbol.iterator](); !($__5 = ($__3 = $__2.next()).done); $__5 = true) {
                var p = $__3.value;
                {
                  if (!angular.equals(transform[p], transformp[p])) {
                    delta.push({
                      property: p,
                      previous: transformp[p],
                      current: transform[p]
                    });
                  }
                }
              }
            } catch ($__8) {
              $__6 = true;
              $__7 = $__8;
            } finally {
              try {
                if (!$__5 && $__2.return != null) {
                  $__2.return();
                }
              } finally {
                if ($__6) {
                  throw $__7;
                }
              }
            }
            for (k = 0; k < delta.length; k++) {
              var p$__24 = delta[k]['property'];
              if (p$__24 === 't') {
                var ta = delta[k]['current'];
                for (var i = 0; i < ta.length; i++) {}
                mt = (new THREE.Matrix4()).makeTranslation(ta[0], ta[1], ta[2]);
              }
              if (p$__24 === 'q') {
                var qa = delta[k]['current'];
                for (var i$__25 = 0; i$__25 < qa.length; i$__25++) {}
                var q = new THREE.Quaternion(qa[0], qa[1], qa[2], qa[3]);
                mr = (new THREE.Matrix4()).makeRotationFromQuaternion(q);
              }
              if (p$__24 === 'e') {
                var ea = delta[k]['current'];
                for (var i$__26 = 0; i$__26 < ea.length; i$__26++) {}
                var euler = new THREE.Euler(ea[0], ea[1], ea[2]);
                var q$__27 = (new THREE.Quaternion()).setFromEuler(euler);
                mr = (new THREE.Matrix4()).makeRotationFromEuler(euler);
              }
              if (p$__24 === 's') {
                var sa = delta[k]['current'];
                for (var i$__28 = 0; i$__28 < sa.length; i$__28++) {}
                ms = (new THREE.Matrix4()).makeScale(sa[0], sa[1], sa[2]);
              }
            }
            m = mt || m;
            if (mr) {
              m = m.multiply(mr);
            }
            if (ms) {
              m = m.multiply(ms);
            }
            actor.applyMatrix(m);
          }
        }
      } catch ($__15) {
        $__13 = true;
        $__14 = $__15;
      } finally {
        try {
          if (!$__12 && $__9.return != null) {
            $__9.return();
          }
        } finally {
          if ($__13) {
            throw $__14;
          }
        }
      }
      var $__19 = true;
      var $__20 = false;
      var $__21 = undefined;
      try {
        for (var $__17 = void 0,
            $__16 = (dform.valueChanged)[Symbol.iterator](); !($__19 = ($__17 = $__16.next()).done); $__19 = true) {
          var node$__29 = $__17.value;
          {}
        }
      } catch ($__22) {
        $__20 = true;
        $__21 = $__22;
      } finally {
        try {
          if (!$__19 && $__16.return != null) {
            $__16.return();
          }
        } finally {
          if ($__20) {
            throw $__21;
          }
        }
      }
    }
  });
  if (config.server_connect) {
    Mediator.connect();
  }
  window.addEventListener("keyup", function(e) {
    switch (e.keyCode) {
      case 51:
        if (e.altKey) {
          if (config.unit_test) {
            console.log("starting unit tests...");
            config.unit_spec(Mediator, Mixin, Transform3d, Camera3d, config).then(function() {
              if (config.mockserver_connect) {
                console.log("starting Mockserver...");
                Mockserver.start();
                config.mockserver_connect = false;
              }
            }).catch(function(e) {
              console.log(("unit tests failed: " + e));
              console.log("skipping e2e test...");
            });
          } else {
            if (config.mockserver_connect) {
              console.log("starting Mockserver...");
              Mockserver.start();
              config.mockserver_connect = false;
            }
          }
        }
        break;
      default:
    }
  });
}]);

//# sourceMappingURL=app.js.map
