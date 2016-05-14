"use strict";
var e2e_spec = [{
  'action': {
    "t": "narrative",
    "f": "change_scene",
    "a": "a"
  },
  'abs_url': "/a:/i3d-simple:simple_green/i2d-scene:disks0/base-skycube:test_cube/ui-msgbg:/LS",
  'delta_url': "/a:/i3d-simple:simple_green/i2d-scene:disks0/base-skycube:test_cube//LS",
  'shot': {}
}, {
  'action': {
    "t": "narrative",
    "f": "shot",
    "a": "shot-graft:{\"delta\":{\"timeline\":{\"p\":{\"repeat\":0},\"actors\":{\"i3d:cube0:scale\":[{\"dur\":10,\"p\":{\"x\":0.5,\"y\":0.5,\"z\":0.5}}]}},\"branches\":{\"cube0\":{\"children\":{\"cube0_2\":{\"form\":{\"type\":\"'cube.i3d'\",\"x\":0,\"y\":0,\"z\":0,\"textureurl\":\"./images/sky.jpg\",\"w\":5,\"h\":10,\"d\":10,\"color\":\"blue\",\"transparent\":true,\"opacity\":1},\"transform\":{\"t\":[-20,-10,0],\"s\":[0.01,0.01,0.01]},\"children\":{}},\"cube0_3\":{\"form\":{\"type\":\"'cube.i3d'\",\"x\":0,\"y\":-20,\"z\":0,\"textureurl\":\"sky_jpg\",\"w\":5,\"h\":10,\"d\":10,\"color\":\"blue\",\"transparent\":true,\"opacity\":1},\"transform\":{\"t\":[20,0,0],\"s\":[0.01,0.01,0.01]},\"children\":{}}}}}}}"
  },
  'abs_url': "/a:/i3d-simple:simple_green/i2d-scene:disks0/base-skycube:test_cube/ui-msgbg:/shot-graft:scope1",
  'delta_url': "//////shot-graft:scope1",
  'shot': {"delta": {
      "timeline": {
        "p": {"repeat": 0},
        "actors": {"i3d:cube0:scale": [{
            "dur": 10,
            "p": {
              "x": 0.5,
              "y": 0.5,
              "z": 0.5
            }
          }]}
      },
      "branches": {"cube0": {"children": {
            "cube0_2": {
              "form": {
                "type": "'cube.i3d'",
                "x": 0,
                "y": 0,
                "z": 0,
                "textureurl": "./images/sky.jpg",
                "w": 5,
                "h": 10,
                "d": 10,
                "color": "blue",
                "transparent": true,
                "opacity": 1
              },
              "transform": {
                "t": [-20, -10, 0],
                "s": [0.01, 0.01, 0.01]
              },
              "children": {}
            },
            "cube0_3": {
              "form": {
                "type": "'cube.i3d'",
                "x": 0,
                "y": -20,
                "z": 0,
                "textureurl": "sky_jpg",
                "w": 5,
                "h": 10,
                "d": 10,
                "color": "blue",
                "transparent": true,
                "opacity": 1
              },
              "transform": {
                "t": [20, 0, 0],
                "s": [0.01, 0.01, 0.01]
              },
              "children": {}
            }
          }}}
    }}
}, {
  'action': {
    "t": "narrative",
    "f": "shot",
    "a": "shot-graft:{\"delta\":{\"timeline\":{\"p\":{\"repeat\":0},\"actors\":{\"i3d:cube0_2:scale\":[{\"dur\":10,\"p\":{\"x\":1,\"y\":1,\"z\":1}}],\"i3d:cube0_3:scale\":[{\"dur\":10,\"p\":{\"x\":1,\"y\":1,\"z\":1}}]}},\"branches\":{\"cube0_2\":{\"children\":{\"s0_2_0\":{\"form\":{\"type\":\"'sphere.i3d'\",\"r\":5,\"color\":\"blue\",\"transparent\":true,\"opacity\":0.8},\"transform\":{\"e\":[0,-0.785,0],\"t\":[-10,-10,0],\"s\":[0.01,0.01,0.01]},\"children\":{}},\"s0_2_1\":{\"form\":{\"type\":\"'sphere.i3d'\",\"r\":5,\"color\":\"blue\",\"transparent\":true,\"opacity\":0.8},\"transform\":{\"e\":[0,0.785,0],\"t\":[10,10,0],\"s\":[0.01,0.01,0.01]},\"children\":{}}}}}}}"
  },
  'abs_url': "/a:/i3d-simple:simple_green/i2d-scene:disks0/base-skycube:test_cube/ui-msgbg:/shot-graft:scope2",
  'delta_url': "//////shot-graft:scope2",
  'shot': {"delta": {
      "timeline": {
        "p": {"repeat": 0},
        "actors": {
          "i3d:cube0_2:scale": [{
            "dur": 10,
            "p": {
              "x": 1,
              "y": 1,
              "z": 1
            }
          }],
          "i3d:cube0_3:scale": [{
            "dur": 10,
            "p": {
              "x": 1,
              "y": 1,
              "z": 1
            }
          }]
        }
      },
      "branches": {"cube0_2": {"children": {
            "s0_2_0": {
              "form": {
                "type": "'sphere.i3d'",
                "r": 5,
                "color": "blue",
                "transparent": true,
                "opacity": 0.8
              },
              "transform": {
                "e": [0, -0.785, 0],
                "t": [-10, -10, 0],
                "s": [0.01, 0.01, 0.01]
              },
              "children": {}
            },
            "s0_2_1": {
              "form": {
                "type": "'sphere.i3d'",
                "r": 5,
                "color": "blue",
                "transparent": true,
                "opacity": 0.8
              },
              "transform": {
                "e": [0, 0.785, 0],
                "t": [10, 10, 0],
                "s": [0.01, 0.01, 0.01]
              },
              "children": {}
            }
          }}}
    }}
}, {
  'action': {
    "t": "narrative",
    "f": "shot",
    "a": "shot-graft:{\"delta\":{\"timeline\":{\"p\":{\"repeat\":0},\"actors\":{\"i3d:s0_2_0:scale\":[{\"dur\":10,\"p\":{\"x\":1,\"y\":1,\"z\":1}}],\"i3d:s0_2_1:scale\":[{\"dur\":10,\"p\":{\"x\":1,\"y\":1,\"z\":1}}]}},\"branches\":{}}}"
  },
  'abs_url': "/a:/i3d-simple:simple_green/i2d-scene:disks0/base-skycube:test_cube/ui-msgbg:/shot-graft:scope3",
  'delta_url': "//////shot-graft:scope3",
  'shot': {"delta": {
      "timeline": {
        "p": {"repeat": 0},
        "actors": {
          "i3d:s0_2_0:scale": [{
            "dur": 10,
            "p": {
              "x": 1,
              "y": 1,
              "z": 1
            }
          }],
          "i3d:s0_2_1:scale": [{
            "dur": 10,
            "p": {
              "x": 1,
              "y": 1,
              "z": 1
            }
          }]
        }
      },
      "branches": {}
    }}
}, {
  'action': {
    "t": "camera3d",
    "f": "panflyTo",
    "a": {
      "r": 0.7854,
      "d": 4
    }
  },
  'abs_url': "/a:/i3d-simple:simple_green/i2d-scene:disks0/base-skycube:test_cube/ui-msgbg:/shot-anim:scope4",
  'delta_url': "//////shot-anim:scope4",
  'shot': {"delta": {"timeline": {
        "p": {
          "paused": true,
          "repeat": 0
        },
        "actors": {"i3d:camera:rotation": [{
            "dur": 4,
            "p": {
              "y": 0.7854,
              "immediateRender": false
            }
          }]}
      }}}
}];

//# sourceMappingURL=e2e_spec_2015-09-18-02-16-48.js.map