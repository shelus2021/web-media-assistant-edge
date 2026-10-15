"use strict";

// Generated from the bundled Imagus sieve. Keeping these functions in the package
// avoids run-time code generation and makes the rules compatible with MV3 CSP.
globalThis.WMA_IMAGUS_RULE_FUNCTIONS = Object.freeze({
  "fb-g+-ddg-proxy": Object.freeze({
    "to": function(){var $ = arguments; 
var u=decodeURIComponent($[2].replace(/\+/g,' ')),n
this.node.IMGS_fallback_zoom=u
n=this.find({href: u, IMGS_TRG: this.node})
return n&&typeof n!='number'||n===null? (Array.isArray(n) ? n.join('\n') : n) : ($[1]?'':u)
}
  }),
  "GoogleImages": Object.freeze({
    "url": function(){var $ = arguments; return  $[1] ? '' : $[0]
},
    "res": function($){
var i=!$[1]&&$._.match(RegExp(',"'+$[2]+'",[^\\]]+[^\\[]+\\[("[^"]+")[^\}]+",("([^"\\\\]*(?:\\\\.[^"\\\\]*)*)")')),d=decodeURIComponent
$ = $[1] && d(d($[1])) || i && JSON.parse(i[1])
return $ ? [(!$.lastIndexOf('http',0) ? $ : 'http://' + $), i && i[2] && JSON.parse(i[2])] : !1
}
  }),
  "yahoo": Object.freeze({
    "to": function(){var $ = arguments; 
return $[2] ? ($[1]||'http://') + $[2] : $[1].replace(/\.cf\.\w{3,4}$/, '')
}
  }),
  "yandex": Object.freeze({
    "to": function(){var $ = arguments; 
var p,u = (!$[1].lastIndexOf('http',0) ? '' : 'http://') + $[1];
if(!$[2]) try {
var o=JSON.parse(document.evaluate("string(ancestor::div[@data-bem][1]/@data-bem)", this.node, null, 2, null).stringValue);
for (p in o){u = o[p].dups.slice(0,2).map(function(el) {return (el.url||el.img_href)+'\n';}) + u; break}
} catch(ex){}
return $[2] ? '#' + u + $[2] + 'orig\n' + u + $[2] + 'X#XXL L#' : p=$[0].match(/rlt_url=([^&]+)/),p&&p[1] || u
}
  }),
  "Bing": Object.freeze({
    "to": function(){var $ = arguments; 
var m = document.evaluate('./ancestor-or-self::a[contains(@m, "imgurl") or contains(@m, "murl")]/@m', this.node ,null,2,null).stringValue
m = m && JSON.parse(m);
m = m && (m.imgurl||m.murl)
return (m ? m + '\n' : '') + $[1]
},
    "url": function(){var $ = arguments; return  $[0].indexOf('mediaurl=h')>0 ? '' : $[1] + 'view=detailV2&id=' + $[2]
},
    "res": function($){
var m = $[0].match(/mediaurl=(http[^&]+)/);
if(m)return decodeURIComponent(m[1])
m = $._.match(/class="mainImage"[^>]+?src2="([^"]+)/)
if(m)return m[1]
m = document.evaluate('./ancestor-or-self::a[contains(@m, "imgurl") or contains(@m, "murl")]/@m',this.node,null,2,null).stringValue
return m && JSON.parse(m).imgurl || null
}
  }),
  "aol": Object.freeze({
    "to": function(){var $ = arguments; 
if($[2]||$[3])return $[2]||$[3]
var m=$[1].match(/(https?)(?::\/\/?|%3A(?:%2F){1,2})(?!.+https?:\/)(.+)/)
return m ? m[1]+'://'+m[2] : $[1]
}
  }),
  "startpage": Object.freeze({
    "to": function(){var $ = arguments; 
var i=this.node.closest('.image-container');
i=i&&JSON.parse(i.dataset.imgMetadata || null);
return i && i.clickUrl && i.clickUrl || decodeURIComponent($[1])
}
  }),
  "GoogleContent": Object.freeze({
    "to": function(){var $ = arguments; 
var c=$[3]&&$[3].match(/-?(?:Ic\d\d|mo)/); c=c&&('-'+c[0])||'';
return '#' + $[1] + ($[5] ? $[5] + '=' : $[2]) + (c?'s1600'+c:'s0') + ($[4]||($[5]?'':'/')) + '\n' +
 $[1] + ($[5] ? $[5] + '=' : $[2]) + 's1024' + c + ($[4]||($[5]?'':'/'))
}
  }),
  "WikiMedia": Object.freeze({
    "to": function(){var $ = arguments; 
if($[7])return $[1] + 'thumb/' + $[4] + '/' + $[7] + '2048px-' + $[5] + '.jpg';
return '#' + $[1] + ($[3] ? $[3] + '/' : '') + $[4] + (!$[8] && !$[1].lastIndexOf('upload.wikimedia.org',0) && !/^gif/i.test($[6]) ? '\n'+ $[1] + 'thumb/' + $[4] + '/1024px-' + $[5] + (/^svg/i.test($[6]) ? '.png' : '') : ($[8] ? $[8] + 'latest' : ''))
}
  }),
  "facebook": Object.freeze({
    "to": function(){var $ = arguments; 
if($[0].indexOf('.mp4?')>0)return''
var p=this.node
if(window.location.hostname.slice(-13)=='.facebook.com' && (document.evaluate('./ancestor::div[contains(@class, "stageWrapper")]', p, null, 9, null).singleNodeValue || p.matches('.UFICommentContent>div[data-testid], a>abbr>span.timestampContent, #fbProfileCover>a:first-child')))return''
p=p.pathname||(p=p.parentNode)&&p.pathname||(p=p.parentNode)&&p.pathname
p=p&&p.match(/^\/([\w.-]+)\/?$/)
return 'https://facebook.com/' + (p?p[1].replace(/^\w+-(\d{8,})$/, '$1')+'/photos/' : 'photo.php?fbid=') + $[1]
},
    "url": function(){var $ = arguments; return  (this.node.dataset||{}).ploi || (((this.node.parentNode || {}).dataset) || {}).ploi ? '' : 'https://www.facebook.com/' + ($[1] ? $[1] + $[2] : 'photo.php?fbid=' + $[2])
},
    "res": function($){
if($._===void 0)return this.node.dataset.ploi||this.node.parentNode.dataset.ploi
var u=$._.match(RegExp('='+($[2]||$[1])+'(?:[^">]+"\\s+)+?data-ploi="([^"]+)')) || $._.match(RegExp(',"image":{"uri":"(https:[^"]+)')) || $._.match(/="og:image" content="([^"]+)/)
return u && u[1].replace(/\\/g, '') || !1
}
  }),
  "vk": Object.freeze({
    "to": function(){var $ = arguments; 
var x=this.node,p=x&&x.parentNode;$=$[0]
if(!x||!p)return $
if (x.dataset.src_big) $=x.dataset.src_big.split('|')[0]
else if ((x=x.getAttribute('onclick')||p.getAttribute('onclick')) && x.indexOf('showPhoto(')>0 && (x=x.match(/(\{".+\})/))) {
 x=JSON.parse(x[0]).temp
 $=(x.w ? '#' + x.w + '\n' : '') + (x.z || x.y || x.x);
}
return $
},
    "url": function(){var $ = arguments; return  $[1]=='doc' ? $[0] : 'vk.com/al_photos.php :list=' + ($[4] ? $[3]+$[4]:((this.node.parentNode.getAttribute('onclick')+'').match(/wall-[\d_]+/)||'')+'')+'&act=show&al=1&photo='+$[2]
},
    "res": function($){
if($[1]=='doc') { var x=$._.match(/<img src="([^"?]+)/);return x&&x[1] }
var m = /[\-\d_]+/, img, ret = null, cache = {'_arr': []}, i, pid = $.url[1].substr($.url[1].lastIndexOf('=') + 1), x = JSON.parse($._.slice($._.indexOf('{'))).payload[1][3]
for (i in x) {
 ret = x[i].w_src ? ['#' + x[i].w_src] : [];
 ret.push(x[i].z_src || x[i].y_src || x[i].x_src);
 if (x[i].id == pid) { img = [[ret]] }
 else { cache[x[i].id] = ret; cache._arr.push('a[href^="/photo'+x[i].id+'"]') }
}
cache._arr.length && [].forEach.call(document.body.querySelectorAll(cache._arr.join(',')), function(node) {
var x = cache[node.pathname.match(m)[0]];
if (!node.IMGS_c) {
 node.IMGS_c_resolved = x;
 node.firstElementChild && (node.firstElementChild.IMGS_c_resolved = x);
}
})
return img
}
  }),
  "deviantArt": Object.freeze({
    "url": function(){var $ = arguments; return  $[1] ? 'http://fav.me/' + $[1] : $[0]
},
    "res": function($){
var m=$._.match(/\.__INITIAL_STATE__\s*=\s*JSON\.parse\(("[^\n]+")/)
if(!m) {
 m=$._.match(/collect_rid="[^"]+" src="([^"]+)"[^>]+alt="([^"]+)"[^>]+="dev-content-full/)
 return m&&[m[1], m[2]]
}
var n='prettyName',j=JSON.parse(JSON.parse(m[1]))['@@entities'], e=j.deviationExtended, i=Object.keys(e)[0], d=j.deviation[i], m=d.media, u=m.baseUri, l=m.types.filter(function(t){return !!t.c||!!t.b}).pop(), t=m.token
if(!u)return;
e=e[i]; t=t?'?token='+t[0]:''
$=!l ? [u+t] : (l.t=='video' ? [l.b] : ['#'+u+t, u+'/'+(l.b||l.c).replace('<'+n+'>', d.media[n]) + t])
return [[$, ['['+d.publishedTime+' '+d.title+' by '+j.user[d.author].username+']', e.tags && e.tags.slice(0,5).map(function(x){return x.name}).join(', '), e.exif && e.exif.map(function(x){ return x.tag +': '+x.value}).join(', ')].filter(Boolean).join(' | ')]]
}
  }),
  "deviantArt-old": Object.freeze({
    "to": function(){var $ = arguments; 
return $[5] ? ('//'+ ($[4] ? $[4]+$[2]+$[5] : 'fc'+$[1]+$[2]+$[3]+'/'+$[5])) : $[0]
}
  }),
  "imgur": Object.freeze({
    "to": function(){var $ = arguments; 
if ($[4]=='mp4'||$[4]=='webm') $[4]='gif'
var l = ($[2][0]=='i' ? '//' : '')+'i.'+($[1]||'')+$[2]+'/'+$[3], x = '.'+($[4] || 'jpg')
return $[4][0]=='g' ? l + '.#mp4 gif#' : ('#' + l + ($[4] ? x : '.jpg') + ($[2][0] === 'f' ? '' : '\n' + l + 'h' + x))
}
  }),
  "imgur-set": Object.freeze({
    "url": function(){var $ = arguments; return  $[1] ? 'https://imgur.com/' + ($[1] == 'a' ? 'a/' + $[2] + '/embed' : $[1] + '/' + $[2] + '/hit.json') : $[0]
},
    "res": function($){
var ret = [], im, g, c, x, i, t, u, l = '//i.imgur.com/', p404='404 page</title>';

try {
 if (typeof $._ == 'string' && $._[0]!='{') {
   if($._.lastIndexOf(p404, 300) > -1) throw true;
   x = $._.match(/(?:album|image)\s*[:=] +([^\n\r]+),/);
   x = JSON.parse(x[1])
   t = this.t; delete this.t;
   if (!t&&'title' in x)t = x;
   x.album_images&&(x=x.album_images);
   x.images&&(x=x.images)||x.items&&(x=x.items);
 } else {
  $._=JSON.parse($._);
  if($._.album){
   x=$._.album
   t={title:x.title, description: x.description}
   x=x.images
  } else {
   x=$._.data.image
   if (x.is_album) {
    t={title:x.title, description: x.description}
    if (x.album_images.count != x.album_images.images.length) {
     this.t=t
     return {loop: l+'a/'+$[2]}
    }
    x=x.album_images.images
   }
  }
  delete this.t;
 }

 if (!x)throw $._.lastIndexOf(p404, 300) > -1;

 t = t && [t.title, t.description].filter(Boolean).join(' - ') || !1
 x = Array.isArray(x)?x:[x]
 for (i = 0; i < x.length; ++i) {
  im = x[i].image||x[i];
  c = [im.title, im.caption, im.description].filter(Boolean).join(' - ');
  if (!i && t && t!=c) c='['+t+'] ' + c;
  im.ext = im.ext || x[i].links.original.match(/\.[^.]+$/)[0];
  g = (''+im.animated)=='true'
  u = l + im.hash;
  ret.push([!g && im.width <= 1200 && im.height <= 1200 ? u + im.ext : (g ? [u + '.mp4', u + '.gif'] : ['#' + u + im.ext, u + 'h' + im.ext]), c]);
 }
} catch (ex) {}
return ret.length ? ret : null
}
  }),
  "twitch.tv": Object.freeze({
    "to": function(){var $ = arguments; 
return $[1]+($[2] ? $[2]+($[3]?'-600x600':($[4]?'-0x0':''))+$[5] : $[6]+($[7][0]=='b'?3:5))
}
  }),
  "pinterest": Object.freeze({
    "to": function(){var $ = arguments; 
if($[1]) return $[1] + ($[2] ? $[2] : ($[3] ? $[3].replace(/(\d+)_\d+$/, '$1') + '_600' : '#originals 736x 564x#/'))
var n=this.node, p=document.evaluate('./ancestor::a[starts-with(@href,"/pin/")]//img[contains(@src,"pinimg.com")]',n,null,9,null).singleNodeValue
p=p?this.find({src: p.src, IMGS_TRG: n}):''
return (Array.isArray(p) ? p.join('\n') : (p === null ? 'null' : p)) || ''
}
  }),
  "ravelry": Object.freeze({
    "to": function(){var $ = arguments; 
return $[1] + ($[3] || ($[4] + $[5] + ($[2]=='avatar'?'_xlarge':'# _b#') + ($[7]||$[6] ? '.' + ($[7]||$[6]) : '')))
}
  }),
  "imageshack-set": Object.freeze({
    "res": function($){
var ret=[],x=(new window.DOMParser()).parseFromString($._,'text/xml').querySelectorAll('file>server,file>name,file>bucket');
for(var i=0,l=x.length;i<l;i+=3)
  ret.push(['http://img'+x[i].textContent+'.imageshack.us/img'+x[i].textContent+'/'+x[i+2].textContent+'/'+x[i+1].textContent, null]);
return ret
}
  }),
  "twitter": Object.freeze({
    "to": function(){var $ = arguments; 
var v = $[1]&&$[1].replace(/(video)_thumb(\/[^.]+).+/, '$1$2.mp4'), f = $[0].match(/(?:format=|\.)([a-z]{3,4})(?:[:&?]|$)/), p = '?format='+(f&&f[1]||'jpg')+'&name='
if($[1] && v.length!=$[1].length) return v
return !$[3]||$[3]=='card_img' ? '#//' + ($[1] || $[2]) + p + 'orig\n' + '//' + $[1] + p + 'large' : $[2] + $[4]
},
    "url": function(){var $ = arguments; return  'https://' + (!$[0].lastIndexOf('pic',0) ? $[0] : 'twitter.com/i/' + ($[2]=='photo' ? 'tweet/html?id=' : 'cards/tfw/v1/') + $[1])
},
    "res": function($){
var x
if (x = $._.slice && $._.slice(40,200).match(/="0;URL=([^"]+)/)) return{loop: x[1]};
try{$._ = JSON.parse($._)}catch(ex){}
if (x = $._.tweet_html && $._.tweet_html.match(/data-image-url="([^"]+)/g)) x=x.map(function(i){i=i.slice(16).replace(/:[^:\/]+$/,''); return [['#'+i+':orig', i+':large']]});
else if (x=($._.tweet_html||$._).match(/(?:video|pbs)\.twimg\.com(\\)?\/\w+_video(?:_thumb)?(\\)?\/[^&"]+/)) x='https://'+x[0].replace(/\\/g, '').replace(/(_video)_thumb(\/[^.]+).*/, '$1$2.mp4')
if(x) {
 var t=($._.tweet_html||$._).match(/<p[^>]+>(.+?)<\/p>/),n=($._.tweet_html||$._).match(/data-screen-name="([^"]+)/);
 t = (n?('@'+n[1]):'')+(t?(n?' - ':'')+t[1]:'')
 if(x.pop)x[0] = [x[0], t]; else x=[x,t]
}
return x
}
  }),
  "twitter-proxy": Object.freeze({
    "to": function(){var $ = arguments; 
return decodeURIComponent(window.atob($[1].replace(/_/g, '/')).replace(/^[^h]*(https?:\/\/[^\/]+\/([\w\-.~:/?#\[\]@!$&'()*+,;=]|%\d\d)+).*/, '$1'))
}
  }),
  "t.co/twitter": Object.freeze({
    "to": function(){var $ = arguments; 
var n = this.node, i = n.dataset, t = n.textContent.trim();
t=/^[^\s\/]{4,70}\/[^\s]/.test(t)?t.replace(/^(?!https?:)(\/\/)?/, 'http://'):'';
i = i.expandedUrl || i.imageUrl || i.url || i.fullUrl || (i = n.parentNode) && i.dataset.expandedUrl || (t && !/^(https?:\/\/)?t\.co/.test(t) && t) || n.style.backgroundImage.replace(/^(?:url\(['"]?([^'")]+))?.+/, '$1');
i = i && this.find({href: i, IMGS_TRG: n});
return (Array.isArray(i) ? i.join('\n') : (i === null ? 'null' : i)) || ''
}
  }),
  "instagram": Object.freeze({
    "res": function($){
var i,c,u
$._=JSON.parse($._)
$=$._.graphql.shortcode_media
i=$.edge_sidecar_to_children
i=i&&i.edges
c=$.edge_media_to_caption.edges,c=c.length&&c[0].node.text,f=$.owner.full_name
c='@'+$.owner.username+(f?' ('+f+')':'') + ' | ' + new Date($.taken_at_timestamp*1e3).toLocaleString()+' '+(c?' | '+c:'')
if(i&&i.length) $=i.map(function(el,i){return [el.node.video_url || el.node.display_url, !i&&c]})
else $=[$.video_url || $.display_url, c]
return $
}
  }),
  "vine": Object.freeze({
    "res": function($){
if($._[0]!='{')return null
$._=JSON.parse($._)
return [$._.videoUrl, $._.description+' by '+$._.username]
}
  }),
  "streamable": Object.freeze({
    "res": function($){
$._ = $._.match(/var videoObject = (\{[^\n]+\})/)
if(!$._) return null
$._=JSON.parse($._[1])
var t;
if($._.group) {t=$._.name;$._=$._.group.videos} else {$._=[$._]}
return $._.map(function(x,i) {
 var f=x.files, u=[];
 ['mp4', 'webm', 'mp4-mobile', 'webm-mobile'].forEach(function(t,ii){
  f[t]&&u.push((ii<2?'#':'')+f[t].url)
 })
 return [u, (!i&&t ? '['+t+'] ':'') + ($._.title || '')]
})
}
  }),
  "vidble": Object.freeze({
    "res": function($){
var x = $._.match(RegExp("src='/[\\da-zA-Z]+(_[^.]*)?\\.[^']+", 'g')), t = $._.match(/<h2[^>]*>([^<]+)/), l = 'http://' + $[1];
return x ? x.map(function(i, n) {return ['#' + l + i.replace(/_[^.]+/, ''), !n && t && t[1]]}) : x
}
  }),
  "plays.tv": Object.freeze({
    "url": function(){var $ = arguments; return  '//' + $[1] + ($[2][0]=='e'?'video':$[2]) + $[3]
}
  }),
  "[vi].redd.it": Object.freeze({
    "to": function(){var $ = arguments; 
return $[0].indexOf('format=mp4')>0 ? $[0]+'#mp4' : 'i'+$[1]
},
    "res": function($){
var v=0,u,m=$._.match(/width="\d+">\s*<BaseURL>([^<]+)/g)
if(!m)return m
m.forEach(function(m){
 m=m.match(/"(\d+)">[^>]+>(.+)/)
 if(m[1] > v) {v=m[1]|0; u=m[2]}
})
return '//v.redd.it'+$[1]+'/'+u+'#mp4'
}
  }),
  "reddit-media": Object.freeze({
    "to": function(){var $ = arguments; 
if($[2]!==0)return $[2]=='#mp4'?$[0]:$[1]+'#mp4'
var u,p,c,n=window.location.hostname.slice(-10)=='reddit.com'&&this.node
if(!n)return''
if(n.matches('div.link a.thumbnail,div.link a.thumbnail>img, div.link a.title, div.link a.thumbnail.image')) {
 p=n;while((p=p.parentNode)&&!p.matches('div.link'));
 u=p.dataset, u=u.url||u.hrefUrl
 if(u&&/v\.redd\.it\//.test(u))return u
 c=p&&p.querySelector('div.expando[data-cachedhtml]')
 c=c&&c.getAttribute('data-cachedhtml')
 u=c&&c.match(/(?:<a href|(?:class="preview"|<source) src)="([^"]+)/g)
 if(u) {
  u=u.map(function(i){
   var u=i.slice(i.lastIndexOf('"')+1).replace(/&amp;/g,'&');
   return u+(i[1]=='s'?'#mp4':'')
  });
  u=c.indexOf('<source')!=-1?u.reverse():u
  return u.length?u.join('\n'):''
 }
 u=p.dataset, u=u.url||u.hrefUrl
}else if(n.matches('a.Post__titleLink')) {
 u = n.closest('.Post__top').querySelector('a.PostThumbnail').href
}else if(n.matches('a[data-click-id=body]>div>h3,.Post div>div[role=img]')){
 p=n.closest('div[id^=t3_]');
 if(p&&p.querySelector('p,i.icon-text'))return ''
 p=p.querySelector('a>.icon-outboundLink')
 p=p ? p.parentNode : {href: '//gateway.reddit.com/desktopapi/v1/postcomments/t3_'+$[1]+'?truncate=1'}
 p=this.find({href: p.href, IMGS_TRG: n})
 n.title = n.getAttribute('aria-label') || n.title
 return (Array.isArray(p) ? p.join('\n') : (p === null ? 'null' : p)) || ''
}
return u&&/^(https?:)?\/\/i\.redd\.?it/.test(u)?u:''
}
  }),
  "reddit-post": Object.freeze({
    "res": function($){
$._ = JSON.parse($._)
$._=$._.posts
var t = $._[$[1]].title
for (var i in $._) if($._[i].media){$=$._[i].media;break}
return $ && $.dashUrl ? {loop:$.dashUrl} : !0
}
  }),
  "reddit-thumbs": Object.freeze({
    "to": function(){var $ = arguments; 
var u,n=!$[1]&&this.node,x=n&&n.matches('.Post div>div[role=img]');
n && (n.title = n.getAttribute('aria-label') || n.title);
return x&&(x=n.closest('.Post')) && (x=x.querySelector('div>a[data-click-id=body][href]'))
? x.href
: n&&n.matches('div.link>a.thumbnail>img, .PostThumbnail>img, a>div[role=img]')&&n.parentNode.href ? '//rt/?'+n.parentNode.href : $[0]
},
    "res": function($){
var t, r=['<meta[^>]+?property=[\'"]?og:','[\'"]?\\s[^>]*?content=[\'"]([^\'">]+)'], m = $._.match(RegExp(r[0]+'image(?::url)?'+r[1]))
return m ? [m[1], (t = $._.match(RegExp(r[0]+'title'+r[1])))&&t[1]] : !1
}
  }),
  "gfycat": Object.freeze({
    "url": function(){var $ = arguments; return  'https://api.'+$[1]+'/v1/' + ($[3] ? 'users/'+$[3]+'/album_links/'+$[4] : 'gfycats/'+$[2])
},
    "res": function($){
var u,g,i=0,r=[], o=JSON.parse($._);
o=o.publishedGfys||[o.gfyItem]
while(g=o[i++]) {
 u=['#'+g.webmUrl, '#'+g.mp4Url]
 g.mobileUrl&&u.push(g.mobileUrl)
 r.push([u, (g.title||'') + (g.tags&&g.tags.length ? ' ['+g.tags.join(', ')+']':'')])
}
return r.length ? r : null
}
  }),
  "qwip.in": Object.freeze({
    "res": function($){
var d=$._.match(/krowd\.qwip\s*=\s*(\{[^;]+\});\s*<\/script>/)
d=d&&JSON.parse(d[1])
return !d?null:[d.media[0].raw.url, d.usertext + (d.extra.link ? ' | ' + d.extra.link : '')]
}
  }),
  "peervideo": Object.freeze({
    "res": function($){
$._=JSON.parse($._)
return [$._.files[0].fileUrl, $._.name]
}
  }),
  "squarespace": Object.freeze({
    "to": function(){var $ = arguments; 
var u=$[1].replace(/-\d+(?:w|x\d+)(?=\.jpg)$/,'#-2500w #');
return u == $[1] ? u + '#?format=2500w #' : u
}
  }),
  "foursquare": Object.freeze({
    "to": function(){var $ = arguments; 
return $[1] + ($[2] ? $[2] + 'original' : $[3] + '/');
}
  }),
  "gravatar": Object.freeze({
    "to": function(){var $ = arguments; 
var x = /[&?](d(?:efault)?=[^&]+)/.exec($[0]), y = /[&?](r(?:ating)?=[^&]+)/.exec($[0]);
return $[1]+($[2]||$[3])+'/'+$[4]+'?s='+($[3]?1e3:512)+(x?'&'+x[1]:'')+(y?'&'+y[1]:'')
}
  }),
  "github": Object.freeze({
    "to": function(){var $ = arguments; 
var v=$[2]?'':$[0].slice($[1].length); v=v&&v.match(/[?&](v=\d+)/)||'';
return $[1] + ($[2]?'raw'+$[2]:v&&('?'+v[1]))
}
  }),
  "gawker": Object.freeze({
    "to": function(){var $ = arguments; 
return $[1] ? $[1]+'original' : $[2]
}
  }),
  "img.purch.com": Object.freeze({
    "to": function(){var $ = arguments; 
return window.atob($[1])
}
  }),
  "tom's-hardware": Object.freeze({
    "to": function(){var $ = arguments; 
if ($[6]) return ''+this.find({href: 'http://tomshardware.com/gallery/,.-' + $[6] + '.html', IMGS_TRG: this.node})
return $[2] ? atob($[2]) : $[1] + $[3] + 'original' + $[4] + '.#' +$[5]+ ' '+ $[5].toUpperCase() +'#'
}
  }),
  "gsmarena": Object.freeze({
    "to": function(){var $ = arguments; 
return $[3]?'st'+$[2]+'pics/'+$[3]+'/'+$[4]+'/'+$[5]+'/': $[1] + ($[6] || $[7]) + '# -1024x768m/#'
}
  }),
  "blogcdn": Object.freeze({
    "to": function(){var $ = arguments; 
return $[1] + ($[3] ? $[2] + 'l' + $[3] : $[4]) + '.';
}
  }),
  "artstation": Object.freeze({
    "res": function($){
$=JSON.parse($._)
if (!$.user) return null;
$.s = $.software_items.map(function(i) {return i.name}).join(', ')
$.c = [$.title, $.description.replace(/^<p>(.*)<\/p>$/, '$1')].filter(function(x) {return !!x.trim()}).join(' - ') + ' by ' + $.user.username;
return $.assets.map(function(x, i){
 return [x.image_url, [(i ? '' : '[' + $.c + ($.s ? ' in ' + $.s : '') + ']'), (x.title||x.title_formatted||'')].join(' ')]
})
}
  }),
  "daz3d.com": Object.freeze({
    "to": function(){var $ = arguments; 
return $[2] ? $[1] + $[2] + 'full' : (this.node.dataset.fancyboxHref || '')
}
  }),
  "steamstore": Object.freeze({
    "to": function(){var $ = arguments; 
return $[1]+($[2] ? $[2]+'_max.webm' : $[3]+'.jpg')
}
  }),
  "amazon": Object.freeze({
    "to": function(){var $ = arguments; 
var x=$[2]||'#jpg png#'
return '#' + $[1] + '.' + x +'\n'+$[1] + '._SY1024_SX1024_.'+x
}
  }),
  "newegg": Object.freeze({
    "to": function(){var $ = arguments; 
return $[1] + ($[2] ? $[2] + '?$S1280$': ($[4] ? $[4] + '800' : $[3] + 'CompressAll1280'));
}
  }),
  "ebay": Object.freeze({
    "to": function(){var $ = arguments; 
return $[1]+($[2] ? $[2]+'1600' : $[3]+'_32.')
},
    "res": function($){
var block = $._.match(/PicturePanelPH"\)\.init\(([^\n]+)\)/);
var title = block && $._.match(/="twitter:title" content="([^"]+)/);
var price = block && $._.match(/itemprop="price"[^>]+>([^<]+)/);
var location = block && $._.match(/='availableAtOrFrom'>([^<]+)/);
if (!block) return false;
var images = [], match, pattern = /(?:videoUrl|maxImageUrl|displayImgUrl)\s*:\s*["']([^"']+)["']/g;
while ((match = pattern.exec(block[1]))) if (images.indexOf(match[1]) < 0) images.push(match[1]);
return images.map(function(url, index) {
  var item = [url];
  if (!index && title) item.push([price && price[1], location && location[1], title[1]].filter(Boolean).join(" | "));
  return item;
});
}
  }),
  "Craigslist": Object.freeze({
    "res": function($){
$ = $._&&$._.match(/data-imgid="[^"]+" href="([^"]+)/g)
var f=this.find, s = this.node.matches('img[src*="images.craigslist.org"]') && this.node.src
return $ && $.map(function(x){
 x=x.slice(x.lastIndexOf('"') + 1)
 return [f({src: x})]
}) || s && this.find({src: s}) || !1
}
  }),
  "boardgamegeek": Object.freeze({
    "res": function($){
$._=JSON.parse($._)
return [[['#'+$._.images.original.url, $._.images.large.url], '['+$._.postdate+'] ' + $._.caption]]
}
  }),
  "bugzilla": Object.freeze({
    "to": function(){var $ = arguments; 
var n=this.node, p = n.parentNode, q = p&&p.parentNode; q = q && q.querySelector('.bz_attach_extra_info,.attach-info');
return q && ~q.textContent.indexOf('image/') || /\.(jpe?g|png|gif|bmp|web[mp]|svg)$/i.test(n.title) || n.classList.contains('lightbox') ? $[0] : ''
}
  }),
  "natgeo": Object.freeze({
    "to": function(){var $ = arguments; 
return $[1]+($[2]||$[3]+'0x0')
}
  }),
  "apod": Object.freeze({
    "res": function($){
var i=$._.match(/<br>\s*<a href="(image\/[^"]+)"[^<]+<img src="([^"]+)/i);
return i && [[["#" + $.base + i[1], $.base + i[2]], $._.match(/Explanation:?\s*<\/[^>]+>:?\s*([\s\S]+?)<p>/)[1].trim().replace(/<[^>]+>/g, '')]] || null;
}
  }),
  "weibo": Object.freeze({
    "to": function(){var $ = arguments; 
return ($[2]=='mu' ? 'http://' : $[1]+'large/') + $[3]
}
  }),
  "douban": Object.freeze({
    "to": function(){var $ = arguments; 
return $[1] + ($[2] ? $[2] + ($[3]||'photo') + '/#large photo#' : (($[4]||'') + 'l'));
}
  }),
  "imgbox": Object.freeze({
    "to": function(){var $ = arguments; 
return $[1]?'image'+$[1]+'.'+$[2]+'_o':'i.'+$[2]
},
    "res": function($){
if(!$[2])return $._.match(/href="([^"?]+)\?download/)[1]
var t = $._.match(/<h1>([^<]+)/), r = $._.match(/ b" src="https:\/\/thumbs[^"]+/g).map(function(i) {
 return [i.slice(9).replace(/thumb(s\d\.)/, 'image$1').replace(/_\w\./, '_o.')]
})
r[0][1] = t&&t[1]
return r
}
  }),
  "yandisk": Object.freeze({
    "to": function(){var $ = arguments; 
return $[0].replace(/&crop=[^&]*/, '').replace(/(&size=)[^&]+/, '$110000x10000')
}
  }),
  "foto.mail.ru": Object.freeze({
    "to": function(){var $ = arguments; 
return $[4] ? decodeURIComponent($[4]).replace(/\/i(-\d+\.[^?]+).*/, '/h$1') : 'content.f' + $[1] + $[2].replace(/=/g, '/') + 'h' + $[3];
}
  }),
  "svadba.pro": Object.freeze({
    "to": function(){var $ = arguments; 
return $[1] + ($[2] ? 'medium/': '/') + $[3];
}
  }),
  "itmages.ru": Object.freeze({
    "to": function(){var $ = arguments; 
return $[2] ? $[2] + '.static.itmages.ru/' + decodeURIComponent($[3]) : $[1] + 'h_';
}
  }),
  "ffx-ss": Object.freeze({
    "res": function($){
$=JSON.parse($._.match(/">({"[^\n]+)</)[1])
return [$.downloadUrl.replace(/\?.*/, ''), [$.buildTime, $.title, $.urlIfDeleted].join(' | ')]
}
  }),
  "puu.sh": Object.freeze({
    "res": function($){
try {
 $ = JSON.parse($._).objects, i = $.length, u = '//puu.sh/';
 while(i--) $[i] = [u + $[i].id + '/' + $[i].name, null, u + 't/' + $[i].id];
 return $;
} catch (ex) {return null}
}
  }),
  "xkcd": Object.freeze({
    "res": function($){
if ($._[0] != '{') $ = null;
else $ = JSON.parse($._), $ = [$.img, [$.year, ('0'+$.month).slice(-2), ('0'+$.day).slice(-2)].join('-') + ' | ' + $.safe_title + ' - ' + $.alt + ' ' + $.link];
return $;
}
  }),
  "tuchong.com": Object.freeze({
    "res": function($){
var p,d='http://photos.'+($[1]||$[3])
$ = JSON.parse($._)
if(!$||!$.images)return null
p=$.post?[$.post.title, $.post.exerpt].filter(Boolean).join(' - '):'';
p = p ? '['+p+' by '+$.post.author.name+'] ':''
$=$.images
return $&&$.length ? $.map(function(x,i) {
 return [d + x.user_id + '/f/' + x.img_id + '.jpg', (!i&&p ? p : '')+[x.title, x.description].filter(Boolean).join(' - ')]
}) : null
}
  }),
  "500px": Object.freeze({
    "res": function($){
var i=JSON.parse($._).photos[$[2]],u=i.image_url
return [[['#'+u[1], u[0]], [i.name, i.description, i.location, i.camera, i.lens, 'by ' + i.user.username + ' (' + i.user.fullname + ')'].filter(Boolean).join(' | ')]]
}
  }),
  "youpic": Object.freeze({
    "res": function($){
var x=JSON.parse($._.match(/{"@context"[^\n]+/)[0]), i = x.image.split(/(?:huge|large|medium|small)/)
return [[['#'+i[0]+'huge'+i[1], i[0]+'large'+i[1]], [x.name, x.description].filter(Boolean).join(' | ')]]
}
  }),
  "smugmug": Object.freeze({
    "to": function(){var $ = arguments; 
return $[0].replace(/(?:(\/)(?:T[ih]|S|M|L|X[2L]|\d+x\d+)(\/)|(-)(?:T[ih]|S|M|L|X[2L]|\d+x\d+)([.\/]))/g, '$1$3X3$2$4');
}
  }),
  "1x": Object.freeze({
    "res": function($){
var r = $._.match(RegExp("\\('"+ $.url[0].match(/[^\/]\/(\d+)/)[1] +"','(?:\\w*',')+?/(images/user/[\\da-f]{32}[^']+)"));
return r && $.base.slice(0,$.base.indexOf('/',13)+1) + r[1];
}
  }),
  "ipernity": Object.freeze({
    "res": function($){
var i=($._.match(/var bulb = \{"url":"([^"]+)/) || [])[1];
return !i || [i.replace(/\\/g, ''), $._.match(/<title>ipernity: (.+?)<\/title>/)[1]];
}
  }),
  "discogs": Object.freeze({
    "res": function($){
var r = [];
($._.match(/https:\/\/img\.discogs\.com\/[^"]+\.jpeg\.jpg/g) || r).forEach(function(i) {r.push([i]);});
return r;
}
  }),
  "gifbin": Object.freeze({
    "res": function($){
var t,u=$._.match(/src="https?:\/\/www\.gifbin\.com\/bin\/[^"]+/g)
if(!u)return 0
t=$._.match(/="og:title"\s+content="([^"]+)/);
return [[u.slice(0,3).map(function(u){ return u.slice(5) }), t&&t[1]]]
}
  }),
  "giphy": Object.freeze({
    "res": function($){
$=/gif:\s*(\{[^\n]+\})/.exec($._)
$=$&&JSON.parse($[1])
return $ && [[[$.images.original.mp4, $.images.original.url], $.alt_tag]]
}
  }),
  "hizliresim": Object.freeze({
    "to": function(){var $ = arguments; 
return ($[1]=='t'?'i':'g') + $[2]
},
    "res": function($){
var t=$._.match(/="og:description" content="([^"]+)/),
m=$._.match(/="og:image" content="([^"]+)/)
if(!$[1]) return m ? [m[1], t&&t[1]] : null
m=$._.match(/<img data-src="[^"]+/g)
return !m ? null : m.map(function(x, i) {
 return [x.slice(15), !i&&t&&t[1]]
})
}
  }),
  "lazy...info": Object.freeze({
    "to": function(){var $ = arguments; 
return $[1] + $[3] + (/girl|boy/.test($[2]||'') ? '.sized' : '')
}
  }),
  "erome.com": Object.freeze({
    "res": function($){
var x=$._.match(/(?:="img" data-|<source )src="(?:https?:)?\/\/s\d+\.erome\.com\/\d+\/[^>]+/g),r={}
x&&x.forEach(function(s,i){
 var v = s[0]=='<', b = s.indexOf('/'), e = s.indexOf('"', b+5), u=s.slice(b, e), id=u.match(/[^/]\/([^/_.]+)[._]/)[1];
 u=(/label='HD'/.test(s) ?'#':'')+u
 if(!r[id])r[id]=[u]
 else if(typeof r[id][0]=='string') r[id][0] = [r[id][0], u]
 else return;
 i=!i&&$._.match(/<title>([^<]+)/)
 i&&id[1] && r[id].push(i[1])
})
r=Object.values(r)
return r.length?r:null
}
  }),
  "pornbot": Object.freeze({
    "res": function($){
$._=JSON.parse($._)
return $._.error ? {_: $._.error} : ($._.webmUrl || $._.mp4Url)
}
  }),
  "xhamster-photos": Object.freeze({
    "res": function($){
$=$._.match(RegExp('"id":'+$[2]+',"galleryId":'+$[1]+',"imageURL":("[^"]+")'))
return JSON.parse($[1])
}
  }),
  "sanku-beta": Object.freeze({
    "res": function($){
$=JSON.parse($._)[0]
return [[
 $.sample_width-500 >= $.width && $.sample_height-500 >= $.height ? ['#' + $.file_url, $.sample_url] : $.file_url,
 '['+new Date($.created_at.s*1e3).toLocaleString()+'] ' + $.author.name + ' ' + $.source]
]
}
  }),
  "donmai.us": Object.freeze({
    "res": function($){
var x = JSON.parse($._);
return x&&x.file_url ? [x.file_url, (x.tag_string_general + (x.tag_string_artist ? ' by ' + x.tag_string_artist : '')).replace(/_/g, " ")] : null
}
  }),
  "*.booru.org|mspabooru": Object.freeze({
    "to": function(){var $ = arguments; 
return ($[1][0]=='b'?'img.':'')+$[1]+($[2]||'')+'images/'+$[3]+$[4];
}
  }),
  "nhentai.net": Object.freeze({
    "to": function(){var $ = arguments; 
return 'i' + $[1] + ($[2]||'1')
}
  }),
  "derpibooru": Object.freeze({
    "res": function($){
$ = JSON.parse($._).image
var r = $.representations
return [[
 $.format=='gif'||$.width<1200 && $.height<1200 ? r.full : ['#' + r.full, r.large],
 ['['+$.created_at+']', $.name, $.description, $.tags, $.source_url].filter(Boolean).join(' | ')
]]
}
  }),
  "redditbooru": Object.freeze({
    "to": function(){var $ = arguments; 
return window.atob($[1])
},
    "res": function($){
$=$._.match(/\.startUp\s=\s*(\{[^\n\r]+\});/)
$=JSON.parse($[1]).images;
return $ ? $.map(function(i){return [i.cdnUrl, i.caption +' '+ i.sourceUrl]}) : $
}
  }),
  "booru.io": Object.freeze({
    "res": function($){
var x=$._, t=[], m={}
Object.keys(x.tags).forEach(function(i){ i=i.split('#'); if(i[1])m[i[1]]=i[0]; else t.push(i[0]) })
return ['data/' + Object.values(x.transforms)[0], [new Date(x.createdAt).toLocaleString(), 'by ' + m.artist, m.character, m.origin, t.join(', ')].filter(Boolean).join(' | ')]
}
  }),
  "furrynetwork": Object.freeze({
    "res": function($){
$._=JSON.parse($._)
return [[$._.record_type[0]=='m' ? $._.url : ['#'+$._.images.original, $._.images.large], $._.title + ' by ' + $._.character.display_name]]
}
  }),
  "pixiv": Object.freeze({
    "to": function(){var $ = arguments; 
var i=$[1][0]=='i'
return '//i.pximg.net/' + (i ? 'img-original' : $[1]) + $[2] + (i && $[3]=='.jpg' ? '.#jpg png gif#' : $[3])
},
    "res": function($){
$=JSON.parse($._)
if($.error)return !1
var i=0,r=[],$=$.body
for(;i<$.pageCount;++i) r.push([$.urls.original.replace('_p0', '_p' + i)])
r[0][1] = '['+$.title+' by ' + $.userName + ' | ' + new Date($.uploadDate).toLocaleString() + '] ' + $.description
return r
}
  }),
  "MyAnimeList": Object.freeze({
    "to": function(){var $ = arguments; 
return $[1]+($[2] || ($[3].indexOf('/userimages')>0 ? $[3].replace(/_?thumbs?\/?/g,'') : $[3] + '#l #'))+'.'+$[4]
}
  }),
  "renders-graphics": Object.freeze({
    "to": function(){var $ = arguments; 
return $[2] ? $[1]+'gestion/telechargement.php?id_image='+$[2] : $[1]+'normal/';
}
  }),
  "wordpress": Object.freeze({
    "to": function(){var $ = arguments; 
if(/\.php$/.test($[8]))return !1
if(/[&?]s=[\da-f]{32}/.test($[0]))return $[0]
var m=$[0].match(/[&?](?:url|src)=([^&]+)/)
if(m)return decodeURIComponent(m[1])
var x=$[8]&&$[8].match(/^(.*\.)(jpe?g|gif|png)$/i)
return $[1] + ($[2] || '') + ($[3] || '') + ($[4] || '') + ($[5] || '') + ($[6] ? $[6] + $[7] : '') + (x && x[2] ? x[1] + (x[2]!='j' ? x[2] : '#jpg jpeg png gif#') : $[8]||'')
}
  }),
  "thumbor": Object.freeze({
    "to": function(){var $ = arguments; 
if($[1].indexOf('%')>0)$[1] = decodeURIComponent($[1])
return /^http/.test($[1]) ? $[1] : '//' + $[1]
}
  }),
  "vBulletin": Object.freeze({
    "to": function(){var $ = arguments; 
var n=this.node, r=/\.(jpe?g|gif|png|bmp|web[mp]|mp[34])\b/i
console.log(n.title)
return $[1]==1 || r.test(n.textContent) || r.test(n.title) || ~(n.src||'').indexOf($[1]) || n.classList.contains('thumbnail') ? $[0].replace(/thumb=1&?/,'') : ''
}
  }),
  "CF-Image-Host": Object.freeze({
    "to": function(){var $ = arguments; 
return 'http://'+$[1]+($[5] ? '#image.php #?di=' + $[5] : ($[3]||'')+ 'di' +($[2]||'') + ($[4]||'') +'.jpg');
}
  }),
  "MarginalHacks-album": Object.freeze({
    "to": function(){var $ = arguments; 
return $[4] ?
'#' + $[1] + $[2] + $[4] + '\n' + $[1] + 'tn/' + $[2] + '.med' + $[4] :
'#' + $[1] + $[2] + $[3] + '\n' + $[1] + 'tn/' + $[2] + $[3];
}
  }),
  "phpGraphy": Object.freeze({
    "to": function(){var $ = arguments; 
return $[2].slice(-13) === 'directory.jpg' ? $[0] : $[1] + 'displaypic=' + $[2];
}
  }),
  "PhotoPost": Object.freeze({
    "to": function(){var $ = arguments; 
var l;
if ($[4]) {
 l = [$[1] + $[4], '.#' + $[5] + ' ' + $[5].toUpperCase() + '#'];
 l = '#' + l[0] + '_original' + l[1] + '\n' + l.join("");
} else if (/-thumb\.[A-Za-z]{3,4}$/.test($[0])) l = $[0].replace('-thumb.', '.');
else {
 l = $[1] + $[2];
 l = '#' + l + $[3] + '\n' + l +'medium/' + $[3];
}
return l;
}
  })
});
