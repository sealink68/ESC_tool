import json, subprocess, sys, threading, http.server, functools
from playwright.sync_api import sync_playwright
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=http.server.ThreadingHTTPServer(("127.0.0.1",8765),functools.partial(Q,directory="/workspace/ESC_tool")); threading.Thread(target=srv.serve_forever,daemon=True).start()
URL="http://127.0.0.1:8765/index.html"
res=[]
def ok(n,c): res.append((n,bool(c))); print(("PASS " if c else "FAIL ")+n)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/usr/bin/google-chrome", headless=True)
    def page(cfg, perm="granted", picked=False, state=True, lang="nl"):
        ctx=b.new_context(service_workers="block"); pg=ctx.new_page()
        pg.add_init_script("sessionStorage.setItem('mockcfg',%s);sessionStorage.setItem('perm',%s);%s" % (json.dumps(json.dumps(cfg)), json.dumps(perm), "sessionStorage.setItem('dirPicked','1');" if picked else ""))
        pg.add_init_script(path="/workspace/esctest/mock.js")
        pg.goto(URL)
        if state:
            pg.evaluate("k=>{for (const key of Object.keys(localStorage)) {} }", None)
        return ctx,pg
    def setup(pg, lang="nl"):
        # language + name via UI
        pg.click(f"#seg button[data-l={lang}]") if False else None
    # 1 first use
    ctx,pg=page({})
    pg.click("#card button[data-l=nl]"); pg.fill("#fn","Jan"); pg.fill("#lnm","Peeters"); pg.click("#go")
    pg.wait_for_selector("#pick"); ok("first use: folder screen with pick button", pg.inner_text("#pick").strip().startswith("📁 Map kiezen"))
    pg.click("#pick"); pg.wait_for_selector("#latest")
    tree=pg.evaluate("Object.keys(__root.c.projecten.c)")
    ok("first use: projecten + ESC-param created", "ESC-param" in tree)
    ok("first use: handle stored", pg.evaluate("sessionStorage.getItem('dirPicked')")=="1")
    pg.click("#latest"); pg.wait_for_selector("#latestNone")
    ok("none: message + file picker opened", "filepicker" in pg.evaluate("__log"))
    # 2 remembered handle, granted: reload goes directly to form, no picker
    pg.reload(); pg.wait_for_selector("#latest")
    ok("remembered handle: form after reload without picker", pg.evaluate("__log").count("picker")==0)
    ctx.close()
    # 3 prompt path
    ctx,pg=page({"params":[["a.xml",1]]}, perm="prompt", picked=True)
    pg.click("#card button[data-l=nl]"); pg.fill("#fn","Jan"); pg.fill("#lnm","P"); pg.click("#go")
    pg.wait_for_selector("#renew")
    ok("prompt: 'Toegang toestaan' button", "Toegang toestaan" in pg.inner_text("#renew"))
    ok("prompt: 'Map wijzigen' option", "Map wijzigen" in pg.inner_text("#pick"))
    pg.click("#renew"); pg.wait_for_selector("#latest")
    ok("prompt: one click requests permission -> form", "request" in pg.evaluate("__log") and "picker" not in pg.evaluate("__log"))
    # one match
    pg.click("#latest"); pg.wait_for_selector("#latestUse")
    ok("one: proposal shows name/time/size", "a.xml" in pg.inner_text("#latestList") and "B" in pg.inner_text("#latestList"))
    pg.click("#latestUse"); ok("one: f.file filled", "a.xml" in pg.inner_text("#fileT"))
    ctx.close()
    # multiple + old ignored + ext case + other ext ignored + subfolder ignored
    ctx,pg=page({"params":[["old.xml",10],["B.XML",2,2048],["c.Dat",1],["d.prd",3],["e.txt",0],["f.PRD",6]],"sub":True}, picked=True)
    pg.click("#card button[data-l=fr]"); pg.fill("#fn","Jan"); pg.fill("#lnm","P"); pg.click("#go"); pg.click("#cont"); pg.wait_for_selector("#latest")
    ok("fr: button translated", "Récupérer" in pg.inner_text("#latest"))
    pg.click("#latest"); pg.wait_for_selector("#latestList")
    names=pg.eval_on_selector_all("#latestList [data-li] b","e=>e.map(x=>x.textContent)")
    ok("multiple: newest first, ext case-insens, old/other/subfolder ignored: %s"%names, names==["c.Dat","B.XML","d.prd"])
    pg.click("[data-li='1']"); ok("multiple: pick fills file", "B.XML" in pg.inner_text("#fileT"))
    pg.fill("#dos","123")
    ctx.close()
    # full save using fetched file
    ctx,pg=page({"params":[["z.xml",0]]}, picked=True)
    pg.click("#card button[data-l=nl]"); pg.fill("#fn","Jan"); pg.fill("#lnm","P"); pg.click("#go"); pg.click("#cont"); pg.wait_for_selector("#latest")
    pg.select_option("#fam", index=1); pg.select_option("#sub", index=1); pg.fill("#dos","D1"); pg.fill("#ser","S"); pg.fill("#ord","O")
    pg.click("#latest"); pg.click("#latestUse"); pg.click("#save"); pg.wait_for_selector("#rFile")
    fn=pg.inner_text("#rFile"); ok("save with fetched file: name %s"%fn, fn.endswith(".xml") and "D1" in fn)
    # lang + name remembered across reload, change via form link
    pg.reload(); pg.wait_for_selector("#whoName")
    ok("reload keeps name", pg.inner_text("#whoName")=="Jan P")
    ok("reload keeps lang (nl)", "Laatste parameterfile" in pg.inner_text("#latest") and "Wijzigen" in pg.inner_text("#whoEdit"))
    pg.click("#whoEdit"); pg.fill("#fn","Marie"); pg.fill("#lnm","Dubois"); pg.click("#go"); pg.wait_for_selector("#whoName")
    ok("change name via 'Wijzigen' returns to form", pg.inner_text("#whoName")=="Marie Dubois")
    pg.click("#seg button[data-l=fr]") if pg.is_visible("#seg button[data-l=fr]") else pg.evaluate("document.querySelector('#seg button[data-l=fr]').click()")
    pg.wait_for_selector("#whoEdit:has-text('Modifier')")
    pg.reload(); pg.wait_for_selector("#whoName")
    ok("changed name+lang (fr) survive reload", pg.inner_text("#whoName")=="Marie Dubois" and "Récupérer" in pg.inner_text("#latest"))
    ok("stored in localStorage", '"lang":"fr"' in pg.evaluate("localStorage.getItem('esc_state')"))
    ctx.close(); b.close()
srv.shutdown()
print("%d/%d passed"%(sum(c for _,c in res),len(res))); sys.exit(0 if all(c for _,c in res) else 1)
