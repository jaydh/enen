(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{362:function(e,t,n){"use strict";n.d(t,"a",function(){return l});var r=n(341),a=n.n(r),c=n(342),i=n(344),o=n.n(i),s=n(343);function u(e,t,n){return{addedAt:n,id:t,url:e,type:"ADD_ARTICLE_FULFILLED"}}function l(e){return function(){var t=Object(c.a)(a.a.mark(function t(n,r){var i,l,m,d,f;return a.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n({type:"ADD_ARTICLE_REQUESTED"}),i=r().user.token,t.next=4,o()({method:"POST",url:"".concat(s.a,"/user/save"),headers:{Authorization:"Bearer ".concat(i)},data:{url:e}}).then(function(e){return e&&e.data}).catch(function(e){console.log(e)});case 4:l=t.sent,m=l._id,n(u(e,m,new Date)),d=function(){var e=Object(c.a)(a.a.mark(function e(){var t;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o()({method:"GET",url:"".concat(s.a,"/article/id"),params:{id:m}}).then(function(e){return e.data}).catch(function(e){console.log(e)});case 2:t=e.sent,console.log(t),t&&!t.fetching&&(window.clearInterval(f),n({type:"UPDATE_ARTICLE",id:m,data:t}));case 5:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),f=window.setInterval(d,1500);case 9:case"end":return t.stop()}},t)}));return function(e,n){return t.apply(this,arguments)}}()}},383:function(e,t,n){"use strict";var r=n(35),a=n(36),c=n(38),i=n(37),o=n(75),s=n(39),u=n(53),l=n(21),m=n(356),d=n(1),f=n(74),p=n(15),h=n(362),b=function(e){function t(e){var n;return Object(r.a)(this,t),(n=Object(c.a)(this,Object(i.a)(t).call(this,e))).handleSubmit=n.handleSubmit.bind(Object(o.a)(n)),n}return Object(s.a)(t,e),Object(a.a)(t,[{key:"render",value:function(){var e=this.props.classes;return d.createElement(u.p,{color:"primary",onClick:this.handleSubmit},d.createElement(m.a,{className:e.button}))}},{key:"handleSubmit",value:function(e){e.preventDefault(),this.props.addArticle(this.props.link)}}]),t}(d.Component);t.a=Object(f.b)(null,function(e,t){return Object(p.bindActionCreators)({addArticle:h.a},e)})(Object(l.withStyles)({button:{fontSize:"15px"}})(b))},6035:function(e,t,n){"use strict";n.r(t);var r=n(364),a=n(341),c=n.n(a),i=n(342),o=n(35),s=n(36),u=n(38),l=n(37),m=n(39),d=n(53),f=n(21),p=n(381),h=n.n(p),b=n(1),v=n(446),E=n.n(v),g=n(33),w=n.n(g),y=n(74),j=n(34),S=n(343),O=n(344),k=n.n(O),A=n(15),L=n(461),x=n(383),N=w()({loader:function(){return n.e(2).then(n.t.bind(null,5845,7))},loading:j.a}),T=function(e){function t(e){var n;return Object(o.a)(this,t),(n=Object(u.a)(this,Object(l.a)(t).call(this,e))).handleExpand=Object(i.a)(c.a.mark(function e(){return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:n.setState({show:!n.state.show}),n.state.HTML||n.getArticleData();case 2:case"end":return e.stop()}},e)})),n.getArticleData=function(){var e=n.props.url;return k()({method:"GET",url:"".concat(S.a,"/article/url"),params:{url:e}}).then(function(e){return console.log(e),n.setState(e.data)}).catch(function(e){console.log(e)})},n.getArticlesInView=function(){var e=n.state.requestedParses;n.state.articleLinks.filter(function(e){return n.elementInView(e)}).forEach(function(){var t=Object(i.a)(c.a.mark(function t(a){return c.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:e.find(function(e){return e===a.href})||(n.setState({requestedParses:[].concat(Object(r.a)(n.state.requestedParses),[a.href])}),n.props.requestServerParse(a.href));case 1:case"end":return t.stop()}},t)}));return function(e){return t.apply(this,arguments)}}())},n.elementInView=function(e){var t=e.getBoundingClientRect();return t.top>=0&&t.left>=0&&t.bottom<=(window.innerHeight||document.documentElement.clientHeight)&&t.right<=(window.innerWidth||document.documentElement.clientWidth)},n.transform=function(e,t){if(e){var r=n.props,a=r.classes,c=r.fontSize;return e.name&&e.name.startsWith("h")?b.createElement(d.B,{variant:"h1",gutterBottom:!0,style:{fontSize:c+4}},Object(v.convertNodeToElement)(e,t,n.transform)):"img"===e.name?(e.attribs.class="img-fluid",b.createElement(d.m,{container:!0,justify:"center",className:a.image},Object(v.convertNodeToElement)(e,t,n.transform))):"p"===e.name?b.createElement(d.B,{paragraph:!0,style:{fontSize:c}},Object(v.convertNodeToElement)(e,t,n.transform)):"pre"===e.name?b.createElement("div",{className:a.pre},b.createElement(N,null,Object(v.convertNodeToElement)(e))):"blockquote"===e.name?b.createElement("div",{className:a.quote},e.children.map(function(e){return b.createElement(d.B,{style:{fontSize:c}},e.data?e.data:null)})):void 0}},n.state={show:!1,fetching:!0,articleLinks:[],articleNodeList:[],requestedParses:[]},n}return Object(m.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){var e=Object(i.a)(c.a.mark(function e(){var t,n=this;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.setState({articleLinks:Array.from(document.querySelectorAll("div.page a")),articleNodeList:Array.from(document.querySelectorAll("div.page p")).filter(function(e){return e.textContent})});case 2:t=setInterval(function(){n.getArticlesInView()},5e3),this.setState({intervalId:t});case 4:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this.props,t=e.url,n=e.fontSize,r=e.classes,a=e.hyperlinkName,c=this.state,i=c.show,o=c.fetching,s=c.HTML,u=c.metadata,l=u&&u.title?u.title:t,m=u&&u.siteName,f=u&&u.excerpt,p="".concat(m||""," ").concat(f?"-"+f:"");return b.createElement("span",null,b.createElement("a",{href:t,target:"_blank",rel:"noopener noreferrer"},a),b.createElement(d.p,{onClick:this.handleExpand,color:"primary"},b.createElement(h.a,{className:r.button})),b.createElement(x.a,{link:t}),i&&b.createElement(d.g,{timeout:500,in:i,children:b.createElement(d.y,{className:r.embed,style:{fontSize:n}},o&&b.createElement(d.m,{container:!0,alignItems:"center",justify:"center"},b.createElement(d.e,null)),b.createElement(b.Fragment,null,b.createElement(d.B,{style:{fontSize:n+10},variant:"title"},l),b.createElement(d.B,{style:{fontSize:n+2},variant:"subtitle1"},p),b.createElement(d.h,{className:r.title}),E()(s,{decodeEntities:!1,transform:this.transform})))})," ")}}]),t}(b.Component);t.default=Object(y.b)(function(e,t){return{fontSize:e.ui.fontSize,uid:e.user.uid}},function(e){return Object(A.bindActionCreators)({requestServerParse:L.a},e)})(Object(f.withStyles)({button:{fontSize:"15px"},embed:{paddingLeft:"1em"},image:{padding:"4em"},pre:{borderLeft:"4px outset gray",margin:"2em",paddingLeft:"1em"},quote:{borderLeft:"4px outset purple",margin:"2em",paddingLeft:"1em"},title:{marginBottom:"4em"}})(T))}}]);
//# sourceMappingURL=12.9bc3dcc1.chunk.js.map