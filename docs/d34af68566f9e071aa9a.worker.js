!function(e){function t(i){if(n[i])return n[i].exports;var r=n[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:i})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=10)}([function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),u=i(r),o=n(4),a=i(o),c=function(){return Math.random()<.5},s=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,t=Math.random()*e;return c()?t:-t},f=function(){function e(t,n){(0,u.default)(this,e),this.values=new Float32Array(t),void 0!==n&&this.values.fill(n)}return(0,a.default)(e,null,[{key:"merge",value:function(t,n,i){var r="number"==typeof n,u=new e(t.values.length);return u.values=t.values.map(function(e,t){var u=r?n:n.values[t];return i(e,u)}),u}},{key:"add",value:function(t,n){return e.merge(t,n,function(e,t){return e+t})}},{key:"subtract",value:function(t,n){return e.merge(t,n,function(e,t){return e-t})}},{key:"multiply",value:function(t,n){return e.merge(t,n,function(e,t){return e*t})}},{key:"divide",value:function(t,n){return e.merge(t,n,function(e,t){return e/t})}},{key:"getDistance",value:function(t,n){return Math.sqrt(e.getDistanceSq(t,n))}},{key:"getDistanceSq",value:function(t,n){return e.subtract(t,n).getMagnitudeSq()}},{key:"getAverage",value:function(t){var n=t.length;if(0===n)throw new Error("Cannot average zero vectors");var i=t[0].values.length,r=new e(i);return t.forEach(function(e){e.values.forEach(function(e,t){r.values[t]=r.values[t]+e/n})}),r}}]),(0,a.default)(e,[{key:"toArray",value:function(){return new Float32Array(this.values)}},{key:"value",value:function(e){return this.values[e]}},{key:"randomize",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;return this.mutate(function(){return s(e)})}},{key:"mutate",value:function(e){return this.values=this.values.map(e),this.cacheMagnitude(void 0),this}},{key:"getMagnitude",value:function(){return void 0===this.magnitude&&(this.magnitude=Math.sqrt(this.getMagnitudeSq())),this.magnitude}},{key:"getMagnitudeSq",value:function(){return void 0===this.magnitudeSq&&(this.magnitudeSq=this.values.reduce(function(e,t){return e+t*t},0)),this.magnitudeSq}},{key:"setMagnitude",value:function(e){return this.multiply(e/this.getMagnitude()),this.cacheMagnitude(e),this}},{key:"limit",value:function(e){var t=e*e,n=this.getMagnitudeSq();return n>t&&(this.multiply(t/n),this.cacheMagnitude(t)),this}},{key:"add",value:function(t){return this.values=e.add(this,t).values,this.cacheMagnitude(void 0),this}},{key:"subtract",value:function(t){return this.values=e.subtract(this,t).values,this.cacheMagnitude(void 0),this}},{key:"multiply",value:function(t){return this.values=e.multiply(this,t).values,this.cacheMagnitude(void 0),this}},{key:"divide",value:function(t){return this.values=e.divide(this,t).values,this.cacheMagnitude(void 0),this}},{key:"cacheMagnitude",value:function(e){this.magnitude=e,this.magnitudeSq=e&&e*e}}]),e}();t.default=f},function(e,t,n){"use strict";t.__esModule=!0,t.default=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},function(e,t,n){e.exports=!n(9)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.FIELD_SIZE=100},function(e,t,n){"use strict";t.__esModule=!0;var i=n(15),r=function(e){return e&&e.__esModule?e:{default:e}}(i);t.default=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),(0,r.default)(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}()},function(e,t){e.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},function(e,t){var n=e.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},function(e,t){var n=e.exports={version:"2.5.1"};"number"==typeof __e&&(__e=n)},function(e,t,n){var i=n(22),r=n(23),u=n(25),o=Object.defineProperty;t.f=n(2)?Object.defineProperty:function(e,t,n){if(i(e),t=u(t,!0),i(n),r)try{return o(e,t,n)}catch(e){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(e[t]=n.value),e}},function(e,t){e.exports=function(e){try{return!!e()}catch(e){return!0}}},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r=n(11),u=n(27),o=n(32),a=n(33),c=i(a),s=n(34),f=i(s),l=self,d={request:void 0,system:new f.default};l.addEventListener("message",function(e){if(e&&e.data&&e.data.type)switch(e.data.type){case"request":d.request=e.data.request,d.system.setPopulation(d.request.particles,d.request.dimensions),h();break;case"request.tick":h();break;case"destroy":l.close()}});var v=function(){d.request&&l.postMessage({type:"update",response:{dimensions:d.request.dimensions,layers:d.request.layers,particles:d.system.particles.map(function(e){return new c.default(e)}),neighborhood:(0,o.getNeighborhood)(d.system.particles,d.request.neighborhood)}})},h=function(){if(d.request){d.system.particles.forEach(function(e){return e.acceleration.multiply(0)});var e=d.request.behavior;(0,r.behaviors[e.name])(d.system,e.config),u.boundingNames.forEach(function(e){if(d.request){var t=u.boundings[e];d.request.boundings[e]&&t(d.system)}}),d.system.particles.forEach(function(e){d.request&&(e.velocity.add(e.acceleration),e.velocity.limit(d.request.max.speed),e.position.add(e.velocity))}),d.system.recalculate(),v()}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.behaviors=void 0;var i=n(12),r=n(13),u=n(14);t.behaviors={wandering:u.wandering,diffusion:i.diffusion,diffusionX:r.diffusionX}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.diffusion=function(e,t){if(!(e.particles.length<2)){var n=e.particles.length;e.particles.forEach(function(e){var i=e.neighbors[0],r=i.delta,u=i.distance,o=t.charge*t.charge/(u*u);r.setMagnitude(o/(n*n)),e.acceleration.add(r)})}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.diffusionX=function(e,t){e.particles.length<2||e.particles.forEach(function(e){var n=e.neighbors[0].delta;n.multiply(t.charge),e.acceleration.add(n)})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.wandering=void 0;var i=n(0),r=function(e){return e&&e.__esModule?e:{default:e}}(i);t.wandering=function(e,t){e.particles.forEach(function(e){var n=new r.default(e.dimensions);n.randomize(t.jitter),e.acceleration.add(n)})}},function(e,t,n){e.exports={default:n(16),__esModule:!0}},function(e,t,n){n(17);var i=n(7).Object;e.exports=function(e,t,n){return i.defineProperty(e,t,n)}},function(e,t,n){var i=n(18);i(i.S+i.F*!n(2),"Object",{defineProperty:n(8).f})},function(e,t,n){var i=n(6),r=n(7),u=n(19),o=n(21),a=function(e,t,n){var c,s,f,l=e&a.F,d=e&a.G,v=e&a.S,h=e&a.P,p=e&a.B,y=e&a.W,g=d?r:r[t]||(r[t]={}),m=g.prototype,b=d?i:v?i[t]:(i[t]||{}).prototype;d&&(n=t);for(c in n)(s=!l&&b&&void 0!==b[c])&&c in g||(f=s?b[c]:n[c],g[c]=d&&"function"!=typeof b[c]?n[c]:p&&s?u(f,i):y&&b[c]==f?function(e){var t=function(t,n,i){if(this instanceof e){switch(arguments.length){case 0:return new e;case 1:return new e(t);case 2:return new e(t,n)}return new e(t,n,i)}return e.apply(this,arguments)};return t.prototype=e.prototype,t}(f):h&&"function"==typeof f?u(Function.call,f):f,h&&((g.virtual||(g.virtual={}))[c]=f,e&a.R&&m&&!m[c]&&o(m,c,f)))};a.F=1,a.G=2,a.S=4,a.P=8,a.B=16,a.W=32,a.U=64,a.R=128,e.exports=a},function(e,t,n){var i=n(20);e.exports=function(e,t,n){if(i(e),void 0===t)return e;switch(n){case 1:return function(n){return e.call(t,n)};case 2:return function(n,i){return e.call(t,n,i)};case 3:return function(n,i,r){return e.call(t,n,i,r)}}return function(){return e.apply(t,arguments)}}},function(e,t){e.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},function(e,t,n){var i=n(8),r=n(26);e.exports=n(2)?function(e,t,n){return i.f(e,t,r(1,n))}:function(e,t,n){return e[t]=n,e}},function(e,t,n){var i=n(5);e.exports=function(e){if(!i(e))throw TypeError(e+" is not an object!");return e}},function(e,t,n){e.exports=!n(2)&&!n(9)(function(){return 7!=Object.defineProperty(n(24)("div"),"a",{get:function(){return 7}}).a})},function(e,t,n){var i=n(5),r=n(6).document,u=i(r)&&i(r.createElement);e.exports=function(e){return u?r.createElement(e):{}}},function(e,t,n){var i=n(5);e.exports=function(e,t){if(!i(e))return e;var n,r;if(t&&"function"==typeof(n=e.toString)&&!i(r=n.call(e)))return r;if("function"==typeof(n=e.valueOf)&&!i(r=n.call(e)))return r;if(!t&&"function"==typeof(n=e.toString)&&!i(r=n.call(e)))return r;throw TypeError("Can't convert object to primitive value")}},function(e,t){e.exports=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.boundingNames=t.boundings=void 0;var i=n(28),r=n(29),u=n(30),o=n(31),a=t.boundings={centering:r.centering,scaling:u.scaling,binding:i.binding,wrapping:o.wrapping};t.boundingNames=Object.keys(a)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.binding=void 0;var i=n(3),r=i.FIELD_SIZE/2;t.binding=function(e){e.particles.forEach(function(e){return e.position.setMagnitude(r)})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.centering=function(e){e.particles.forEach(function(t){return t.position.subtract(e.centroid)})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.scaling=void 0;var i=n(3),r=n(0),u=function(e){return e&&e.__esModule?e:{default:e}}(r),o=i.FIELD_SIZE/2,a=o*o;t.scaling=function(e){if(!(e.particles.length<2)){var t=e.particles.map(function(e){return e.position}),n=t.reduce(function(t,n){var i=u.default.getDistanceSq(n,e.centroid);return Math.max(t,i)},-1);if(!(n<=a)){var i=a/n;e.particles.forEach(function(e){return e.position.multiply(i)})}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.wrapping=void 0;var i=n(3),r=i.FIELD_SIZE/2,u=function(e){return e<-r?r:e>r?-r:e};t.wrapping=function(e){e.particles.forEach(function(e){return e.position.mutate(u)})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.getNeighborhood=function(e,t){switch(t.name){case"all":return e.map(function(e){return e.neighbors.map(function(e){return{index:e.index,distance:e.distance}})});case"locals":return e.map(function(e){return e.neighbors.slice(0,e.dimensions).map(function(e){return{index:e.index,distance:e.distance}})});case"nearest":return e.map(function(e){return e.neighbors.slice(0,1).map(function(e){return{index:e.index,distance:e.distance}})});case"proximity":throw new Error("TODO: proximity neighborhood")}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n(1),r=function(e){return e&&e.__esModule?e:{default:e}}(i),u=function e(t){var n=t.dimensions,i=t.position,u=t.velocity,o=t.acceleration;(0,r.default)(this,e),this.dimensions=n,this.position=i.toArray(),this.velocity=u.toArray(),this.acceleration=o.toArray()};t.default=u},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),u=i(r),o=n(4),a=i(o),c=n(3),s=n(35),f=i(s),l=n(0),d=i(l),v=function(){function e(){(0,u.default)(this,e),this.particles=[],this.centroid=new d.default(0),this.furthest=0}return(0,a.default)(e,[{key:"setPopulation",value:function(e,t){var n=this.particles,i=new Array(e).fill(null).map(function(e,i){var r=new f.default(t).randomize(c.FIELD_SIZE/2);return n[i]&&r.backfill(n[i]),r});this.particles=i,this.recalculate()}},{key:"recalculate",value:function(){var e=this;this.centroid=d.default.getAverage(this.particles.map(function(e){return e.position})),this.furthest=-1,this.particles.forEach(function(t){t.neighbors=[],e.particles.forEach(function(n,i){if(t!==n){var r=d.default.subtract(t.position,n.position),u=r.getMagnitude();e.furthest=Math.max(e.furthest,u),t.neighbors.push({index:i,delta:r,distance:u})}}),t.neighbors.sort(function(e,t){return e.distance-t.distance})})}}]),e}();t.default=v},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),u=i(r),o=n(4),a=i(o),c=n(0),s=i(c),f=function(){function e(t){(0,u.default)(this,e),this.dimensions=t,this.position=new s.default(t),this.velocity=new s.default(t),this.acceleration=new s.default(t),this.neighbors=[]}return(0,a.default)(e,[{key:"randomize",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;return this.position.randomize(e),this.velocity.randomize(e),this.acceleration.randomize(e),this}},{key:"backfill",value:function(e){return this.position.mutate(function(t,n){return e.position.value(n)||t}),this.velocity.mutate(function(t,n){return e.velocity.value(n)||t}),this.acceleration.mutate(function(t,n){return e.acceleration.value(n)||t}),this}}]),e}();t.default=f}]);
//# sourceMappingURL=d34af68566f9e071aa9a.worker.js.map