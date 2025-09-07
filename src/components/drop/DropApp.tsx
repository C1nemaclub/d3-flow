import { useState, type DragEvent } from 'react';
import DropZone from './DropZone';

const img = new Image();
img.src =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFz5fYgrepcP696Zm4ZtlldGLC6hEr83HUhDcUWJoyK2l-Rqp2YrkMskunDA_R5Hy-722xpQrOgG2-ZhAuOhuQ1aBRtwaf4jp3tfRNlNQKmg';

const DropApp = () => {
  const [isBeingDragged, setIsBeingDragged] = useState(false);

  const handleDragStart = (e: DragEvent) => {
    const preview = document.getElementById('drag-preview');
    if (!preview) return;
    e.dataTransfer.setData('text/plain', 'My item');
    e.dataTransfer.setDragImage(preview, 10, 10);
    setIsBeingDragged(true);
  };

  const handleDragEnd = () => {
    setIsBeingDragged(false);
  };

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <pre>{JSON.stringify({ isBeingDragged }, null, 2)}</pre>
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={{
          padding: '1rem',
          border: '1px solid gray',
          cursor: 'grab',
        }}>
        Drag me
      </div>
      <div id='drag-preview' className='custom-drag-image'>
        ✨ Custom Preview ✨
        <img
          src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFz5fYgrepcP696Zm4ZtlldGLC6hEr83HUhDcUWJoyK2l-Rqp2YrkMskunDA_R5Hy-722xpQrOgG2-ZhAuOhuQ1aBRtwaf4jp3tfRNlNQKmg'
          width={200}
          height={200}
        />
      </div>
      <DropZone
        highlight={isBeingDragged}
        onDropItem={(data) => alert(`Dropped: ${data}`)}
      />
      <DropZone
        highlight={isBeingDragged}
        onDropItem={(data) => alert(`Droppedxaxaxaxaxax: ${data}`)}>
        Another zone
      </DropZone>
    </div>
  );
};

export default DropApp;
