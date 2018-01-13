!function(t){function e(i){if(n[i])return n[i].exports;var r=n[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,e),r.l=!0,r.exports}var n={};e.m=t,e.c=n,e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=10)}([function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var r=n(1),u=i(r),o=n(4),a=i(o),s=function(){function t(e,n){(0,u.default)(this,t),this.dimensions=e,this.values=new Float32Array(e),void 0!==n&&this.values.fill(n)}return(0,a.default)(t,null,[{key:"merge",value:function(e,n,i){var r="number"==typeof n,u=new t(e.dimensions);return u.values=e.values.map(function(t,e){var u=r?n:n.values[e];return i(t,u)}),u}},{key:"add",value:function(e,n){return t.merge(e,n,function(t,e){return t+e})}},{key:"subtract",value:function(e,n){return t.merge(e,n,function(t,e){return t-e})}},{key:"multiply",value:function(e,n){return t.merge(e,n,function(t,e){return t*e})}},{key:"divide",value:function(e,n){return t.merge(e,n,function(t,e){return t/e})}},{key:"getDistance",value:function(e,n){return Math.sqrt(t.getDistanceSq(e,n))}},{key:"getDistanceSq",value:function(e,n){return t.subtract(e,n).getMagnitudeSq()}},{key:"getAverage",value:function(e){var n=e.length;if(0===n)throw new Error("Cannot average zero vectors");var i=new t(e[0].dimensions);return e.forEach(function(t){t.values.forEach(function(t,e){i.values[e]=i.values[e]+t/n})}),i}}]),(0,a.default)(t,[{key:"toArray",value:function(){return new Float32Array(this.values)}},{key:"value",value:function(t){return this.values[t]}},{key:"randomize",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;return this.mutate(function(){return f(t)})}},{key:"radialRandomize",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,e=t*t,n=new Float32Array(this.dimensions).map(function(){var t=Math.random()*Math.sqrt(e);return e-=t*t,c()?t:-t});return l(n),this.values=n,this}},{key:"mutate",value:function(t){return this.values=this.values.map(t),this.cacheMagnitude(void 0),this}},{key:"getMagnitude",value:function(){return void 0===this.magnitude&&(this.magnitude=Math.sqrt(this.getMagnitudeSq())),this.magnitude}},{key:"getMagnitudeSq",value:function(){return void 0===this.magnitudeSq&&(this.magnitudeSq=this.values.reduce(function(t,e){return t+e*e},0)),this.magnitudeSq}},{key:"setMagnitude",value:function(t){return this.getMagnitude()>0?this.multiply(t/this.getMagnitude()):this.add(Math.sqrt(t/this.values.length)),this.cacheMagnitude(t),this}},{key:"limit",value:function(t){var e=t*t,n=this.getMagnitudeSq();return n>e&&(this.multiply(e/n),this.cacheMagnitude(e)),this}},{key:"add",value:function(e){return this.values=t.add(this,e).values,this.cacheMagnitude(void 0),this}},{key:"subtract",value:function(e){return this.values=t.subtract(this,e).values,this.cacheMagnitude(void 0),this}},{key:"multiply",value:function(e){return this.values=t.multiply(this,e).values,this.cacheMagnitude(void 0),this}},{key:"divide",value:function(e){return this.values=t.divide(this,e).values,this.cacheMagnitude(void 0),this}},{key:"cacheMagnitude",value:function(t){this.magnitudeSq=void 0!==t?t*t:t,this.magnitude=t}}]),t}();e.default=s;var c=function(){return Math.random()<.5},f=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,e=Math.random()*t;return c()?e:-e},l=function(t){for(var e=t.length-1;e>0;e--){var n=Math.floor(Math.random()*(e+1)),i=t[e];t[e]=t[n],t[n]=i}}},function(t,e,n){"use strict";e.__esModule=!0,e.default=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}},function(t,e,n){t.exports=!n(9)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=(e.MAX_RADIUS=50,e.MAX_PARTICLES=1e3);e.MAX_NEIGHBORS=i*i},function(t,e,n){"use strict";e.__esModule=!0;var i=n(16),r=function(t){return t&&t.__esModule?t:{default:t}}(i);e.default=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),(0,r.default)(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}()},function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,e){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},function(t,e){var n=t.exports={version:"2.5.1"};"number"==typeof __e&&(__e=n)},function(t,e,n){var i=n(23),r=n(24),u=n(26),o=Object.defineProperty;e.f=n(2)?Object.defineProperty:function(t,e,n){if(i(t),e=u(e,!0),i(n),r)try{return o(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(t[e]=n.value),t}},function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}var r=n(11),u=n(28),o=n(33),a=n(34),s=i(a),c=n(35),f=i(c),l=self,d={options:void 0,system:new f.default};l.addEventListener("message",function(t){if(t&&t.data&&t.data.type)switch(t.data.type){case"update":d.options=t.data.options,d.system.setPopulation(d.options.particles,d.options.dimensions),v();break;case"update.tick":v();break;case"destroy":l.close()}});var h=function(){d.options&&l.postMessage({type:"update",response:{dimensions:d.options.dimensions,particles:d.system.particles.map(function(t){return new s.default(t)}),neighborhood:(0,o.getNeighborhood)(d.system.particles,d.options.neighborhood)}})},v=function(){if(d.options){d.system.particles.forEach(function(t){return t.acceleration.multiply(0)});var t=d.options.behavior;(0,r.behaviors[t.name])(d.system,t.config),d.system.particles.forEach(function(t){d.options&&(t.velocity.add(t.acceleration),t.velocity.limit(d.options.max.speed),t.position.add(t.velocity))}),u.boundingNames.forEach(function(t){if(d.options){var e=u.boundings[t];d.options.boundings[t]&&e(d.system)}}),d.system.recalculate(),h()}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.behaviors=void 0;var i=n(12),r=n(13),u=n(14),o=n(15);e.behaviors={wandering:o.wandering,diffusion:i.diffusion,diffusionX:r.diffusionX,none:u.none}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.diffusion=function(t,e){if(!(t.particles.length<2)){var n=t.particles.length,i=n*n,r=e.charge*e.charge;t.particles.forEach(function(t){var e=t.neighbors[0],n=e.delta,u=e.distance,o=u?u*u:1;n.setMagnitude(r/o/i),t.acceleration.add(n)})}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.diffusionX=function(t,e){t.particles.length<2||t.particles.forEach(function(t){var n=t.neighbors[0].delta;n.multiply(e.charge),t.acceleration.add(n)})}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.none=function(t,e){t.particles.forEach(function(t){return t.velocity.multiply(0)})}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.wandering=void 0;var i=n(0),r=function(t){return t&&t.__esModule?t:{default:t}}(i);e.wandering=function(t,e){t.particles.forEach(function(t){var n=new r.default(t.dimensions);n.randomize(e.jitter),t.acceleration.add(n)})}},function(t,e,n){t.exports={default:n(17),__esModule:!0}},function(t,e,n){n(18);var i=n(7).Object;t.exports=function(t,e,n){return i.defineProperty(t,e,n)}},function(t,e,n){var i=n(19);i(i.S+i.F*!n(2),"Object",{defineProperty:n(8).f})},function(t,e,n){var i=n(6),r=n(7),u=n(20),o=n(22),a=function(t,e,n){var s,c,f,l=t&a.F,d=t&a.G,h=t&a.S,v=t&a.P,p=t&a.B,g=t&a.W,y=d?r:r[e]||(r[e]={}),m=y.prototype,b=d?i:h?i[e]:(i[e]||{}).prototype;d&&(n=e);for(s in n)(c=!l&&b&&void 0!==b[s])&&s in y||(f=c?b[s]:n[s],y[s]=d&&"function"!=typeof b[s]?n[s]:p&&c?u(f,i):g&&b[s]==f?function(t){var e=function(e,n,i){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(e);case 2:return new t(e,n)}return new t(e,n,i)}return t.apply(this,arguments)};return e.prototype=t.prototype,e}(f):v&&"function"==typeof f?u(Function.call,f):f,v&&((y.virtual||(y.virtual={}))[s]=f,t&a.R&&m&&!m[s]&&o(m,s,f)))};a.F=1,a.G=2,a.S=4,a.P=8,a.B=16,a.W=32,a.U=64,a.R=128,t.exports=a},function(t,e,n){var i=n(21);t.exports=function(t,e,n){if(i(t),void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,i){return t.call(e,n,i)};case 3:return function(n,i,r){return t.call(e,n,i,r)}}return function(){return t.apply(e,arguments)}}},function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,e,n){var i=n(8),r=n(27);t.exports=n(2)?function(t,e,n){return i.f(t,e,r(1,n))}:function(t,e,n){return t[e]=n,t}},function(t,e,n){var i=n(5);t.exports=function(t){if(!i(t))throw TypeError(t+" is not an object!");return t}},function(t,e,n){t.exports=!n(2)&&!n(9)(function(){return 7!=Object.defineProperty(n(25)("div"),"a",{get:function(){return 7}}).a})},function(t,e,n){var i=n(5),r=n(6).document,u=i(r)&&i(r.createElement);t.exports=function(t){return u?r.createElement(t):{}}},function(t,e,n){var i=n(5);t.exports=function(t,e){if(!i(t))return t;var n,r;if(e&&"function"==typeof(n=t.toString)&&!i(r=n.call(t)))return r;if("function"==typeof(n=t.valueOf)&&!i(r=n.call(t)))return r;if(!e&&"function"==typeof(n=t.toString)&&!i(r=n.call(t)))return r;throw TypeError("Can't convert object to primitive value")}},function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.boundingNames=e.boundings=void 0;var i=n(29),r=n(30),u=n(31),o=n(32),a=e.boundings={centering:r.centering,scaling:u.scaling,binding:i.binding,wrapping:o.wrapping};e.boundingNames=Object.keys(a)},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.binding=void 0;var i=n(3);e.binding=function(t){t.particles.forEach(function(t){return t.position.setMagnitude(i.MAX_RADIUS)})}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.centering=function(t){t.particles.forEach(function(e){return e.position.subtract(t.centroid)})}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.scaling=void 0;var i=n(3),r=n(0),u=function(t){return t&&t.__esModule?t:{default:t}}(r),o=i.MAX_RADIUS*i.MAX_RADIUS;e.scaling=function(t){if(!(t.particles.length<2)){var e=t.particles.map(function(t){return t.position}),n=e.reduce(function(e,n){var i=u.default.getDistanceSq(n,t.centroid);return Math.max(e,i)},-1);if(!(n<=o+1)){var i=o/n;t.particles.forEach(function(t){return t.position.multiply(i)})}}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.wrapping=void 0;var i=n(3),r=function(t){return t<-i.MAX_RADIUS?i.MAX_RADIUS:t>i.MAX_RADIUS?-i.MAX_RADIUS:t};e.wrapping=function(t){t.particles.forEach(function(t){return t.position.mutate(r)})}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.getNeighborhood=function(t,e){switch(e.name){case"all":return t.map(function(t){return t.neighbors.map(function(t){return{index:t.index,distance:t.distance}})});case"locals":return t.map(function(t){return t.neighbors.slice(0,t.dimensions).map(function(t){return{index:t.index,distance:t.distance}})});case"nearest":return t.map(function(t){return t.neighbors.slice(0,1).map(function(t){return{index:t.index,distance:t.distance}})});case"proximity":throw new Error("TODO: proximity neighborhood")}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(1),r=function(t){return t&&t.__esModule?t:{default:t}}(i),u=function t(e){var n=e.dimensions,i=e.position,u=e.velocity,o=e.acceleration;(0,r.default)(this,t),this.dimensions=n,this.position=i.toArray(),this.velocity=u.toArray(),this.acceleration=o.toArray()};e.default=u},function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var r=n(1),u=i(r),o=n(4),a=i(o),s=n(3),c=n(36),f=i(c),l=n(0),d=i(l),h=function(){function t(){(0,u.default)(this,t),this.particles=[],this.centroid=new d.default(0),this.furthest=0}return(0,a.default)(t,[{key:"setPopulation",value:function(t,e){var n=this.particles,i=new Array(t).fill(null).map(function(t,i){var r=new f.default(e);return n[i]?r.fill(n[i]):r.randomize(s.MAX_RADIUS),r});this.particles=i,this.recalculate()}},{key:"recalculate",value:function(){var t=this;if(0===this.particles.length)return this.centroid=new d.default(0),void(this.furthest=0);this.centroid=d.default.getAverage(this.particles.map(function(t){return t.position})),this.furthest=-1,this.particles.forEach(function(e){e.neighbors=[],t.particles.forEach(function(n,i){if(e!==n){var r=d.default.subtract(e.position,n.position),u=r.getMagnitude();t.furthest=Math.max(t.furthest,u),e.neighbors.push({index:i,delta:r,distance:u})}}),e.neighbors.sort(function(t,e){return t.distance-e.distance})})}}]),t}();e.default=h},function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var r=n(1),u=i(r),o=n(4),a=i(o),s=n(0),c=i(s),f=function(){function t(e){(0,u.default)(this,t),this.dimensions=e,this.position=new c.default(e),this.velocity=new c.default(e),this.acceleration=new c.default(e),this.neighbors=[]}return(0,a.default)(t,[{key:"randomize",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;return this.position.radialRandomize(t),this.velocity.randomize(t),this.acceleration.randomize(t),this}},{key:"fill",value:function(t){return this.position.mutate(function(e,n){return t.position.value(n)||e}),this.velocity.mutate(function(e,n){return t.velocity.value(n)||e}),this.acceleration.mutate(function(e,n){return t.acceleration.value(n)||e}),this}}]),t}();e.default=f}]);
//# sourceMappingURL=0c883dd3af37e840e8b0.worker.js.map