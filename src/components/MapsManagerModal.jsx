import { useState, useEffect } from 'react';
import Modal from './Modal';
import {
  getMapsList,
  getMap,
  saveMap,
  deleteMap,
  createMapId,
  setLastOpenedMapId,
} from '../storage/mapsStorage';

function formatDate(ms) {
  return new Date(ms).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MapsManagerModal({
  isOpen,
  onClose,
  currentMapId,
  currentMapName,
  nodes,
  edges,
  onLoadMap,
  onNewMap,
  onRenameMap,
}) {
  const maps = getMapsList();
  const [renameValue, setRenameValue] = useState('');

  useEffect(() => {
    if (isOpen && currentMapId) {
      const map = getMap(currentMapId);
      setRenameValue(map?.name ?? currentMapName ?? '');
    }
  }, [isOpen, currentMapId, currentMapName]);

  const handleNewMap = () => {
    const id = createMapId();
    const map = saveMap({
      id,
      name: 'Nowa mapa',
      nodes: nodes ?? [],
      edges: edges ?? [],
    });
    setLastOpenedMapId(id);
    onNewMap(map);
    onClose();
  };

  const handleLoadMap = (id) => {
    const map = getMap(id);
    if (map) {
      setLastOpenedMapId(id);
      onLoadMap(map);
      onClose();
    }
  };

  const handleDeleteMap = (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Czy na pewno chcesz usunąć tę mapę? Dane zostaną utracone.')) return;
    deleteMap(id);
    if (currentMapId === id) {
      onNewMap({ id: null, name: null, nodes: [], edges: [] });
    }
  };

  const handleSaveCurrent = () => {
    if (currentMapId && nodes && edges) {
      const name = renameValue.trim() || 'Nowa mapa';
      saveMap({ id: currentMapId, name, nodes, edges });
      onRenameMap?.(name);
    }
    onClose();
  };

  const handleRenameChange = (e) => {
    const value = e.target.value;
    setRenameValue(value);
    if (currentMapId) {
      const name = value.trim() || 'Nowa mapa';
      const map = getMap(currentMapId);
      saveMap({
        id: currentMapId,
        name,
        nodes: nodes ?? map?.nodes ?? [],
        edges: edges ?? map?.edges ?? [],
      });
      onRenameMap?.(name);
    }
  };

  return (
    <Modal title="Zarządzaj mapami" isOpen={isOpen} onClose={onClose}>
      <div className="maps-manager">
        {currentMapId && (
          <>
            <label className="edit-panel__field maps-manager__rename">
              <span>Nazwa mapy</span>
              <input
                type="text"
                value={renameValue}
                onChange={handleRenameChange}
                placeholder="Nazwa mapy"
              />
            </label>
            <p className="maps-manager__hint">
              Aktualna mapa zapisuje się automatycznie.
            </p>
          </>
        )}
        <div className="maps-manager__actions">
          <button
            type="button"
            className="edit-panel__btn edit-panel__btn--primary"
            onClick={handleNewMap}
          >
            + Nowa mapa
          </button>
          {currentMapId && (
            <button
              type="button"
              className="edit-panel__btn"
              onClick={handleSaveCurrent}
            >
              Zapisz i zamknij
            </button>
          )}
        </div>
        <ul className="maps-manager__list">
          {maps.length === 0 ? (
            <li className="maps-manager__empty">Brak zapisanych map</li>
          ) : (
            maps.map((m) => (
              <li
                key={m.id}
                className={`maps-manager__item ${m.id === currentMapId ? 'maps-manager__item--current' : ''}`}
                onClick={() => handleLoadMap(m.id)}
              >
                <span className="maps-manager__item-name">{m.name}</span>
                <span className="maps-manager__item-date">{formatDate(m.updatedAt)}</span>
                <button
                  type="button"
                  className="maps-manager__delete"
                  onClick={(e) => handleDeleteMap(m.id, e)}
                  title="Usuń mapę"
                  aria-label="Usuń mapę"
                >
                  ×
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </Modal>
  );
}
