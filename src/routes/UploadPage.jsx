import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../services/authService';
import { apiUpload } from '../services/csvService';

/**
 * UploadPage — formulario de carga de archivos CSV.
 * Envía el archivo al endpoint simulado /api/upload y navega a resultados.
 */
function UploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const user = getUser();

  const [selectedFile, setSelectedFile] = useState(null);
  const [processing, setProcessing] = useState(false);

  function handleSelectFile() {
    fileInputRef.current.click();
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  }

  async function handleValidate() {
    if (!selectedFile) return;

    setProcessing(true);

    // Enviar archivo al endpoint simulado
    const response = await apiUpload(selectedFile);

    if (response.ok) {
      navigate('/results', { state: { data: response.data } });
    }

    setProcessing(false);
  }

  return (
    <main className="page-center">
      <div className="card">
        {/* Encabezado */}
        <div>
          <h1 className="title">Validador de Datos</h1>
          <p className="subtitle">{user?.name || 'Admin'}</p>
        </div>

        {/* Instrucción */}
        <p className="upload-instruction" style={{ marginTop: 20 }}>
          Solo se permiten archivos CSV con la estructura:{' '}
          <strong>id, name, email, age</strong>
        </p>

        {/* Input de archivo oculto */}
        <input
          id="file-input"
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="sr-only"
          onChange={handleFileChange}
        />

        {/* Botón para seleccionar archivo */}
        <button
          id="select-file-btn"
          type="button"
          className="btn-secondary"
          onClick={handleSelectFile}
        >
          Seleccionar archivo
        </button>

        {/* Nombre del archivo */}
        <p className="upload-file-name">
          {selectedFile ? selectedFile.name : 'Ningún archivo seleccionado'}
        </p>

        {/* Botón validar o estado de procesamiento */}
        {processing ? (
          <p className="upload-status">Finalizando...</p>
        ) : (
          <button
            id="validate-btn"
            type="button"
            className="btn-primary"
            onClick={handleValidate}
            disabled={!selectedFile}
          >
            Validar datos
          </button>
        )}
      </div>
    </main>
  );
}

export default UploadPage;
