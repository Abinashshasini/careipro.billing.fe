import apiClient from '@/lib/apiClient';
import { ApiResponse } from '@/types/apitypes';
import { useEffect, useState } from 'react';

const useStoreInfo = () => {
  const [storeInfo, setStoreInfo] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  /** Function to fetch store details */
  const handleFetchStoreDetails = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<ApiResponse<null>>('/store/details');
      setLoading(false);
      if (response?.data?.success) {
        setStoreInfo(response.data.data || null);
        localStorage.setItem('storeInfo', JSON.stringify(response.data.data));
      }
    } catch (error) {
      setLoading(false);
      setError(true);
      console.error('Error fetching store details:', error);
    }
  };

  useEffect(() => {
    handleFetchStoreDetails();
  }, []);

  return { storeInfo, loading, error };
};

export default useStoreInfo;
