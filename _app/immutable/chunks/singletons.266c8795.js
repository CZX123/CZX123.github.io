import{I as d,s as v}from"./index.22e5dd81.js";const c=[];function p(e,t=d){let n;const o=new Set;function l(s){if(v(e,s)&&(e=s,n)){const u=!c.length;for(const a of o)a[1](),c.push(a,e);if(u){for(let a=0;a<c.length;a+=2)c[a][0](c[a+1]);c.length=0}}}function i(s){l(s(e))}function r(s,u=d){const a=[s,u];return o.add(a),o.size===1&&(n=t(l)||d),s(e),()=>{o.delete(a),o.size===0&&n&&(n(),n=null)}}return{set:l,update:i,subscribe:r}}var g;const E=((g=globalThis.__sveltekit_16emtfg)==null?void 0:g.base)??"";var k;const w=((k=globalThis.__sveltekit_16emtfg)==null?void 0:k.assets)??E,A="1680535936595",y="sveltekit:snapshot",x="sveltekit:scroll",O="sveltekit:index",_={tap:1,hover:2,viewport:3,eager:4,off:-1};function U(e){let t=e.baseURI;if(!t){const n=e.getElementsByTagName("base");t=n.length?n[0].href:e.URL}return t}function L(){return{x:pageXOffset,y:pageYOffset}}function f(e,t){return e.getAttribute(`data-sveltekit-${t}`)}const b={..._,"":_.hover};function m(e){let t=e.assignedSlot??e.parentNode;return(t==null?void 0:t.nodeType)===11&&(t=t.host),t}function N(e,t){for(;e&&e!==t;){if(e.nodeName.toUpperCase()==="A"&&e.hasAttribute("href"))return e;e=m(e)}}function V(e,t){let n;try{n=new URL(e instanceof SVGAElement?e.href.baseVal:e.href,document.baseURI)}catch{}const o=e instanceof SVGAElement?e.target.baseVal:e.target,l=!n||!!o||R(n,t)||(e.getAttribute("rel")||"").split(/\s+/).includes("external")||e.hasAttribute("download");return{url:n,external:l,target:o}}function P(e){let t=null,n=null,o=null,l=null,i=null,r=null,s=e;for(;s&&s!==document.documentElement;)o===null&&(o=f(s,"preload-code")),l===null&&(l=f(s,"preload-data")),t===null&&(t=f(s,"keepfocus")),n===null&&(n=f(s,"noscroll")),i===null&&(i=f(s,"reload")),r===null&&(r=f(s,"replacestate")),s=m(s);return{preload_code:b[o??"off"],preload_data:b[l??"off"],keep_focus:t==="off"?!1:t===""?!0:null,noscroll:n==="off"?!1:n===""?!0:null,reload:i==="off"?!1:i===""?!0:null,replace_state:r==="off"?!1:r===""?!0:null}}function h(e){const t=p(e);let n=!0;function o(){n=!0,t.update(r=>r)}function l(r){n=!1,t.set(r)}function i(r){let s;return t.subscribe(u=>{(s===void 0||n&&u!==s)&&r(s=u)})}return{notify:o,set:l,subscribe:i}}function I(){const{set:e,subscribe:t}=p(!1);let n;async function o(){clearTimeout(n);const l=await fetch(`${w}/_app/version.json`,{headers:{pragma:"no-cache","cache-control":"no-cache"}});if(l.ok){const r=(await l.json()).version!==A;return r&&(e(!0),clearTimeout(n)),r}else throw new Error(`Version check failed: ${l.status}`)}return{subscribe:t,check:o}}function R(e,t){return e.origin!==location.origin||!e.pathname.startsWith(t)}let S;function Y(e){S=e.client}const $={url:h({}),page:h({}),navigating:p(null),updated:I()};export{O as I,_ as P,x as S,y as a,V as b,P as c,L as d,E as e,N as f,U as g,Y as h,R as i,S as j,$ as s};
