import { useState, useEffect } from 'react';

export default function EditEdgePanel({ edge, onUpdate, onClose, onDelete }) {
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (edge?.data) {
      setLabel(edge.data.label ?? '');
    }
  }, [edge?.id, edge?.data?.label]);

  if (!edge) return null;

  const handleSave = () => {
    onUpdate(edge.id, { label });
    onClose();
  };

  return (
    <div className="edit-panel edit-panel--edge">
      <h3 className="edit-panel__title">Edytuj połączenie (relacja)</h3>

      <label className="edit-panel__field">
        <span>Opis relacji</span>
        <textarea
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Krótki komentarz opisujący relację między ośrodkami"
          rows={3}
        />
      </label>

      <div className="edit-panel__actions">
        <button type="button" className="edit-panel__btn edit-panel__btn--danger" onClick={onDelete}>
          Usuń połączenie
        </button>
        <button type="button" className="edit-panel__btn" onClick={onClose}>
          Anuluj
        </button>
        <button type="button" className="edit-panel__btn edit-panel__btn--primary" onClick={handleSave}>
          Zapisz
        </button>
      </div>
    </div>
  );
}
