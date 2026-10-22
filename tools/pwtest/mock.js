(function(){
  var cfg = JSON.parse(sessionStorage.getItem("mockcfg") || "{}");
  var perm = sessionStorage.getItem("perm") || "granted";
  window.__log = [];
  function Dir(name){ this.kind="directory"; this.name=name; this.c={}; }
  function Fil(name, data, mt){ this.kind="file"; this.name=name; this.data=data; this.mt=mt; }
  Dir.prototype.getDirectoryHandle=function(n,o){ var e=this.c[n]; if(!e){ if(!(o&&o.create)) return Promise.reject(Object.assign(new Error("nf"),{name:"NotFoundError"})); e=this.c[n]=new Dir(n); window.__log.push("mkdir "+n);} return Promise.resolve(e); };
  Dir.prototype.getFileHandle=function(n,o){ var e=this.c[n]; if(!e){ if(!(o&&o.create)) return Promise.reject(Object.assign(new Error("nf"),{name:"NotFoundError"})); e=this.c[n]=new Fil(n,"",Date.now());} return Promise.resolve(e); };
  Dir.prototype.removeEntry=function(n){ delete this.c[n]; return Promise.resolve(); };
  Dir.prototype.values=async function*(){ for (var k in this.c) yield this.c[k]; };
  Dir.prototype.queryPermission=function(){ return Promise.resolve(perm); };
  Dir.prototype.requestPermission=function(){ window.__log.push("request"); perm="granted"; sessionStorage.setItem("perm","granted"); return Promise.resolve("granted"); };
  Fil.prototype.getFile=function(){ return Promise.resolve(new File([this.data], this.name, {lastModified:this.mt})); };
  Fil.prototype.createWritable=function(){ var s=this; return Promise.resolve({ write:function(d){ s.data=d; s.mt=Date.now(); return Promise.resolve(); }, close:function(){ return Promise.resolve(); } }); };
  var root = new Dir("ESC_Share");
  if (cfg.params) { var p=root.c.projecten=new Dir("projecten"); var e=p.c["ESC-param"]=new Dir("ESC-param");
    cfg.params.forEach(function(f){ e.c[f[0]]=new Fil(f[0], "x".repeat(f[2]||10), Date.now()-f[1]*60000); }); }
  if (cfg.sub) { root.c.projecten.c["ESC-param"].c.sub = new Dir("sub"); root.c.projecten.c["ESC-param"].c.sub.c["in.xml"]=new Fil("in.xml","a",Date.now()); }
  window.__root = root;
  window.showDirectoryPicker = function(){ window.__log.push("picker"); return Promise.resolve(root); };
  var store = {}; if (sessionStorage.getItem("dirPicked")) store.dir = root;
  var OE = {}; Object.defineProperty(window, "OE", { value: OE, writable: true });
  Object.defineProperty(OE, "idbGet", { get:function(){ return function(k){ return Promise.resolve(store[k]); }; }, set:function(){} });
  Object.defineProperty(OE, "idbSet", { get:function(){ return function(k,v){ store[k]=v; if(k==="dir") sessionStorage.setItem("dirPicked","1"); return Promise.resolve(); }; }, set:function(){} });
  HTMLInputElement.prototype.click = function(){ window.__log.push("filepicker"); };
})();
