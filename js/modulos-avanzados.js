/* Calculadoras interactivas de los módulos 7 al 14.
   Cada módulo trabaja con familias concretas de integrales y muestra el procedimiento algebraico. */
(() => {
  const $ = (id) => document.getElementById(id);
  const num = (id, fallback) => {
    const value = Number($(id)?.value);
    return Number.isFinite(value) ? value : fallback;
  };
  const fmt = (n) => Number(n.toFixed(5)).toString();
  const show = (html) => { $("resultadoAvanzado").innerHTML = html; };
  const error = (message) => show('<p class="error-calculo">' + message + '</p>');
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
      result += "<p><strong>Idea:</strong> u = " + fmt(k) + "x + " + fmt(c) + "; du = " + fmt(k) + " dx. Se transforma la integral a una potencia de u.</p>";
    } else if (module === 8) {
      const A=p1, k=p2;
      if (type === "exp") {
        if (k===0) return error("El exponente debe tener una constante k distinta de cero.");
        result = "∫ " + fmt(A) + "e^(" + fmt(k) + "x) dx = (" + fmt(A/k) + ")e^(" + fmt(k) + "x) + C";
      } else {
        if (k<=0 || k===1) return error("La base debe ser positiva y diferente de 1.");
        result = "∫ " + fmt(A) + "(" + fmt(k) + ")^x dx = (" + fmt(A/Math.log(k)) + ")(" + fmt(k) + ")^x + C";
      }
      result += "<p><strong>Idea:</strong> la derivada de la función exponencial es proporcional a ella misma.</p>";
    } else if (module === 9) {
      const k=p1;
      if (type==="base" && (k<=0 || k===1)) return error("La base del logaritmo debe ser positiva y diferente de 1.");
      result = type==="ln" ? "∫ ln(x) dx = x ln(x) − x + C,  (x > 0)" : "∫ log_" + fmt(k) + "(x) dx = [x ln(x) − x]/ln(" + fmt(k) + ") + C";
      result += "<p><strong>Por partes:</strong> u = ln(x), dv = dx; entonces du = dx/x y v = x.</p>";
    } else if (module === 10) {
      const A=p1, k=p2;
      if (k===0) return error("El argumento trigonométrico debe tener coeficiente distinto de cero.");
      const formulas = {
        sin: "−(" + fmt(A/k) + ") cos(" + fmt(k) + "x) + C",
        cos: "(" + fmt(A/k) + ") sin(" + fmt(k) + "x) + C",
        sec2: "(" + fmt(A/k) + ") tan(" + fmt(k) + "x) + C",
        csc2: "−(" + fmt(A/k) + ") cot(" + fmt(k) + "x) + C",
        sectan: "(" + fmt(A/k) + ") sec(" + fmt(k) + "x) + C",
        csccot: "−(" + fmt(A/k) + ") csc(" + fmt(k) + "x) + C"
      };
      const names={sin:"sin",cos:"cos",sec2:"sec²",csc2:"csc²",sectan:"sec·tan",csccot:"csc·cot"};
      result = "∫ " + fmt(A) + " " + names[type] + "(" + fmt(k) + "x) dx = " + formulas[type];
      result += "<p><strong>Idea:</strong> se aplica la antiderivada trigonométrica y se compensa el coeficiente interno k.</p>";
    } else if (module === 11) {
      const a=Math.abs(p1)||1;
      if (type==="asin") result="∫ dx/√(" + fmt(a*a) + " − x²) = arcsin(x/" + fmt(a) + ") + C";
      else if (type==="atan") result="∫ dx/(" + fmt(a*a) + " + x²) = (1/" + fmt(a) + ") arctan(x/" + fmt(a) + ") + C";
      else result="∫ dx/[x√(x² − " + fmt(a*a) + ")] = (1/" + fmt(a) + ") arcsec(|x|/" + fmt(a) + ") + C";
      result += "<p><strong>Reconocimiento:</strong> compara el integrando con las formas estándar de las derivadas de arcsin, arctan o arcsec.</p>";
    } else if (module === 12) {
      const a=Math.abs(p1)||1;
      if (type==="asinh") result="∫ dx/√(x² + " + fmt(a*a) + ") = asinh(x/" + fmt(a) + ") + C";
      else if (type==="acosh") result="∫ dx/√(x² − " + fmt(a*a) + ") = acosh(x/" + fmt(a) + ") + C  (x > " + fmt(a) + ")";
      else result="∫ dx/(" + fmt(a*a) + " − x²) = (1/" + fmt(2*a) + ") ln|( " + fmt(a) + " + x)/( " + fmt(a) + " − x)| + C";
      result += "<p><strong>Idea:</strong> estas formas se relacionan con las funciones hiperbólicas inversas y sus derivadas.</p>";
    } else if (module === 13) {
      const a=p1,b=p2,c=p3, delta=b*b-4*a*c;
      if (a===0) return error("El coeficiente de x² (a) debe ser distinto de cero.");
      if (Math.abs(delta)<1e-10) result="∫ dx/(" + fmt(a) + "x² + " + fmt(b) + "x + " + fmt(c) + ") = −2/(2(" + fmt(a) + ")x + " + fmt(b) + ") + C";
      else if (delta<0) result="∫ dx/(" + fmt(a) + "x² + " + fmt(b) + "x + " + fmt(c) + ") = 2/√(" + fmt(-delta) + ") arctan((2(" + fmt(a) + ")x + " + fmt(b) + ")/√(" + fmt(-delta) + ")) + C";
      else result="∫ dx/(" + fmt(a) + "x² + " + fmt(b) + "x + " + fmt(c) + ") = (1/√(" + fmt(delta) + ")) ln|(2(" + fmt(a) + ")x + " + fmt(b) + " − √(" + fmt(delta) + "))/(2(" + fmt(a) + ")x + " + fmt(b) + " + √(" + fmt(delta) + "))| + C";
      result += "<p><strong>Discriminante:</strong> Δ = b² − 4ac = " + fmt(delta) + ". El signo de Δ determina si aparece arctan, logaritmo o una fracción racional.</p>";
    } else if (module === 14) {
      const A=p1;
      const choices={
        xexp:"∫ " + fmt(A) + "x e^x dx = " + fmt(A) + "e^x(x − 1) + C",
        xsin:"∫ " + fmt(A) + "x sin(x) dx = " + fmt(A) + "(−x cos(x) + sin(x)) + C",
        xcos:"∫ " + fmt(A) + "x cos(x) dx = " + fmt(A) + "(x sin(x) + cos(x)) + C",
        xln:"∫ " + fmt(A) + "x ln(x) dx = " + fmt(A) + "[(x²/2)ln(x) − x²/4] + C"
      };
      result=choices[type] + "<p><strong>Integración por partes:</strong> ∫u dv = uv − ∫v du. Se elige u = x (o ln x) y dv como el factor restante.</p>";
    }
    show('<div class="resultado-formula"><strong>Resultado:</strong><p>' + result + '</p></div>');
  };
  document.addEventListener("DOMContentLoaded", () => {
    $("btnResolver")?.addEventListener("click", run);
    $("tipoIntegral")?.addEventListener("change", () => {
      const module=Number(document.body.dataset.module);
      $("param4Wrap")?.classList.toggle("oculto", module!==7);
    });
    run();
  });
})();