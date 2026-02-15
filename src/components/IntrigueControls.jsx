import { Controls, ControlButton, useReactFlow } from '@xyflow/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus,
  faExpand,
} from '@fortawesome/free-solid-svg-icons';

const fitViewOptions = { padding: 0.2 };

export default function IntrigueControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <Controls
      className="intrigue-controls"
      showZoom={false}
      showFitView={false}
      showInteractive={false}
      fitViewOptions={fitViewOptions}
      aria-label="Sterowanie widokiem mapy"
    >
      <ControlButton
        onClick={() => zoomIn()}
        title="Powiększ"
        aria-label="Powiększ"
        className="intrigue-controls__btn"
      >
        <FontAwesomeIcon icon={faMagnifyingGlassPlus} />
      </ControlButton>
      <ControlButton
        onClick={() => zoomOut()}
        title="Pomniejsz"
        aria-label="Pomniejsz"
        className="intrigue-controls__btn"
      >
        <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
      </ControlButton>
      <ControlButton
        onClick={() => fitView(fitViewOptions)}
        title="Dopasuj widok"
        aria-label="Dopasuj widok"
        className="intrigue-controls__btn"
      >
        <FontAwesomeIcon icon={faExpand} />
      </ControlButton>
    </Controls>
  );
}
