!function(e){function t(i){if(n[i])return n[i].exports;var r=n[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:i})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=10)}([function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),u=i(r),o=n(4),a=i(o),s=function(){return Math.random()<.5},c=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,t=Math.random()*e;return s()?t:-t},f=function(){function e(t,n){(0,u.default)(this,e),this.dimensions=t,this.values=new Float32Array(t),void 0!==n&&this.values.fill(n)}return(0,a.default)(e,null,[{key:"merge",value:function(t,n,i){var r="number"==typeof n,u=new e(t.dimensions);return u.values=t.values.map(function(e,t){var u=r?n:n.values[t];return i(e,u)}),u}},{key:"add",value:function(t,n){return e.merge(t,n,function(e,t){return e+t})}},{key:"subtract",value:function(t,n){return e.merge(t,n,function(e,t){return e-t})}},{key:"multiply",value:function(t,n){return e.merge(t,n,function(e,t){return e*t})}},{key:"divide",value:function(t,n){return e.merge(t,n,function(e,t){return e/t})}},{key:"getDistance",value:function(t,n){return Math.sqrt(e.getDistanceSq(t,n))}},{key:"getDistanceSq",value:function(t,n){return e.subtract(t,n).getMagnitudeSq()}},{key:"getAverage",value:function(t){var n=t.length;if(0===n)throw new Error("Cannot average zero vectors");var i=new e(t[0].dimensions);return t.forEach(function(e){e.values.forEach(function(e,t){i.values[t]=i.values[t]+e/n})}),i}}]),(0,a.default)(e,[{key:"toArray",value:function(){return new Float32Array(this.values)}},{key:"value",value:function(e){return this.values[e]}},{key:"randomize",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;return this.mutate(function(){return c(e)})}},{key:"mutate",value:function(e){return this.values=this.values.map(e),this.cacheMagnitude(void 0),this}},{key:"getMagnitude",value:function(){return void 0===this.magnitude&&(this.magnitude=Math.sqrt(this.getMagnitudeSq())),this.magnitude}},{key:"getMagnitudeSq",value:function(){return void 0===this.magnitudeSq&&(this.magnitudeSq=this.values.reduce(function(e,t){return e+t*t},0)),this.magnitudeSq}},{key:"setMagnitude",value:function(e){return this.getMagnitude()>0?this.multiply(e/this.getMagnitude()):this.add(Math.sqrt(e/this.values.length)),this.cacheMagnitude(e),this}},{key:"limit",value:function(e){var t=e*e,n=this.getMagnitudeSq();return n>t&&(this.multiply(t/n),this.cacheMagnitude(t)),this}},{key:"add",value:function(t){return this.values=e.add(this,t).values,this.cacheMagnitude(void 0),this}},{key:"subtract",value:function(t){return this.values=e.subtract(this,t).values,this.cacheMagnitude(void 0),this}},{key:"multiply",value:function(t){return this.values=e.multiply(this,t).values,this.cacheMagnitude(void 0),this}},{key:"divide",value:function(t){return this.values=e.divide(this,t).values,this.cacheMagnitude(void 0),this}},{key:"cacheMagnitude",value:function(e){this.magnitudeSq=void 0!==e?e*e:e,this.magnitude=e}}]),e}();t.default=f},function(e,t,n){"use strict";t.__esModule=!0,t.default=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},function(e,t,n){e.exports=!n(9)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=(t.MAX_RADIUS=50,t.MAX_PARTICLES=1e3);t.MAX_NEIGHBORS=i*i},function(e,t,n){"use strict";t.__esModule=!0;var i=n(15),r=function(e){return e&&e.__esModule?e:{default:e}}(i);t.default=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),(0,r.default)(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}()},function(e,t){e.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},function(e,t){var n=e.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},function(e,t){var n=e.exports={version:"2.5.1"};"number"==typeof __e&&(__e=n)},function(e,t,n){var i=n(22),r=n(23),u=n(25),o=Object.defineProperty;t.f=n(2)?Object.defineProperty:function(e,t,n){if(i(e),t=u(t,!0),i(n),r)try{return o(e,t,n)}catch(e){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(e[t]=n.value),e}},function(e,t){e.exports=function(e){try{return!!e()}catch(e){return!0}}},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r=n(11),u=n(27),o=n(32),a=n(33),s=i(a),c=n(34),f=i(c),l=self,d={request:void 0,system:new f.default};l.addEventListener("message",function(e){if(e&&e.data&&e.data.type)switch(e.data.type){case"request":d.request=e.data.request,d.system.setPopulation(d.request.particles,d.request.dimensions),v();break;case"request.tick":v();break;case"destroy":l.close()}});var h=function(){d.request&&l.postMessage({type:"update",response:{dimensions:d.request.dimensions,layers:d.request.layers,particles:d.system.particles.map(function(e){return new s.default(e)}),neighborhood:(0,o.getNeighborhood)(d.system.particles,d.request.neighborhood)}})},v=function(){if(d.request){d.system.particles.forEach(function(e){return e.acceleration.multiply(0)});var e=d.request.behavior;(0,r.behaviors[e.name])(d.system,e.config),d.system.particles.forEach(function(e){d.request&&(e.velocity.add(e.acceleration),e.velocity.limit(d.request.max.speed),e.position.add(e.velocity))}),u.boundingNames.forEach(function(e){if(d.request){var t=u.boundings[e];d.request.boundings[e]&&t(d.system)}}),d.system.recalculate(),h()}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.behaviors=void 0;var i=n(12),r=n(13),u=n(14);t.behaviors={wandering:u.wandering,diffusion:i.diffusion,diffusionX:r.diffusionX}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.diffusion=function(e,t){if(!(e.particles.length<2)){var n=e.particles.length,i=n*n,r=t.charge*t.charge;e.particles.forEach(function(e){var t=e.neighbors[0],n=t.delta,u=t.distance,o=u?u*u:1;n.setMagnitude(r/o/i),e.acceleration.add(n)})}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.diffusionX=function(e,t){e.particles.length<2||e.particles.forEach(function(e){var n=e.neighbors[0].delta;n.multiply(t.charge),e.acceleration.add(n)})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.wandering=void 0;var i=n(0),r=function(e){return e&&e.__esModule?e:{default:e}}(i);t.wandering=function(e,t){e.particles.forEach(function(e){var n=new r.default(e.dimensions);n.randomize(t.jitter),e.acceleration.add(n)})}},function(e,t,n){e.exports={default:n(16),__esModule:!0}},function(e,t,n){n(17);var i=n(7).Object;e.exports=function(e,t,n){return i.defineProperty(e,t,n)}},function(e,t,n){var i=n(18);i(i.S+i.F*!n(2),"Object",{defineProperty:n(8).f})},function(e,t,n){var i=n(6),r=n(7),u=n(19),o=n(21),a=function(e,t,n){var s,c,f,l=e&a.F,d=e&a.G,h=e&a.S,v=e&a.P,p=e&a.B,g=e&a.W,y=d?r:r[t]||(r[t]={}),m=y.prototype,M=d?i:h?i[t]:(i[t]||{}).prototype;d&&(n=t);for(s in n)(c=!l&&M&&void 0!==M[s])&&s in y||(f=c?M[s]:n[s],y[s]=d&&"function"!=typeof M[s]?n[s]:p&&c?u(f,i):g&&M[s]==f?function(e){var t=function(t,n,i){if(this instanceof e){switch(arguments.length){case 0:return new e;case 1:return new e(t);case 2:return new e(t,n)}return new e(t,n,i)}return e.apply(this,arguments)};return t.prototype=e.prototype,t}(f):v&&"function"==typeof f?u(Function.call,f):f,v&&((y.virtual||(y.virtual={}))[s]=f,e&a.R&&m&&!m[s]&&o(m,s,f)))};a.F=1,a.G=2,a.S=4,a.P=8,a.B=16,a.W=32,a.U=64,a.R=128,e.exports=a},function(e,t,n){var i=n(20);e.exports=function(e,t,n){if(i(e),void 0===t)return e;switch(n){case 1:return function(n){return e.call(t,n)};case 2:return function(n,i){return e.call(t,n,i)};case 3:return function(n,i,r){return e.call(t,n,i,r)}}return function(){return e.apply(t,arguments)}}},function(e,t){e.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},function(e,t,n){var i=n(8),r=n(26);e.exports=n(2)?function(e,t,n){return i.f(e,t,r(1,n))}:function(e,t,n){return e[t]=n,e}},function(e,t,n){var i=n(5);e.exports=function(e){if(!i(e))throw TypeError(e+" is not an object!");return e}},function(e,t,n){e.exports=!n(2)&&!n(9)(function(){return 7!=Object.defineProperty(n(24)("div"),"a",{get:function(){return 7}}).a})},function(e,t,n){var i=n(5),r=n(6).document,u=i(r)&&i(r.createElement);e.exports=function(e){return u?r.createElement(e):{}}},function(e,t,n){var i=n(5);e.exports=function(e,t){if(!i(e))return e;var n,r;if(t&&"function"==typeof(n=e.toString)&&!i(r=n.call(e)))return r;if("function"==typeof(n=e.valueOf)&&!i(r=n.call(e)))return r;if(!t&&"function"==typeof(n=e.toString)&&!i(r=n.call(e)))return r;throw TypeError("Can't convert object to primitive value")}},function(e,t){e.exports=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.boundingNames=t.boundings=void 0;var i=n(28),r=n(29),u=n(30),o=n(31),a=t.boundings={centering:r.centering,scaling:u.scaling,binding:i.binding,wrapping:o.wrapping};t.boundingNames=Object.keys(a)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.binding=void 0;var i=n(3);t.binding=function(e){e.particles.forEach(function(e){return e.position.setMagnitude(i.MAX_RADIUS)})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.centering=function(e){e.particles.forEach(function(t){return t.position.subtract(e.centroid)})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.scaling=void 0;var i=n(3),r=n(0),u=function(e){return e&&e.__esModule?e:{default:e}}(r),o=i.MAX_RADIUS*i.MAX_RADIUS;t.scaling=function(e){if(!(e.particles.length<2)){var t=e.particles.map(function(e){return e.position}),n=t.reduce(function(t,n){var i=u.default.getDistanceSq(n,e.centroid);return Math.max(t,i)},-1);if(!(n<=o)){var i=o/n;e.particles.forEach(function(e){return e.position.multiply(i)})}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.wrapping=void 0;var i=n(3),r=function(e){return e<-i.MAX_RADIUS?i.MAX_RADIUS:e>i.MAX_RADIUS?-i.MAX_RADIUS:e};t.wrapping=function(e){e.particles.forEach(function(e){return e.position.mutate(r)})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.getNeighborhood=function(e,t){switch(t.name){case"all":return e.map(function(e){return e.neighbors.map(function(e){return{index:e.index,distance:e.distance}})});case"locals":return e.map(function(e){return e.neighbors.slice(0,e.dimensions).map(function(e){return{index:e.index,distance:e.distance}})});case"nearest":return e.map(function(e){return e.neighbors.slice(0,1).map(function(e){return{index:e.index,distance:e.distance}})});case"proximity":throw new Error("TODO: proximity neighborhood")}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n(1),r=function(e){return e&&e.__esModule?e:{default:e}}(i),u=function e(t){var n=t.dimensions,i=t.position,u=t.velocity,o=t.acceleration;(0,r.default)(this,e),this.dimensions=n,this.position=i.toArray(),this.velocity=u.toArray(),this.acceleration=o.toArray()};t.default=u},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),u=i(r),o=n(4),a=i(o),s=n(3),c=n(35),f=i(c),l=n(0),d=i(l),h=function(){function e(){(0,u.default)(this,e),this.particles=[],this.centroid=new d.default(0),this.furthest=0}return(0,a.default)(e,[{key:"setPopulation",value:function(e,t){var n=this.particles,i=new Array(e).fill(null).map(function(e,i){var r=new f.default(t).randomize(s.MAX_RADIUS);return n[i]&&r.backfill(n[i]),r});this.particles=i,this.recalculate()}},{key:"recalculate",value:function(){var e=this;this.centroid=d.default.getAverage(this.particles.map(function(e){return e.position})),this.furthest=-1,this.particles.forEach(function(t){t.neighbors=[],e.particles.forEach(function(n,i){if(t!==n){var r=d.default.subtract(t.position,n.position),u=r.getMagnitude();e.furthest=Math.max(e.furthest,u),t.neighbors.push({index:i,delta:r,distance:u})}}),t.neighbors.sort(function(e,t){return e.distance-t.distance})})}}]),e}();t.default=h},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),u=i(r),o=n(4),a=i(o),s=n(0),c=i(s),f=function(){function e(t){(0,u.default)(this,e),this.dimensions=t,this.position=new c.default(t),this.velocity=new c.default(t),this.acceleration=new c.default(t),this.neighbors=[]}return(0,a.default)(e,[{key:"randomize",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;return l(this.position,e),this.velocity.randomize(e),this.acceleration.randomize(e),this}},{key:"backfill",value:function(e){return this.position.mutate(function(t,n){return e.position.value(n)||t}),this.velocity.mutate(function(t,n){return e.velocity.value(n)||t}),this.acceleration.mutate(function(t,n){return e.acceleration.value(n)||t}),this}}]),e}();t.default=f;var l=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;switch(e.dimensions){case 2:var n=Math.random()*t,i=2*Math.random()*Math.PI,r=n,u=r*Math.cos(i)+0*Math.sin(i),o=-r*Math.sin(i)+0*Math.cos(i),a=[u,o];e.mutate(function(e,t){return a[t]});break;case 3:var s=Math.random()*t,c=2*Math.random()*Math.PI,f=2*Math.random()*Math.PI,l=s*Math.sin(f)*Math.cos(c),d=s*Math.sin(f)*Math.sin(c),h=s*Math.cos(f),v=[l,d,h];e.mutate(function(e,t){return v[t]});break;default:e.randomize(t)}}}]);
//# sourceMappingURL=deceaf99383956cc6565.worker.js.map