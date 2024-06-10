import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
const mediaFolder = process.env.REACT_APP_MEDIA_URL;
const DraggableMediaGallery = ({ mediaItems, setMediaItems }) => {
  
    
    const onDragEnd = (result) => {
        
        if (!result.destination) return;
        const newItems = Array.from(mediaItems);
        const [reorderedItem] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, reorderedItem);
        setMediaItems(newItems);
    };

    const handleRemoveFile = (index) => {
        const newItems = mediaItems.filter((_, i) => i !== index);
        setMediaItems(newItems);
    };

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            const newFiles = Array.from(event.target.files);
            // .map(file => ({
            //     name: file.name,
            //     size: file.size,
            //     type: file.type,
            //     file: file,
            //     url: URL.createObjectURL(file),
            //     isUploaded: true
            // }));
            
            setMediaItems(prevItems => [...prevItems, ...newFiles]);
        }
    };

   
    
    const grid = 8;
    const getItemStyle = (isDragging, draggableStyle) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: "none",
        padding: grid * 2,
        textAlign: 'center',
        margin: `10px 0 ${grid}px 0`,
        borderRadius: '10px',
        // change background colour if dragging
        background: isDragging ? "lightyellow" : "white",
      
        // styles we need to apply on draggables
        ...draggableStyle
      });

 
    return (
        <div>
            <input type="file" id="media" name="media" multiple onChange={handleFileChange} />
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable-files" direction="horizontal">
                {(provided) => (
                    <div
                    {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{ display: "flex", gap: "20px", overflow:"auto", flexWrap: "wrap" }}
                        
                    >
                        {mediaItems.map((file, index) => (
                             
                            <Draggable key={index} draggableId={String(index)} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="col-md-3 mb-2"
                                        style={getItemStyle(
                                            snapshot.isDragging,
                                            provided.draggableProps.style
                                          )}
                                    >
                                       
                                        <img src={typeof(file)=="string"?`${mediaFolder}${file}`: URL.createObjectURL(file)} alt={`file-${file.id}`}  className="img-fluid" style={{ width: 150, height: 150, margin: 10 }} />
                                        
                                        <button
                                            type="button"
                                            className="btn btn-sm mt-2"
                                            onClick={() => handleRemoveFile(index)}
                                            style={{ backgroundColor: 'transparent', border: "1px solid #D93D6E" }}
                                        >
                                            Remove Image
                                        </button>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>

        </DragDropContext>
    </div>
    );
};

export default DraggableMediaGallery;
