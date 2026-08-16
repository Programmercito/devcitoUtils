const s=[{key:"camel",label:"camelCase",fn:(e,t)=>m(t)},{key:"pascal",label:"PascalCase",fn:(e,t)=>k(t)},{key:"snake",label:"snake_case",fn:(e,t)=>l(t,"_")},{key:"kebab",label:"kebab-case",fn:(e,t)=>l(t,"-")},{key:"constant",label:"CONSTANT_CASE",fn:(e,t)=>y(t)},{key:"dot",label:"dot.case",fn:(e,t)=>l(t,".")},{key:"path",label:"path/case",fn:(e,t)=>l(t,"/")},{key:"train",label:"Train-Case",fn:(e,t)=>g(t)},{key:"lower",label:"lower",fn:e=>r(e).toLowerCase()},{key:"upper",label:"UPPER",fn:e=>r(e).toUpperCase()},{key:"title",label:"Title Case",fn:(e,t)=>b(t)},{key:"sentence",label:"Sentence case",fn:e=>v(r(e))}],p=document.getElementById("text-input"),u=document.getElementById("transforms-grid"),o=document.getElementById("copy-all-btn"),i={};function r(e){return e==null?"":String(e)}function f(e){const t=r(e).replace(/[_\-.\/]+/g," ").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g,"$1 $2").trim();return t?t.split(/\s+/).map(n=>n.toLowerCase()):[]}function c(e){return e?e[0].toUpperCase()+e.slice(1):""}function m(e){return e.length?e[0]+e.slice(1).map(c).join(""):""}function k(e){return e.map(c).join("")}function l(e,t){return e.join(t)}function y(e){return e.map(t=>t.toUpperCase()).join("_")}function g(e){return e.map(c).join("-")}function b(e){return e.map(c).join(" ")}function v(e){const t=e.trim();if(!t)return"";const n=t.toLowerCase();return n[0].toUpperCase()+n.slice(1)}function w(){u.innerHTML=s.map(e=>`
            <div class="tool-output-panel flex flex-col gap-2">
                <div class="flex items-center justify-between">
                    <span class="text-[10px] text-gray-500 uppercase tracking-widest font-bold">${e.label}</span>
                    <button
                        type="button"
                        class="copy-btn tool-btn tool-btn-ghost !py-1 !px-2 !text-[10px]"
                        data-key="${e.key}"
                        aria-label="Copiar ${e.label}"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copiar
                    </button>
                </div>
                <input
                    type="text"
                    id="output-${e.key}"
                    class="tool-input !bg-transparent !border-0 !p-0 !shadow-none !font-mono text-sm"
                    readonly
                    value=""
                    aria-label="Resultado ${e.label}"
                />
            </div>
        `).join(""),s.forEach(e=>{i[e.key]=document.getElementById(`output-${e.key}`)}),u.querySelectorAll(".copy-btn").forEach(e=>{e.addEventListener("click",()=>{const t=e.getAttribute("data-key")||"",n=i[t]?.value||"";n&&navigator.clipboard.writeText(n).then(()=>{const a=e.innerHTML;e.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg> ¡Listo!',e.classList.add("!text-emerald-400"),setTimeout(()=>{e.innerHTML=a,e.classList.remove("!text-emerald-400")},2e3)})})})}function d(){const e=r(p.value),t=f(e);s.forEach(n=>{const a=i[n.key];if(a)try{a.value=e.trim()===""?"":n.fn(e,t)}catch{a.value=""}})}function h(){const t=s.map(n=>`${n.label}: ${i[n.key]?.value||""}`).join(`
`);t.replace(/\s/g,"")&&navigator.clipboard.writeText(t).then(()=>{const n=o.innerHTML;o.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg> ¡Copiados!',o.classList.add("!text-emerald-400"),setTimeout(()=>{o.innerHTML=n,o.classList.remove("!text-emerald-400")},2e3)})}p.addEventListener("input",d);o.addEventListener("click",h);w();d();
