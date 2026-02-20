import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { NODE_TYPES } from '../constants/nodeTypes';

function IntrigueNode({ data, selected }) {
  const typeConfig = NODE_TYPES[data.nodeType] || NODE_TYPES.place;
  const label = data.label || 'Bez nazwy';

  return (
    <div
      className={`intrigue-node ${selected ? 'intrigue-node--selected' : ''}`}
      style={{ '--node-accent': typeConfig.color }}
    >
      <Handle id="top" type="target" position={Position.Top} className="intrigue-handle" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="intrigue-handle" />
      <Handle id="left" type="target" position={Position.Left} className="intrigue-handle" />
      <Handle id="right" type="source" position={Position.Right} className="intrigue-handle" />

      <div className="intrigue-node__type" title={typeConfig.label}>
        {typeConfig.label}
      </div>
      <div className="intrigue-node__label">{label}</div>
    </div>
  );
}

export default memo(IntrigueNode);
