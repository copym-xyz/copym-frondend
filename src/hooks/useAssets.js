import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const useAssets = () => {
  const queryClient = useQueryClient();

  const registerAsset = useMutation({
    mutationFn: async (assetData) => {
      const response = await api.post('/assets/register', assetData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch assets list
      queryClient.invalidateQueries(['assets']);
    },
  });

  const uploadDocuments = useMutation({
    mutationFn: async ({ assetId, documents }) => {
      const formData = new FormData();
      documents.forEach(doc => {
        formData.append('documents', doc.file, doc.name);
      });

      const response = await api.post(`/assets/${assetId}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    }
  });

  const submitForVerification = useMutation({
    mutationFn: async (assetId) => {
      const response = await api.post(`/assets/${assetId}/submit`);
      return response.data;
    }
  });

  return { registerAsset, uploadDocuments, submitForVerification };
};