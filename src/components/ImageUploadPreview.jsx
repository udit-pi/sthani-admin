import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTimes } from '@fortawesome/free-solid-svg-icons';

const styles = {
    imagePreviewContainer: {
        position: 'relative',
        display: 'inline-block',
        margin: '10px',
    },
    image: {
        width: '50px',
        height: '50px',
    },
    removeImageButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        border: 'none',
        background: 'rgba(255,0,0,0.6)',
        borderRadius: '50%',
        padding: '2px 5px',
        cursor: 'pointer',
        color: 'white',
    },
    uploadIconLabel: {
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
    },
    fileInput: {
        display: 'none',
    },
};

const ImageUploadPreview = ({ name, imageFile, setImageFile, imagePreview, setImagePreview }) => {

    const handleFileChange = (event) => {
        
        const file = event.target.files[0];
        console.log(event.target.files);
        setImageFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveFile = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    return (
        <div>
            {imagePreview ? (
                <div style={styles.imagePreviewContainer}>
                    <img src={imagePreview} alt="Preview" style={styles.image} />
                    <button onClick={handleRemoveFile} style={styles.removeImageButton}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
            ) : (
                <label style={styles.uploadIconLabel}>
                    <FontAwesomeIcon icon={faUpload} />
                    <input
                        type="file"
                        name={name}
                        onChange={handleFileChange}
                        style={styles.fileInput}
                    />
                </label>
            )}
        </div>
    );
};

export default ImageUploadPreview;
