function actualizarGraficoRiemann() {
    const n = parseInt(document.getElementById('inputN').value) || 4;
    const tipo = document.getElementById('selectTipo').value;
    const a = 0;
    const b = 2;
    const dx = (b - a) / n;

    // Curva f(x) = x^2
    let xCurve = [];
    let yCurve = [];
    for (let x = a; x <= b; x += 0.01) {
        xCurve.push(x);
        yCurve.push(x * x);
    }

    let rectShapes = [];
    let sumaArea = 0;

    for (let i = 0; i < n; i++) {
        let xEval;
        let xStart = a + i * dx;
        let xEnd = a + (i + 1) * dx;

        if (tipo === 'izquierda') {
            xEval = xStart;
        } else if (tipo === 'derecha') {
            xEval = xEnd;
        } else {
            xEval = (xStart + xEnd) / 2;
        }

        let height = xEval * xEval;
        sumaArea += height * dx;

        // Dibujar rectángulo
        rectShapes.push({
            type: 'rect',
            xref: 'x',
            yref: 'y',
            x0: xStart,
            y0: 0,
            x1: xEnd,
            y1: height,
            fillcolor: 'rgba(0, 75, 135, 0.3)',
            line: {
                color: '#004b87',
                width: 1.5
            }
        });
    }

    const traceCurva = {
        x: xCurve,
        y: yCurve,
        mode: 'lines',
        name: 'f(x) = x²',
        line: { color: '#e74c3c', width: 3 }
    };

    const layout = {
        title: `Aproximación por Suma de Riemann (${tipo}) - n = ${n}`,
        xaxis: { title: 'x' },
        yaxis: { title: 'y' },
        shapes: rectShapes,
        margin: { t: 40, b: 40, l: 40, r: 20 }
    };

    Plotly.newPlot('graficoRiemann', [traceCurva], layout);

    document.getElementById('resultadoCalc').innerText =
        `Área aproximada (${tipo}): ${sumaArea.toFixed(4)} (Exacto: ${(8 / 3).toFixed(4)})`;
}

function actualizarGraficoTrapecio() {
    const n = parseInt(document.getElementById('inputN_trapecio').value) || 4;
    const a = 0;
    const b = 2;
    const dx = (b - a) / n;

    // Curva principal f(x) = x^2
    let xCurve = [];
    let yCurve = [];
    for (let x = a; x <= b; x += 0.01) {
        xCurve.push(x);
        yCurve.push(x * x);
    }

    let sumaTrapecio = 0;
    let trapecioShapes = [];

    for (let i = 0; i < n; i++) {
        let x0 = a + i * dx;
        let x1 = a + (i + 1) * dx;
        let y0 = x0 * x0;
        let y1 = x1 * x1;

        // Área del trapecio individual: ((y0 + y1) / 2) * dx
        sumaTrapecio += ((y0 + y1) / 2) * dx;

        // Dibujar forma del trapecio
        trapecioShapes.push({
            type: 'path',
            path: `M ${x0},0 L ${x0},${y0} L ${x1},${y1} L ${x1},0 Z`,
            fillcolor: 'rgba(46, 204, 113, 0.3)',
            line: {
                color: '#27ae60',
                width: 1.5
            }
        });
    }

    const traceCurva = {
        x: xCurve,
        y: yCurve,
        mode: 'lines',
        name: 'f(x) = x²',
        line: { color: '#e74c3c', width: 3 }
    };

    const layout = {
        title: `Aproximación por Regla del Trapecio - n = ${n}`,
        xaxis: { title: 'x' },
        yaxis: { title: 'y' },
        shapes: trapecioShapes,
        margin: { t: 40, b: 40, l: 40, r: 20 }
    };

    Plotly.newPlot('graficoTrapecio', [traceCurva], layout);

    document.getElementById('resultadoTrapecio').innerText =
        `Área aproximada (Trapecio): ${sumaTrapecio.toFixed(4)} (Valor Exacto: ${(8 / 3).toFixed(4)})`;
}

function actualizarGraficoPuntoMedio() {
    const n = parseInt(document.getElementById('inputN_medio').value) || 4;
    const a = 0;
    const b = 2;
    const dx = (b - a) / n;

    // Curva principal f(x) = x^2
    let xCurve = [];
    let yCurve = [];
    for (let x = a; x <= b; x += 0.01) {
        xCurve.push(x);
        yCurve.push(x * x);
    }

    let sumaMedio = 0;
    let rectShapes = [];
    let puntosMediosX = [];
    let puntosMediosY = [];

    for (let i = 0; i < n; i++) {
        let xStart = a + i * dx;
        let xEnd = a + (i + 1) * dx;
        let xMid = (xStart + xEnd) / 2;
        let height = xMid * xMid;

        sumaMedio += height * dx;

        puntosMediosX.push(xMid);
        puntosMediosY.push(height);

        // Rectángulo con altura evaluada en el punto medio
        rectShapes.push({
            type: 'rect',
            xref: 'x',
            yref: 'y',
            x0: xStart,
            y0: 0,
            x1: xEnd,
            y1: height,
            fillcolor: 'rgba(155, 89, 182, 0.3)',
            line: {
                color: '#8e44ad',
                width: 1.5
            }
        });
    }

    const traceCurva = {
        x: xCurve,
        y: yCurve,
        mode: 'lines',
        name: 'f(x) = x²',
        line: { color: '#e74c3c', width: 3 }
    };

    const tracePuntos = {
        x: puntosMediosX,
        y: puntosMediosY,
        mode: 'markers',
        name: 'Puntos Medios',
        marker: { color: '#8e44ad', size: 8 }
    };

    const layout = {
        title: `Aproximación por Punto Medio - n = ${n}`,
        xaxis: { title: 'x' },
        yaxis: { title: 'y' },
        shapes: rectShapes,
        margin: { t: 40, b: 40, l: 40, r: 20 }
    };

    Plotly.newPlot('graficoMedio', [traceCurva, tracePuntos], layout);

    document.getElementById('resultadoMedio').innerText =
        `Área aproximada (Punto Medio): ${sumaMedio.toFixed(4)} (Valor Exacto: ${(8 / 3).toFixed(4)})`;
}

