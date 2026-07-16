/**
 * csvService - /api/upload y revalidación
 */

/** Utilidad para simular latencia de red. */
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Lee el contenido de un archivo como texto.
 */
function readFileAsText(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsText(file);
  });
}

/**
 * Parsea texto CSV a un array de objetos con campos id, name, email, age.
 * Espera formato: id,name,email,age
 */
function parseCsv(text) {
  const lines = text.trim().split("\n");
  const start = lines[0].toLowerCase().includes("id") ? 1 : 0;

  return lines.slice(start).map((line, index) => {
    const [id, name, email, age] = line.split(",").map((v) => v.trim());
    return {
      id: id || String(start + index + 1),
      name: name || "",
      email: email || "",
      age: age || "",
    };
  });
}

/**
 * Valida un registro individual y retorna los errores encontrados.
 * Retorna null si el registro es válido.
 */
function validateRecord(record) {
  const errors = {};

  if (!record.name || record.name.trim() === "") {
    errors.name = "No puede estar vacío.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!record.email || record.email.trim() === "") {
    errors.email = "No puede estar vacío.";
  } else if (!emailRegex.test(record.email.trim())) {
    errors.email = "El formato de 'email' es inválido.";
  }

  if (!record.age || record.age.trim() === "") {
    errors.age = "No puede estar vacío.";
  } else if (
    isNaN(Number(record.age.trim())) ||
    Number(record.age.trim()) <= 0
  ) {
    errors.age = "El formato de 'edad' es inválido.";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

/**
 * Simula POST /api/upload
 * Recibe un archivo CSV, lo parsea y retorna la respuesta con
 * registros exitosos y registros con errores.
 */
export async function apiUpload(file) {
  const text = await readFileAsText(file);
  const records = parseCsv(text);

  const successList = [];
  const errorList = [];

  records.forEach((record) => {
    const details = validateRecord(record);
    if (details) {
      errorList.push({
        row: Number(record.id),
        details,
        // Guardamos los valores originales para editarlos en la UI
        values: {
          name: record.name,
          email: record.email,
          age: record.age,
        },
      });
    } else {
      successList.push({
        id: Number(record.id),
        name: record.name,
        email: record.email.trim(),
        age: Number(record.age),
      });
    }
  });

  await delay(600);

  return {
    ok: true,
    data: {
      success: successList,
      errors: errorList,
    },
  };
}

/**
 * Simula POST /api/retry — revalida un registro corregido.
 * Retorna respuesta exitosa si los datos son válidos.
 */
export async function apiRetry(record) {
  await delay(300);

  const details = validateRecord(record);

  if (details) {
    return {
      ok: false,
      error: details,
    };
  }

  return {
    ok: true,
    data: {
      id: Number(record.id),
      name: record.name.trim(),
      email: record.email.trim(),
      age: Number(record.age),
    },
  };
}

/**
 * Simula POST /api/save — guarda los usuarios en la base de datos.
 */
export async function apiSave() {
  await delay(500);
  return { ok: true };
}
