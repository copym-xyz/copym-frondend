// src/store/slices/documentSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  documents: {},
  uploadProgress: {},
  currentUploads: [],
  documentTypes: {
    ownership: {
      required: true,
      maxSize: 5 * 1024 * 1024,
      allowedTypes: ['application/pdf']
    },
    certification: {
      required: true,
      maxSize: 5 * 1024 * 1024,
      allowedTypes: ['application/pdf', 'image/jpeg', 'image/png']
    },
    quality_report: {
      required: true,
      maxSize: 5 * 1024 * 1024,
      allowedTypes: ['application/pdf']
    }
  },
  validationStatus: {},
  loading: false,
  error: null
};

const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setDocuments: (state, action) => {
      const { assetId, documents } = action.payload;
      state.documents[assetId] = documents;
    },

    addDocument: (state, action) => {
      const { assetId, document } = action.payload;
      if (!state.documents[assetId]) {
        state.documents[assetId] = [];
      }
      state.documents[assetId].push(document);
    },

    removeDocument: (state, action) => {
      const { assetId, documentId } = action.payload;
      if (state.documents[assetId]) {
        state.documents[assetId] = state.documents[assetId].filter(
          doc => doc.id !== documentId
        );
      }
    },

    updateUploadProgress: (state, action) => {
      const { assetId, documentId, progress } = action.payload;
      state.uploadProgress[`${assetId}-${documentId}`] = progress;
    },

    addCurrentUpload: (state, action) => {
      state.currentUploads.push(action.payload);
    },

    removeCurrentUpload: (state, action) => {
      state.currentUploads = state.currentUploads.filter(
        upload => upload.id !== action.payload
      );
    },

    setDocumentValidationStatus: (state, action) => {
      const { documentId, status } = action.payload;
      state.validationStatus[documentId] = status;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    }
  }
});

// Export actions
export const {
  setDocuments,
  addDocument,
  removeDocument,
  updateUploadProgress,
  addCurrentUpload,
  removeCurrentUpload,
  setDocumentValidationStatus,
  setLoading,
  setError,
  clearError
} = documentSlice.actions;

// Selectors
export const selectDocuments = (state, assetId) => state.documents.documents[assetId] || [];
export const selectUploadProgress = (state, assetId, documentId) => 
  state.documents.uploadProgress[`${assetId}-${documentId}`] || 0;
export const selectCurrentUploads = (state) => state.documents.currentUploads;
export const selectDocumentTypes = (state) => state.documents.documentTypes;
export const selectValidationStatus = (state, documentId) => 
  state.documents.validationStatus[documentId];
export const selectDocumentLoading = (state) => state.documents.loading;
export const selectDocumentError = (state) => state.documents.error;

// Thunks for async operations
export const uploadDocument = ({ assetId, file, type }) => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    const uploadId = Date.now().toString();
    
    dispatch(addCurrentUpload({
      id: uploadId,
      assetId,
      fileName: file.name,
      type
    }));

    // Here you would typically handle the actual file upload
    // This is where you'd integrate with your backend API
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    // Simulated upload progress updates
    const progressInterval = setInterval(() => {
      const currentProgress = getState().documents.uploadProgress[`${assetId}-${uploadId}`] || 0;
      if (currentProgress < 100) {
        dispatch(updateUploadProgress({
          assetId,
          documentId: uploadId,
          progress: currentProgress + 10
        }));
      } else {
        clearInterval(progressInterval);
      }
    }, 500);

    // After successful upload
    dispatch(addDocument({
      assetId,
      document: {
        id: uploadId,
        name: file.name,
        type,
        uploadedAt: new Date().toISOString()
      }
    }));

    dispatch(removeCurrentUpload(uploadId));
    dispatch(setLoading(false));
    
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(setLoading(false));
  }
};

export const validateDocument = (documentId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Here you would typically make an API call to validate the document
    dispatch(setDocumentValidationStatus({
      documentId,
      status: 'validated'
    }));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(setLoading(false));
  }
};

export default documentSlice.reducer;