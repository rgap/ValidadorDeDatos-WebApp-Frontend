import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ErrorRow from "../components/ErrorRow";
import { getUser } from "../services/authService";
import { apiRetry, apiSave } from "../services/csvService";

/**
 * ResultsPage — muestra los resultados de la validación del CSV.
 * Para editar registros con errores y reenviarlos al endpoint simulado /api/retry.
 */
function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  // Datos recibidos del endpoint /api/upload
  const responseData = location.state?.data ?? { success: [], errors: [] };

  const [rows, setRows] = useState(
    responseData.errors.map((e) => ({ ...e, corrected: false })),
  );
  const [saved, setSaved] = useState(false);

  /**
   * Actualiza el valor de un campo en una fila específica.
   */
  function handleFieldChange(rowId, field, value) {
    setRows((prev) =>
      prev.map((r) => {
        if (r.row !== rowId) return r;
        return {
          ...r,
          values: { ...r.values, [field]: value },
          corrected: false,
        };
      }),
    );
  }

  /**
   * Reenvía un registro al endpoint simulado /api/retry.
   * Si la fila ya está marcada como correcta, la elimina de la lista.
   */
  async function handleRetry(rowId) {
    const row = rows.find((r) => r.row === rowId);
    if (!row) return;

    // Si ya está corregida, aceptar y eliminar de la lista
    if (row.corrected) {
      setRows((prev) => prev.filter((r) => r.row !== rowId));
      return;
    }

    // Enviar al endpoint simulado
    const response = await apiRetry({
      id: String(row.row),
      name: row.values.name,
      email: row.values.email,
      age: row.values.age,
    });

    if (response.ok) {
      // Registro válido — marcar como correcto
      setRows((prev) =>
        prev.map((r) =>
          r.row === rowId ? { ...r, details: null, corrected: true } : r,
        ),
      );
    } else {
      // Actualizar errores del registro
      setRows((prev) =>
        prev.map((r) =>
          r.row === rowId ? { ...r, details: response.error } : r,
        ),
      );
    }
  }

  /**
   * Simula guardar los usuarios en la base de datos.
   */
  async function handleSave() {
    await apiSave();
    setSaved(true);
  }

  function handleNewFile() {
    navigate("/");
  }

  const allCorrected = rows.length === 0 || rows.every((r) => r.corrected);

  console.log("--- ResultsPage Render ---");
  console.log("Rows count:", rows.length);
  console.log("All corrected?:", allCorrected);
  console.log("Rows:", rows);

  return (
    <main className="page-center">
      <div className="wide-card">
        {/* Encabezado */}
        <div className="results-header">
          <div className="results-brand">
            <h1>Validador de Datos</h1>
            <p>{user?.name || "Admin"}</p>
          </div>
          <button
            id="new-file-btn"
            type="button"
            className="btn-outline-sm"
            onClick={handleNewFile}
          >
            Validar otro archivo
          </button>
        </div>

        {/* Título de sección */}
        <h2 className="results-section-title">Registros con Errores</h2>
        <p className="results-section-desc">
          Edite los valores incorrectos directamente en los campos y haga clic
          en "Reintentar" para revalidar.
        </p>

        {/* Tabla de errores */}
        <table className="table" aria-label="Registros con errores">
          <thead>
            <tr>
              <th>App</th>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="table__empty">
                  ¡Todos los registros han sido corregidos y validados!
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <ErrorRow
                  key={row.row}
                  row={row}
                  onFieldChange={handleFieldChange}
                  onRetry={handleRetry}
                  corrected={row.corrected}
                />
              ))
            )}
          </tbody>
        </table>

        {/* Pie con acción de guardar */}
        <div className="results-footer">
          {saved ? (
            <button id="saved-btn" type="button" className="btn-saved" disabled>
              ¡Usuarios guardados con éxito!
            </button>
          ) : (
            <button
              id="load-btn"
              type="button"
              className="btn-load"
              onClick={handleSave}
              disabled={!allCorrected}
            >
              Cargar usuarios a la base de datos
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

export default ResultsPage;
