/* Calculadoras y gráficas interactivas de los módulos 7 al 14. */
(() => {
  const $ = (id) => document.getElementById(id);
  const num = (id, fallback) => {
    const value = Number($(id)?.value);
    return Number.isFinite(value) ? value : fallback;
  };
  const fmt = (n) => Number(n.toFixed(5)).toString();
  const show = (html) => { $("resultadoAvanzado").innerHTML = html; };
  const error = (message) => show('<p class="error-calculo">' + message + '</p>');
  const integralValue = (x, module, type, p1, p2, p3, p4) => {
    const A=p1, k=p2, c=p3, n=p4;
    let y;
    if (module===7) {
      const u=k*x+c;
      if (Math.abs(u)<1e-9 && (type==="log" || n<0)) return null;
      y=A*Math.pow(u,type==="log"?-1:n);
    } else if (module===8) y=type==="exp" ? A*Math.exp(k*x) : A*Math.pow(k,x);
    else if (module===9) y=type==="ln" ? Math.log(x) : Math.log(x)/Math.log(p1);
    else if (module===10) {
      const u=k*x;
      if(type==="sin") y=A*Math.sin(u);
      else if(type==="cos") y=A*Math.cos(u);
      else if(type==="sec2") y=A/Math.pow(Math.cos(u),2);
      else if(type==="csc2") y=A/Math.pow(Math.sin(u),2);
      else if(type==="sectan") y=A*Math.tan(u)/Math.cos(u);
      else y=A*Math.cos(u)/Math.pow(Math.sin(u),2);
    } else if (module===11) {
      const a=p1;
      if(type==="asin") y=1/Math.sqrt(a*a-x*x);
      else if(type==="atan") y=1/(a*a+x*x);
      else y=1/(x*Math.sqrt(x*x-a*a));
    } else if (module===12) {
      const a=p1;
      if(type==="asinh") y=1/Math.sqrt(x*x+a*a);
      else if(type==="acosh") y=1/Math.sqrt(x*x-a*a);
      else y=1/(a*a-x*x);
    } else if (module===13) y=1/(p1*x*x+p2*x+p3);
    else if (module===14) {
      if(type==="xexp") y=A*x*Math.exp(x);
      else if(type==="xsin") y=A*x*Math.sin(x);
      else if(type==="xcos") y=A*x*Math.cos(x);
      else y=A*x*Math.log(x);
    }
    return Number.isFinite(y) && Math.abs(y)<1e6 ? y : null;
  };
  const drawGraph = () => {
    const target=$("graficaModulo");
    if(!target || typeof Plotly==="undefined") return;
    const module=Number(document.body.dataset.module), type=$("tipoIntegral").value;
    const p1=num("param1",1), p2=num("param2",1), p3=num("param3",0), p4=num("param4",2);
    let min=-5, max=5;
    if(module===9 || (module===14 && type==="xln")) min=0.05;
    if(module===11 && type==="asin") { min=-p1*0.999; max=p1*0.999; }
    if(module===11 && type==="arcsec") { min=-5*p1; max=5*p1; }
    if(module===12 && type==="acosh") min=p1+0.03;
    if(module===13) {
      const d=p2*p2-4*p1*p3;
      if(p1!==0 && d>=0) {
        const r1=(-p2-Math.sqrt(d))/(2*p1), r2=(-p2+Math.sqrt(d))/(2*p1);
        min=Math.min(-5,r1-1,r2-1); max=Math.max(5,r1+1,r2+1);
      }
    }
    const xs=[], ys=[], fillX=[], fillY=[];
    const count=501, left=min, right=max;
    for(let i=0;i<count;i++){
      const x=left+(right-left)*i/(count-1);
      let y=integralValue(x,module,type,p1,p2,p3,p4);
      if(module===7 && type==="power" && p4%1!==0 && (p2*x+p3)<0) y=null;
      if(module===9 && x<=0) y=null;
      if(module===11 && type==="asin" && Math.abs(x)>=p1) y=null;
      if(module===11 && type==="arcsec" && Math.abs(x)<=p1) y=null;
      if(module===12 && type==="acosh" && x<=p1) y=null;
      if(module===12 && type==="atanh" && Math.abs(x)>=p1) y=null;
      if(module===13 && Math.abs(p1*x*x+p2*x+p3)<0.025) y=null;
      if(module===10 && (type==="sec2" || type==="sectan") && Math.abs(Math.cos(p2*x))<0.035) y=null;
      if(module===10 && (type==="csc2" || type==="csccot") && Math.abs(Math.sin(p2*x))<0.035) y=null;
      xs.push(x); ys.push(y);
      if(x>=Math.max(left,-2) && x<=Math.min(right,2)){fillX.push(x);fillY.push(y);}
    }
    const traces=[
      {x:fillX,y:fillY,type:"scatter",mode:"lines",name:"Integrando (área sombreada)",line:{color:"#0b6e99",width:2},fill:"tozeroy",fillcolor:"rgba(0,110,153,0.16)",connectgaps:false},
      {x:xs,y:ys,type:"scatter",mode:"lines",name:"f(x)",line:{color:"#004b87",width:2.5},connectgaps:false}
    ];
    const layout={title:{text:"Gráfica del integrando"},paper_bgcolor:"#ffffff",plot_bgcolor:"#ffffff",font:{family:"Arial, sans-serif",color:"#334155"},margin:{l:55,r:20,t:55,b:50},xaxis:{title:"x",zeroline:true,gridcolor:"#e2e8f0"},yaxis:{title:"f(x)",zeroline:true,gridcolor:"#e2e8f0",rangemode:"tozero"},legend:{orientation:"h",y:-0.22},autosize:true};
    Plotly.react(target,traces,layout,{responsive:true,displaylogo:false});
  };
  const run = () => {
    const module = Number(document.body.dataset.module);
    const type = $("tipoIntegral").value;
    const p1 = num("param1", 1), p2 = num("param2", 1), p3 = num("param3", 0);
    let result = "";
    if (module === 7) {
      const A=p1, k=p2, c=p3, n=type==="log" ? -1 : num("param4",2);
      if (k === 0) return error("El coeficiente de x dentro del paréntesis no puede ser cero.");
      if (n === -1) result = "∫ " + fmt(A) + "/(" + fmt(k) + "x + " + fmt(c) + ") dx = (" + fmt(A/k) + ") ln|" + fmt(k) + "x + " + fmt(c) + "| + C";
      else result = "∫ " + fmt(A) + "(" + fmt(k) + "x + " + fmt(c) + ")^" + fmt(n) + " dx = (" + fmt(A/(k*(n+1))) + ")(" + fmt(k) + "x + " + fmt(c) + ")^" + fmt(n+1) + " + C";
      result += "<p><strong>Idea:</strong> u = " + fmt(k) + "x + " + fmt(c) + "; du = " + fmt(k) + " dx.</p>";
    } else if (module === 8) {
      const A=p1, k=p2;
      if (type === "exp") { if (k===0) return error("El exponente debe tener k distinto de cero."); result = "∫ " + fmt(A) + "e^(" + fmt(k) + "x) dx = (" + fmt(A/k) + ")e^(" + fmt(k) + "x) + C"; }
      else { if (k<=0 || k===1) return error("La base debe ser positiva y diferente de 1."); result = "∫ " + fmt(A) + "(" + fmt(k) + ")^x dx = (" + fmt(A/Math.log(k)) + ")(" + fmt(k) + ")^x + C"; }
      result += "<p><strong>Idea:</strong> la derivada de la función exponencial es proporcional a ella misma.</p>";
    } else if (module === 9) {
      const k=p1;
      if (type==="base" && (k<=0 || k===1)) return error("La base debe ser positiva y diferente de 1.");
      result = type==="ln" ? "∫ ln(x) dx = x ln(x) − x + C, (x > 0)" : "∫ log_" + fmt(k) + "(x) dx = [x ln(x) − x]/ln(" + fmt(k) + ") + C";
      result += "<p><strong>Por partes:</strong> u = ln(x), dv = dx.</p>";
    } else if (module === 10) {
      const A=p1, k=p2;
      if (k===0) return error("El argumento trigonométrico debe tener coeficiente distinto de cero.");
      const formulas={sin:"−("+fmt(A/k)+") cos("+fmt(k)+"x) + C",cos:"("+fmt(A/k)+") sin("+fmt(k)+"x) + C",sec2:"("+fmt(A/k)+") tan("+fmt(k)+"x) + C",csc2:"−("+fmt(A/k)+") cot("+fmt(k)+"x) + C",sectan:"("+fmt(A/k)+") sec("+fmt(k)+"x) + C",csccot:"−("+fmt(A/k)+") csc("+fmt(k)+"x) + C"};
      const names={sin:"sin",cos:"cos",sec2:"sec²",csc2:"csc²",sectan:"sec·tan",csccot:"csc·cot"};
      result="∫ "+fmt(A)+" "+names[type]+"("+fmt(k)+"x) dx = "+formulas[type]+"<p><strong>Idea:</strong> se aplica la antiderivada trigonométrica y se compensa k.</p>";
    } else if (module === 11) {
      const a=p1; if (!(a>0)) return error("El parámetro a debe ser positivo.");
      if(type==="asin") result="∫ dx/√("+fmt(a*a)+" − x²) = arcsin(x/"+fmt(a)+") + C";
      else if(type==="atan") result="∫ dx/("+fmt(a*a)+" + x²) = (1/"+fmt(a)+") arctan(x/"+fmt(a)+") + C";
      else result="∫ dx/[x√(x² − "+fmt(a*a)+")] = (1/"+fmt(a)+") arcsec(|x|/"+fmt(a)+") + C";
      result+="<p><strong>Reconocimiento:</strong> compara con las derivadas de arcsin, arctan o arcsec.</p>";
    } else if (module === 12) {
      const a=p1; if (!(a>0)) return error("El parámetro a debe ser positivo.");
      if(type==="asinh") result="∫ dx/√(x² + "+fmt(a*a)+") = asinh(x/"+fmt(a)+") + C";
      else if(type==="acosh") result="∫ dx/√(x² − "+fmt(a*a)+") = acosh(x/"+fmt(a)+") + C (x > "+fmt(a)+")";
      else result="∫ dx/("+fmt(a*a)+" − x²) = (1/"+fmt(2*a)+") ln|("+fmt(a)+" + x)/("+fmt(a)+" − x)| + C";
      result+="<p><strong>Idea:</strong> se reconocen derivadas de funciones hiperbólicas inversas.</p>";
    } else if (module === 13) {
      const a=p1,b=p2,c=p3,delta=b*b-4*a*c;
      if(a===0) return error("El coeficiente a debe ser distinto de cero.");
      if(Math.abs(delta)<1e-10) result="∫ dx/("+fmt(a)+"x² + "+fmt(b)+"x + "+fmt(c)+") = −2/(2("+fmt(a)+")x + "+fmt(b)+") + C";
      else if(delta<0) result="∫ dx/("+fmt(a)+"x² + "+fmt(b)+"x + "+fmt(c)+") = 2/√("+fmt(-delta)+") arctan((2("+fmt(a)+")x + "+fmt(b)+")/√("+fmt(-delta)+")) + C";
      else result="∫ dx/("+fmt(a)+"x² + "+fmt(b)+"x + "+fmt(c)+") = (1/√("+fmt(delta)+")) ln|(2("+fmt(a)+")x + "+fmt(b)+" − √("+fmt(delta)+"))/(2("+fmt(a)+")x + "+fmt(b)+" + √("+fmt(delta)+"))| + C";
      result+="<p><strong>Discriminante:</strong> Δ = "+fmt(delta)+". Su signo determina la forma de la antiderivada.</p>";
    } else if (module === 14) {
      const A=p1,choices={xexp:"∫ "+fmt(A)+"x e^x dx = "+fmt(A)+"e^x(x − 1) + C",xsin:"∫ "+fmt(A)+"x sin(x) dx = "+fmt(A)+"(−x cos(x) + sin(x)) + C",xcos:"∫ "+fmt(A)+"x cos(x) dx = "+fmt(A)+"(x sin(x) + cos(x)) + C",xln:"∫ "+fmt(A)+"x ln(x) dx = "+fmt(A)+"[(x²/2)ln(x) − x²/4] + C"};
      result=choices[type]+"<p><strong>Integración por partes:</strong> ∫u dv = uv − ∫v du.</p>";
    }
    show('<div class="resultado-formula"><strong>Resultado:</strong><p>' + result + '</p></div>');
    drawGraph();
  };
  document.addEventListener("DOMContentLoaded", () => {
    $("btnResolver")?.addEventListener("click", run);
    $("tipoIntegral")?.addEventListener("change", () => {
      const module=Number(document.body.dataset.module);
      $("param4Wrap")?.classList.toggle("oculto", module!==7);
      run();
    });
    document.querySelectorAll(".controles-calculo input").forEach(input=>input.addEventListener("input",drawGraph));
    run();
  });
})();