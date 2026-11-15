var e=[{key:`camel`,label:`camelCase`,fn:(e,t)=>c(t)},{key:`pascal`,label:`PascalCase`,fn:(e,t)=>l(t)},{key:`snake`,label:`snake_case`,fn:(e,t)=>u(t,`_`)},{key:`kebab`,label:`kebab-case`,fn:(e,t)=>u(t,`-`)},{key:`constant`,label:`CONSTANT_CASE`,fn:(e,t)=>d(t)},{key:`dot`,label:`dot.case`,fn:(e,t)=>u(t,`.`)},{key:`path`,label:`path/case`,fn:(e,t)=>u(t,`/`)},{key:`train`,label:`Train-Case`,fn:(e,t)=>f(t)},{key:`lower`,label:`lower`,fn:e=>a(e).toLowerCase()},{key:`upper`,label:`UPPER`,fn:e=>a(e).toUpperCase()},{key:`title`,label:`Title Case`,fn:(e,t)=>p(t)},{key:`sentence`,label:`Sentence case`,fn:e=>m(a(e))}],t=document.getElementById(`text-input`),n=document.getElementById(`transforms-grid`),r=document.getElementById(`copy-all-btn`),i={};function a(e){return e==null?``:String(e)}function o(e){let t=a(e).replace(/[_\-.\/]+/g,` `).replace(/([a-z0-9])([A-Z])/g,`$1 $2`).replace(/([A-Z]+)([A-Z][a-z])/g,`$1 $2`).trim();return t?t.split(/\s+/).map(e=>e.toLowerCase()):[]}function s(e){return e?e[0].toUpperCase()+e.slice(1):``}function c(e){return e.length?e[0]+e.slice(1).map(s).join(``):``}function l(e){return e.map(s).join(``)}function u(e,t){return e.join(t)}function d(e){return e.map(e=>e.toUpperCase()).join(`_`)}function f(e){return e.map(s).join(`-`)}function p(e){return e.map(s).join(` `)}function m(e){let t=e.trim();if(!t)return``;let n=t.toLowerCase();return n[0].toUpperCase()+n.slice(1)}function h(){n.innerHTML=e.map(e=>`
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
        `).join(``),e.forEach(e=>{i[e.key]=document.getElementById(`output-${e.key}`)}),n.querySelectorAll(`.copy-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=i[e.getAttribute(`data-key`)||``]?.value||``;t&&navigator.clipboard.writeText(t).then(()=>{let t=e.innerHTML;e.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg> ¡Listo!`,e.classList.add(`!text-emerald-400`),setTimeout(()=>{e.innerHTML=t,e.classList.remove(`!text-emerald-400`)},2e3)})})})}function g(){let n=a(t.value),r=o(n);e.forEach(e=>{let t=i[e.key];if(t)try{t.value=n.trim()===``?``:e.fn(n,r)}catch{t.value=``}})}function _(){let t=e.map(e=>`${e.label}: ${i[e.key]?.value||``}`).join(`
`);t.replace(/\s/g,``)&&navigator.clipboard.writeText(t).then(()=>{let e=r.innerHTML;r.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg> ¡Copiados!`,r.classList.add(`!text-emerald-400`),setTimeout(()=>{r.innerHTML=e,r.classList.remove(`!text-emerald-400`)},2e3)})}t.addEventListener(`input`,g),r.addEventListener(`click`,_),h(),g();