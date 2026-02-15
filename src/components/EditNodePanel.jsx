import { useState, useEffect } from 'react';
import { NODE_TYPE_OPTIONS } from '../constants/nodeTypes';

export default function EditNodePanel({ node, onUpdate, onClose, onDelete }) {
  const [label, setLabel] = useState('');
  const [nodeType, setNodeType] = useState('place');
  const [icon, setIcon] = useState('');

  useEffect(() => {
    if (node?.data) {
      setLabel(node.data.label ?? '');
      setNodeType(node.data.nodeType ?? 'place');
      setIcon(node.data.icon ?? (NODE_TYPE_OPTIONS.find((o) => o.value === (node.data.nodeType ?? 'place'))?.icon ?? ''));
    }
  }, [node?.id, node?.data?.label, node?.data?.nodeType, node?.data?.icon]);

  if (!node) return null;

  const handleSave = () => {
    onUpdate(node.id, { label, nodeType, icon: icon || undefined });
    onClose();
  };

  return (
    <div className="edit-panel edit-panel--node">
      <h3 className="edit-panel__title">Edytuj ośrodek</h3>

      <label className="edit-panel__field">
        <span>Typ ośrodka</span>
        <select
          value={nodeType}
          onChange={(e) => {
            const opt = NODE_TYPE_OPTIONS.find((o) => o.value === e.target.value);
            setNodeType(e.target.value);
            if (opt && !icon) setIcon(opt.icon);
          }}
        >
          {NODE_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.icon} {opt.label}
            </option>
          ))}
        </select>
      </label>

      <label className="edit-panel__field">
        <span>Nazwa</span>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Nazwa węzła"
        />
      </label>

      <label className="edit-panel__field">
        <span>Ikona (emoji lub znak)</span>
        <input
          type="text"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          placeholder="np. ⚔️ 🏰"
          maxLength={4}
        />
      </label>

      <div className="edit-panel__actions">
        <button type="button" className="edit-panel__btn edit-panel__btn--danger" onClick={onDelete}>
          Usuń
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
