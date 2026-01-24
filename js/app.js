const JORNADA_ACTUAL = "Jornada4.json"; // CAMBIA AQUÍ LA JORNADA

const tabla = document.getElementById("tablaPartidos");
const form = document.getElementById("quinielaForm");
const resultado = document.getElementById("resultado");
const btnDescargar = document.getElementById("descargar");

let partidosGlobal = [];

// Cargar jornada
fetch("data/" + JORNADA_ACTUAL)
  .then(res => res.json())
  .then(data => {

    partidosGlobal = data.partidos;

    // Mostrar info de jornada
    document.getElementById("tituloJornada").textContent =
      `${data.liga} – Jornada ${data.jornada}`;

    const fechaLimite = new Date(data.fechaLimite);
    document.getElementById("fechaLimite").textContent =
      "Fecha límite: " + fechaLimite.toLocaleString();

    // Bloquear si ya pasó la fecha
    const ahora = new Date();
    if (ahora > fechaLimite) {
      document.getElementById("fechaLimite").textContent += " (CERRADA)";
      bloquearFormulario();
      alert("La quiniela está cerrada");
    }

    // Cargar partidos
    data.partidos.forEach(p => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${p.local} vs ${p.visita}</td>
        <td><input type="radio" name="p${p.id}" value="L" required></td>
        <td><input type="radio" name="p${p.id}" value="E"></td>
        <td><input type="radio" name="p${p.id}" value="V"></td>
      `;
      tabla.appendChild(fila);
    });

  })
  .catch(err => {
    console.error("Error cargando jornada:", err);
    alert("Error cargando la jornada");
  });

// Guardar quiniela
form.addEventListener("submit", e => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  if (!nombre) {
    alert("Escribe tu nombre");
    return;
  }

  const datos = {
    nombre: nombre,
    jornada: JORNADA_ACTUAL,
    fecha: new Date().toISOString(),
    pronosticos: {}
  };

  document.querySelectorAll("input[type=radio]:checked").forEach(r => {
    datos.pronosticos[r.name] = r.value;
  });

  localStorage.setItem("quiniela_" + nombre, JSON.stringify(datos));

  mostrarResumen(datos);
  prepararDescarga(datos);
  bloquearFormulario();
});

// Mostrar resumen bonito
function mostrarResumen(datos) {
  let html = `<h3>Gracias, ${datos.nombre}</h3><ul>`;

  for (let p in datos.pronosticos) {
    const id = parseInt(p.replace("p", ""));
    const partido = partidosGlobal.find(x => x.id === id);

    let texto = "";
    if (datos.pronosticos[p] === "L") texto = partido.local;
    if (datos.pronosticos[p] === "E") texto = "Empate";
    if (datos.pronosticos[p] === "V") texto = partido.visita;

    html += `<li>${partido.local} vs ${partido.visita} → <strong>${texto}</strong></li>`;
  }

  html += "</ul>";
  resultado.innerHTML = html;
}

// Preparar archivo descargable
function prepararDescarga(datos) {
  const blob = new Blob([JSON.stringify(datos, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  btnDescargar.style.display = "inline-block";
  btnDescargar.href = url;
  btnDescargar.download = `quiniela_${datos.nombre}.json`;
  btnDescargar.textContent = "Descargar mi quiniela";
}

// Bloquear formulario
function bloquearFormulario() {
  document.querySelectorAll("input").forEach(i => i.disabled = true);
  document.querySelector("button[type=submit]").disabled = true;
}
