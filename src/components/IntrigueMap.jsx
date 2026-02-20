import { useCallback, useState, useEffect, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Background,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import IntrigueNode from './IntrigueNode';
import IntrigueEdge from './IntrigueEdge';
import EditNodePanel from './EditNodePanel';
import EditEdgePanel from './EditEdgePanel';
import Modal from './Modal';
import IntrigueControls from './IntrigueControls';
import MapsManagerModal from './MapsManagerModal';
import { NODE_TYPES, NODE_TYPE_OPTIONS } from '../constants/nodeTypes';
import {
  getLastOpenedMapId,
  getMapsList,
  getMap,
  saveMap,
  setLastOpenedMapId,
} from '../storage/mapsStorage';

const nodeTypes = { intrigue: IntrigueNode };
const edgeTypes = { intrigue: IntrigueEdge };

const getInitialData = () => {
  const lastId = getLastOpenedMapId();
  if (lastId) {
    const m = getMap(lastId);
    if (m) return m;
  }
  const maps = getMapsList();
  if (maps.length === 0) {
    return {
      nodes: [
        { id: '1', type: 'intrigue', position: { x: 250, y: 100 }, data: { label: 'Przykładowy bohater', nodeType: 'hero' } },
        { id: '2', type: 'intrigue', position: { x: 450, y: 300 }, data: { label: 'Tawerna Pod Wilkiem', nodeType: 'place' } },
      ],
      edges: [
        { id: 'e1-2', type: 'intrigue', source: '1', target: '2', data: { label: 'Bywał tam ostatnio' } },
      ],
      id: null,
      name: null,
    };
  }
  return { nodes: [], edges: [], id: null, name: null };
};

function IntrigueMapInner() {
  const { screenToFlowPosition } = useReactFlow();
  const initial = getInitialData();
  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges);
  const [currentMapId, setCurrentMapId] = useState(initial.id);
  const [currentMapName, setCurrentMapName] = useState(initial.name);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [addForm, setAddForm] = useState(null);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [modalMapsOpen, setModalMapsOpen] = useState(false);
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    if (!currentMapId) return;
    saveTimeoutRef.current = setTimeout(() => {
      const map = getMap(currentMapId);
      saveMap({
        id: currentMapId,
        name: map?.name ?? currentMapName ?? 'Nowa mapa',
        nodes,
        edges,
      });
    }, 500);
    return () => clearTimeout(saveTimeoutRef.current);
  }, [currentMapId, nodes, edges, currentMapName]);

  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
    setModalAddOpen(false);
  }, []);

  const onEdgeClick = useCallback((_, edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
    setModalAddOpen(false);
  }, []);

  const onPaneClick = useCallback(
    (event) => {
      if (addForm) {
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });
        const newNode = {
          id: `n-${Date.now()}`,
          type: 'intrigue',
          position,
          data: {
            label: addForm.label || 'Nowy ośrodek',
            nodeType: addForm.nodeType,
          },
        };
        setNodes((nds) => [...nds, newNode]);
        setAddForm(null);
        setModalAddOpen(false);
        return;
      }
      setSelectedNode(null);
      setSelectedEdge(null);
    },
    [addForm, screenToFlowPosition, setNodes]
  );

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge({ ...params, type: 'intrigue', data: { label: '' } }, eds));
    },
    [setEdges]
  );

  const updateNodeData = useCallback(
    (nodeId, newData) => {
      setNodes((nds) =>
        nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...newData } } : n))
      );
      setSelectedNode((prev) =>
        prev?.id === nodeId ? { ...prev, data: { ...prev.data, ...newData } } : prev
      );
    },
    [setNodes]
  );

  const updateEdgeData = useCallback(
    (edgeId, newData) => {
      setEdges((eds) =>
        eds.map((e) => (e.id === edgeId ? { ...e, data: { ...e.data, ...newData } } : e))
      );
      setSelectedEdge((prev) =>
        prev?.id === edgeId ? { ...prev, data: { ...prev.data, ...newData } } : prev
      );
    },
    [setEdges]
  );

  const deleteNode = useCallback(
    (nodeId) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
      setSelectedNode(null);
    },
    [setNodes, setEdges]
  );

  const deleteEdge = useCallback(
    (edgeId) => {
      setEdges((eds) => eds.filter((e) => e.id !== edgeId));
      setSelectedEdge(null);
    },
    [setEdges]
  );

  const openAddModal = () => {
    setAddForm({
      label: '',
      nodeType: 'place',
    });
    setModalAddOpen(true);
    setSelectedNode(null);
    setSelectedEdge(null);
  };

  const closeAddModal = () => {
    setModalAddOpen(false);
    setAddForm(null);
  };

  const confirmAddAndPlace = () => {
    setModalAddOpen(false);
    // addForm stays set – next pane click will place the node
  };

  const handleLoadMap = useCallback((map) => {
    setNodes(map.nodes ?? []);
    setEdges(map.edges ?? []);
    setCurrentMapId(map.id);
    setCurrentMapName(map.name);
    setSelectedNode(null);
    setSelectedEdge(null);
  }, [setNodes, setEdges]);

  const handleNewMap = useCallback((map) => {
    setNodes(map.nodes ?? []);
    setEdges(map.edges ?? []);
    setCurrentMapId(map.id);
    setCurrentMapName(map.name);
    setSelectedNode(null);
    setSelectedEdge(null);
    setModalAddOpen(false);
  }, [setNodes, setEdges]);

  const handleRenameMap = useCallback((newName) => {
    setCurrentMapName(newName);
  }, []);

  const addFormState = modalAddOpen ? addForm : null;

  return (
    <div className="intrigue-map">
      <header className="intrigue-topbar">
        <h1 className="intrigue-topbar__title">
          {currentMapName ?? 'Mapa intrygi'}
        </h1>
        <nav className="intrigue-topbar__nav">
          <button
            type="button"
            className="intrigue-topbar__btn intrigue-topbar__btn--secondary"
            onClick={() => setModalMapsOpen(true)}
            title="Zarządzaj mapami"
          >
            Mapy
          </button>
          <button
            type="button"
            className="intrigue-topbar__btn"
            onClick={openAddModal}
            title="Dodaj nowy ośrodek, potem kliknij na mapę"
          >
            + Dodaj ośrodek
          </button>
        </nav>
      </header>

      <div className="intrigue-flow-wrap">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onConnect={onConnect}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          defaultEdgeOptions={{ type: 'intrigue' }}
          connectionLineStyle={{ stroke: 'var(--ink)', strokeWidth: 2 }}
          minZoom={0.2}
          maxZoom={1.5}
        >
          <Background color="var(--grid)" gap={20} size={1} />
          <IntrigueControls />
          <MiniMap
            className="intrigue-minimap"
            nodeColor={(n) => NODE_TYPES[n.data?.nodeType]?.color ?? '#666'}
          />
        </ReactFlow>
      </div>

      {/* Modal: Nowy ośrodek */}
      <Modal
        title="Nowy ośrodek"
        isOpen={modalAddOpen}
        onClose={closeAddModal}
      >
        <div className="edit-panel edit-panel--add">
          <p className="modal-hint">
            Uzupełnij dane i kliknij „Umieść na mapie”, a następnie kliknij w wybrane miejsce na mapie.
          </p>
          <label className="edit-panel__field">
            <span>Typ</span>
            <select
              value={addFormState?.nodeType ?? 'place'}
              onChange={(e) => setAddForm((f) => ({ ...f, nodeType: e.target.value }))}
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
              value={addFormState?.label ?? ''}
              onChange={(e) => setAddForm((f) => ({ ...f, label: e.target.value }))}
              placeholder="Nazwa"
            />
          </label>
          <div className="edit-panel__actions">
            <button type="button" className="edit-panel__btn" onClick={closeAddModal}>
              Anuluj
            </button>
            <button
              type="button"
              className="edit-panel__btn edit-panel__btn--primary"
              onClick={confirmAddAndPlace}
            >
              Umieść na mapie
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal: Edycja węzła */}
      <Modal
        isOpen={!!selectedNode}
        onClose={() => setSelectedNode(null)}
      >
        {selectedNode && (
          <EditNodePanel
            node={selectedNode}
            onUpdate={updateNodeData}
            onClose={() => setSelectedNode(null)}
            onDelete={() => deleteNode(selectedNode.id)}
          />
        )}
      </Modal>

      {/* Modal: Zarządzanie mapami */}
      <MapsManagerModal
        isOpen={modalMapsOpen}
        onClose={() => setModalMapsOpen(false)}
        currentMapId={currentMapId}
        currentMapName={currentMapName}
        nodes={nodes}
        edges={edges}
        onLoadMap={handleLoadMap}
        onNewMap={handleNewMap}
        onRenameMap={handleRenameMap}
      />

      {/* Modal: Edycja połączenia */}
      <Modal
        isOpen={!!selectedEdge && !selectedNode}
        onClose={() => setSelectedEdge(null)}
      >
        {selectedEdge && (
          <EditEdgePanel
            edge={selectedEdge}
            onUpdate={updateEdgeData}
            onClose={() => setSelectedEdge(null)}
            onDelete={() => deleteEdge(selectedEdge.id)}
          />
        )}
      </Modal>
    </div>
  );
}

export default function IntrigueMap() {
  return (
    <ReactFlowProvider>
      <IntrigueMapInner />
    </ReactFlowProvider>
  );
}
