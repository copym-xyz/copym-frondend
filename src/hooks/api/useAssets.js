import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export const useAssets = () => {
  const queryClient = useQueryClient();

  const registerAsset = useMutation({
    mutationFn: (assetData) => api.post('/assets/register', assetData),
    onSuccess: () => {
      queryClient.invalidateQueries(['assets']);
    },
  });

  const getAssets = useQuery({
    queryKey: ['assets'],
    queryFn: () => api.get('/assets'),
  });

  return {
    registerAsset,
    getAssets,
  };
};
