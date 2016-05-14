// * e2e_specg.js
// * e2e_spec actions array generator
// * usage exp:
//   $ node e2e_specg ../logs/2015-09-18/16-00-04.log0 > 
//     ../spec_es6/e2e_spec_2015-09-18-16-00-04.js 
//
// * @dependencies: ../libs/traceur-runtime, node module fs<br>
//   @param none<br>
//
// * NOTE: The modifier for e2e_spec.js the GMT yr-m-d-hour-min-secs which
//   identifies the log0-file used to generate the e2e_spec.
//   (../logs/2015-09-18/16-00-04.log0 for exp.)


"use strict";
require('../libs/traceur-runtime');

var fs = require('fs');
var args = process.argv.slice(1);
if(!args[1]){
  process.exit();
}
var filename = args[1];

// prefab strings
var head =  
`// * e2e_spec.js
// * tests functions causing state change end-to-end using actions
//   and expected state-change results:
//   absolute-urls (all url-components present)
//   delta-urls (only changed url-components present)
//   timeline (non-trivial only in the case of Camera3d and Camera2d)
//
// * @dependencies: none<br>
//   @param none<br>
//
// * NOTE: The modifier for e2e_spec.js the GMT yr-m-d-hour-min-secs which
//   identifies the log0-file used to generate the e2e_spec.
//   (../logs/2015-09-18/16-00-04.log0 for exp.)
//
// * NOTE: This file was auto-generated by test/utils/e2e_specg.js


var e2e_spec =  [`;


fs.readFile(filename, function(err, data) {
    if(err){ throw err;}
    var a = data.toString().split(",\n"),
        cell = {},
        i=0,
        j=0;

    //console.log(`@@@ a.length = ${a.length}`);
    //console.log(`@@@ a[0] = ${a[0]}`);
    //console.log(`@@@ a[${a.length-1}] = ${a[a.length-1]}`);
    if(a[a.length-1].length === 0){
      //console.log("@@@ last element is empty - popping it from array");
      a.pop(); // remove last (empty) el
    }
    //console.log(`@@@ a.length = ${a.length}`);
    //console.log(`@@@ a[0] = ${a[0]}`);
    //console.log(`@@@ a[${a.length-1}] = ${a[a.length-1]}`);

    // generate the e2e_spec-array file
    console.log(head);
    for(let e of a) {
      //console.log(`@@@ TOP i=${i} j=${j}`);
      if(/^\{"t":/.test(e) || /^\{"id":/.test(e)){
        cell.action = e;
      }else{
        if(/\/\//.test(e)){
          cell.delta_url = e;
        }else{
          if(/^\{"delta/.test(e) || /{}/.test(e)){
            cell.shot = e;
          }else{
            cell.abs_url = e;
          }
        }
      }
      // write final tail (j===a.length) or 
      // write close of cell and reset cell for the next cycle
      if(i===3){
        if(j===a.length-1){              
          console.log(`{"action": ${cell.action},`);
          console.log(`"abs_url": ${cell.abs_url},`);
          console.log(`"delta_url": ${cell.delta_url},`);
          console.log(`"shot": ${cell.shot}}];`);
          //console.log(`@@@ fully complete: j=${j}`);
          process.exit();
        }else{
          console.log(`{"action": ${cell.action},`);
          console.log(`"abs_url": ${cell.abs_url},`);
          console.log(`"delta_url": ${cell.delta_url},`);
          console.log(`"shot": ${cell.shot}},`);
          //console.log(`@@@ cell complete: j=${j}`);
          cell = {};
        }
      }
      i = (i+1)%4;
      j = j+1;
    }//for
});