function actualizarGraficoSimpson() {
    let n = parseInt(document.getElementById('inputN_simpson').value) || 4;

    // Forzar a que n sea par
    if (n % 2 !== 0) {
        n += 1;
        document.getElementById('inputN_simpson').value = n;
    }

    const a = 0;
    const b = 2;
    const dx = (b - a) / n;

    // Curva f(x) = x^2
    let xCurve = [];
    let yCurve = [];
    for (let x = a; x <= b; x += 0.01) {
        xCurve.push(x);
        yCurve.push(x * x);
    }

    // Cálculo por Regla de Simpson 1/3
    let sumaSimpson = (a * a) + (b * b); // f(a) + f(b)

    for (let i = 1; i < n; i++) {
        let x_i = a + i * dx;
        let y_i = x_i * x_i;
        if (i % 2 === 0) {
            sumaSimpson += 2 * y_i;
        } else {
            sumaSimpson += 4 * y_i;
        }
    }

    sumaSimpson = (dx / 3) * sumaSimpson;

    const traceCurva = {
        x: xCurve,
        y: yCurve,
        mode: 'lines',
        name: 'f(x) = x²',
        line: { color: '#e74c3c', width: 3 }
    };

    // Puntos de evaluación
    let xPuntos = [];
    let yPuntos = [];
    for (let i = 0; i <= n; i++) {
        let xVal = a + i * dx;
        xPuntos.push(xVal);
        yPuntos.push(xVal * xVal);
    }

    const tracePuntos = {
        x: xPuntos,
        y: yPuntos,
        mode: 'markers+lines',
        name: 'Aproximación Parabólica',
        line: { color: '#e67e22', dash: 'dash' },
        marker: { color: '#d35400', size: 7 }
    };

    const layout = {
        title: `Aproximación por Regla de Simpson (1/3) - n = ${n}`,
        xaxis: { title: 'x' },
        yaxis: { title: 'y' },
        margin: { t: 40, b: 40, l: 40, r: 20 }
    };

    Plotly.newPlot('graficoSimpson', [traceCurva, tracePuntos], layout);

    document.getElementById('resultadoSimpson').innerText =
        `Área aproximada (Simpson): ${sumaSimpson.toFixed(4)} (Valor Exacto: ${(8 / 3).toFixed(4)})`;
}

function actualizarGraficoArea() {
    const a = parseFloat(document.getElementById('inputA_area').value) || 0;
    const b = parseFloat(document.getElementById('inputB_area').value) || 2;

    // Curva principal f(x) = x^2
    let xCurve = [];
    let yCurve = [];
    let xFill = [a];
    let yFill = [0];

    let minX = Math.min(a, b) - 1;
    let maxX = Math.max(a, b) + 1;

    for (let x = minX; x <= maxX; x += 0.02) {
        let y = x * x;
        xCurve.push(x);
        yCurve.push(y);

        if (x >= a && x <= b) {
            xFill.push(x);
            yFill.push(y);
        }
    }

    xFill.push(b);
    yFill.push(0);

    const traceCurva = {
        x: xCurve,
        y: yCurve,
        mode: 'lines',
        name: 'f(x) = x²',
        line: { color: '#004b87', width: 3 }
    };

    const traceSombra = {
        x: xFill,
        y: yFill,
        fill: 'tozeroy',
        fillcolor: 'rgba(52, 152, 219, 0.4)',
        mode: 'none',
        name: 'Área Integrada'
    };

    const layout = {
        title: `Área exacta bajo f(x) = x² en [${a}, ${b}]`,
        xaxis: { title: 'x' },
        yaxis: { title: 'y' },
        margin: { t: 40, b: 40, l: 40, r: 20 }
    };

    Plotly.newPlot('graficoArea', [traceCurva, traceSombra], layout);

    // Antiderivada F(x) = x^3 / 3
    const areaExacta = (Math.pow(b, 3) / 3) - (Math.pow(a, 3) / 3);

    document.getElementById('resultadoArea').innerText =
        `Área Exacta ∫(${a} a ${b}) x² dx = ${areaExacta.toFixed(4)} u²`;
}

function calcularIntegralDirecta() {
    const a = parseFloat(document.getElementById('inputA_directa').value) || 1;
    const n = parseFloat(document.getElementById('inputN_directa').value);

    const divResultado = document.getElementById('resultadoDirecta');

    if (n === -1) {
        let coefText = a === 1 ? '' : (a === -1 ? '-' : a);
        divResultado.innerText = `Resultado: ∫ (${a} · x⁻¹) dx = ${coefText} ln|x| + C`;
    } else {
        const nuevoExp = n + 1;
        const nuevoCoef = a / nuevoExp;

        let coefFormatted = Number.isInteger(nuevoCoef) ? nuevoCoef : nuevoCoef.toFixed(3);
        if (coefFormatted == 1) coefFormatted = '';
        if (coefFormatted == -1) coefFormatted = '-';

        divResultado.innerText = `Resultado: ∫ (${a}x^${n}) dx = ${coefFormatted}x^${nuevoExp} + C`;
    }
}