/**
 * ErrorRow — fila de tabla con campos editables para corregir errores de un registro.
 */
function ErrorRow({ row, onFieldChange, onRetry, corrected }) {
  return (
    <tr>
      {/* Columna ID (row number) */}
      <td className="table__td-id">
        {row.row}
      </td>

      {/* Columna Name */}
      <td style={{ padding: 0 }}>
        <div className="table-cell">
          <input
            type="text"
            value={row.values.name}
            onChange={(e) => onFieldChange(row.row, 'name', e.target.value)}
            className={`table-cell__input${row.details?.name ? ' table-cell__input--error' : ''}`}
            aria-label={`Name fila ${row.row}`}
          />
          {row.details?.name && (
            <div className="table-cell__error">{row.details.name}</div>
          )}
        </div>
      </td>

      {/* Columna Email */}
      <td style={{ padding: 0 }}>
        <div className="table-cell">
          <input
            type="text"
            value={row.values.email}
            onChange={(e) => onFieldChange(row.row, 'email', e.target.value)}
            className={`table-cell__input${row.details?.email ? ' table-cell__input--error' : ''}`}
            aria-label={`Email fila ${row.row}`}
          />
          {row.details?.email && (
            <div className="table-cell__error">{row.details.email}</div>
          )}
        </div>
      </td>

      {/* Columna Age */}
      <td style={{ padding: 0 }}>
        <div className="table-cell">
          <input
            type="text"
            value={row.values.age}
            onChange={(e) => onFieldChange(row.row, 'age', e.target.value)}
            className={`table-cell__input${row.details?.age ? ' table-cell__input--error' : ''}`}
            aria-label={`Age fila ${row.row}`}
          />
          {row.details?.age && (
            <div className="table-cell__error">{row.details.age}</div>
          )}
        </div>
      </td>

      {/* Columna acción */}
      <td className="table__td-action">
        <button
          className={`btn-sm ${corrected ? 'btn-ok' : 'btn-retry'}`}
          onClick={() => onRetry(row.row)}
        >
          {corrected ? 'Correcto' : 'Reintentar'}
        </button>
      </td>
    </tr>
  );
}

export default ErrorRow;
