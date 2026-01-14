const tabla = document.getElementById("tablaPartidos");
const form = document.getElementById("quinielaForm");
const resultado = document.getElementById("resultado");

// Cargar partidos
fetch("data/partidos.json")
  .then(res => res.json())
  .then(partidos => {
    partidos.forEach(p => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${p.local} vs ${p.visita}</td>
        <td><input type="radio" name="p${p.id}" value="L" required></td>
        <td><input type="radio" name="p${p.id}" value="E"></td>
        <td><input type="radio" name="p${p.id}" value="V"></td>
      `;
      tabla.appendChild(fila);
    });
  });

// Guardar pronóstico
form.addEventListener("submit", e => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const datos = { nombre, pronosticos: {} };

  document.querySelectorAll("input[type=radio]:checked").forEach(r => {
    datos.pronosticos[r.name] = r.value;
  });

  localStorage.setItem("quiniela_" + nombre, JSON.stringify(datos, null, 2));
  resultado.textContent = JSON.stringify(datos, null, 2);

  alert("Pronóstico guardado localmente");
});