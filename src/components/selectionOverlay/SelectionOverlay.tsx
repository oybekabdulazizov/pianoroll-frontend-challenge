import React, { FC, useRef, useState } from 'react';

const SelectionOverlay: FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [selectionStart, setSelectionStart] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  const [selectionEnd, setSelectionEnd] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [isSelecting, setIsSelecting] = useState(false);
  const [showSelection, setShowSelection] = useState(false);

  const getClientCoordinates = (e: React.MouseEvent<SVGSVGElement>) => {
    if (svgRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      return {
        x: e.clientX - svgRect.left,
        y: e.clientY - svgRect.top,
      };
    }
    return { x: 0, y: 0 };
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setShowSelection(false);
    setIsSelecting(true);
    const { x, y } = getClientCoordinates(e);
    setSelectionStart({ x, y });
    setSelectionEnd({ x, y });
    setIsSelecting(true);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isSelecting) {
      const { x, y } = getClientCoordinates(e);
      setSelectionEnd({ x, y });
    }
  };

  const handleMouseUp = (e: React.MouseEvent<SVGSVGElement>) => {
    const { x, y } = getClientCoordinates(e);
    setSelectionEnd({ x, y });
    setIsSelecting(false);
    setShowSelection(true);

    const selection = {
      x: Math.min(selectionStart.x, selectionEnd.x),
      y: Math.min(selectionStart.y, selectionEnd.y),
      width: Math.abs(selectionEnd.x - selectionStart.x),
      height: Math.abs(selectionEnd.y - selectionStart.y),
    };
    console.log('Selection Specs:', selection);
  };

  return (
    <svg
      ref={svgRef}
      className='absolute top-0 z-50'
      width='100%'
      height='100%'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 1 1'
      preserveAspectRatio='none'
      onClick={() => console.log('clicked the overlay')}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {showSelection && (
        <rect
          x={Math.min(selectionStart.x, selectionEnd.x)}
          y={Math.min(selectionStart.y, selectionEnd.y)}
          width={Math.abs(selectionEnd.x - selectionStart.x)}
          height={Math.abs(selectionEnd.y - selectionStart.y)}
          fill='pink'
          fillOpacity='0.4'
        ></rect>
      )}
    </svg>
  );
};

export default SelectionOverlay;
