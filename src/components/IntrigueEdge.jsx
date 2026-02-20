import { memo } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
} from '@xyflow/react';

function IntrigueEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, selected }) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition: sourcePosition ?? 'bottom',
    targetPosition: targetPosition ?? 'top',
  });

  const { setEdges } = useReactFlow();
  const label = data?.label ?? '';

  const onDelete = () => {
    setEdges((edges) => edges.filter((e) => e.id !== id));
  };

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        className={`intrigue-edge ${selected ? 'intrigue-edge--selected' : ''}`}
      />
      <EdgeLabelRenderer>
        <div
          className={`intrigue-edge-label ${selected ? 'intrigue-edge-label--selected' : ''}`}
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
        >
          <span className="intrigue-edge-label__text">{label || (selected ? '—' : '')}</span>
          {selected && (
            <button
              type="button"
              className="intrigue-edge-label__delete"
              onClick={onDelete}
              aria-label="Usuń połączenie"
            >
              ×
            </button>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default memo(IntrigueEdge);
