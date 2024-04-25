import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const DraggableItem = ({ index, moveCard,values, removeItem, children }) => {
  const ref = React.useRef(null);

  const [, drag] = useDrag({
    type: 'ITEM',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'ITEM',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        const updatedItems = moveCard(values, draggedItem.index, index);
        
        console.log('Hover - Updated Items:', updatedItems);

        draggedItem.index = index;
      }
    },
  });

  drag(drop(ref));

  return (
    <div ref={ref}>
      {children}
    </div>
  );
};


export default DraggableItem;
