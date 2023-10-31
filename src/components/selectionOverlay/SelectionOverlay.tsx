import React, { FC, useRef, useState } from 'react';

const SelectionOverlay: FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [selectionStart, setSelectionStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

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

    const selection = {
      x: Math.min(selectionStart?.x || 0, selectionEnd?.x || 0),
      y: Math.min(selectionStart?.y || 0, selectionEnd?.y || 0),
      width: Math.abs((selectionEnd?.x || 0) - (selectionStart?.x || 0)),
      height: Math.abs((selectionEnd?.y || 0) - (selectionStart?.y || 0)),
    };
    console.log('Selection Specs:', selection);
  };

  return (
    <svg
      ref={svgRef}
      className='piano-roll-svg absolute top-0 z-10'
      width='100%'
      height='100%'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 1 1'
      preserveAspectRatio='none'
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {isSelecting && (
        <rect
          x={Math.min(selectionStart?.x || 0, selectionEnd?.x || 0)}
          y={Math.min(selectionStart?.y || 0, selectionEnd?.y || 0)}
          width={Math.abs((selectionEnd?.x || 0) - (selectionStart?.x || 0))}
          height={Math.abs((selectionEnd?.y || 0) - (selectionStart?.y || 0))}
          fill='rgba(30, 170, 201, 0.3)'
        >
          wwww
        </rect>
      )}
    </svg>
  );
};

export default SelectionOverlay;
