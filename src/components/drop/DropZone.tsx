import { useState, type FC, type ReactNode } from 'react';

interface DropZoneProps {
  children?: ReactNode;
  onDropItem?: (data: string) => void;
  highlight: boolean;
}

const DropZone: FC<DropZoneProps> = ({ children, onDropItem, highlight }) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    const data = e.dataTransfer.getData('text/plain');
    onDropItem?.(data);
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        height: '120px',
        width: '200px',
        border: '3px dashed gray',
        borderColor: isOver ? 'dodgerblue' : 'gray',
        background: isOver ? 'rgba(30,144,255,0.1)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: '0.2s',
      }}>
      <div>{children ?? 'Drop here'}</div>
      {highlight ? 'Available' : ''}
    </div>
  );
};

export default DropZone;
