import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { businessService } from '../services/businessService';
import toast from 'react-hot-toast';

const BusinessContext = createContext();

export const BusinessProvider = ({ children }) => {
  const [businesses, setBusinesses] = useState([]);
  const [currentBusiness, setCurrentBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchBusinesses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await businessService.getBusinesses();
      if (res.success && res.data.length > 0) {
        setBusinesses(res.data);
        // Retain current if still valid, or default to first
        setCurrentBusiness((prev) => {
          if (prev) {
            const found = res.data.find(b => (b._id || b.id) === (prev._id || prev.id));
            if (found) return found;
          }
          return res.data[0];
        });
      } else {
        // If no businesses exist yet, reset demo
        const resetRes = await businessService.resetDemo();
        if (resetRes.success && resetRes.data) {
          setBusinesses([resetRes.data]);
          setCurrentBusiness(resetRes.data);
        }
      }
    } catch (err) {
      console.error('Failed to load businesses:', err);
      toast.error('Unable to connect to backend server. Make sure server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const switchBusiness = (businessId) => {
    const found = businesses.find(b => (b._id || b.id) === businessId);
    if (found) {
      setCurrentBusiness(found);
      toast.success(`Switched to ${found.name}`);
    }
  };

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const loadDemoDataset = async (datasetType) => {
    const loadingToast = toast.loading(`Loading synthetic demo data for ${datasetType}...`);
    try {
      const demoId = `demo-${datasetType}-1`;
      let target = businesses.find(b => (b._id || b.id) === demoId);

      if (!target) {
        await businessService.seedDataset(datasetType);
        const res = await businessService.getBusinesses();
        if (res.success && Array.isArray(res.data)) {
          setBusinesses(res.data);
          target = res.data.find(b => (b._id || b.id) === demoId);
        }
      }

      if (target) {
        setCurrentBusiness(target);
      }
      triggerRefresh();
      toast.success(`Demo ${datasetType} dataset active!`, { id: loadingToast });
    } catch (err) {
      toast.error(`Error loading demo dataset: ${err.message}`, { id: loadingToast });
    }
  };

  return (
    <BusinessContext.Provider
      value={{
        businesses,
        currentBusiness,
        setCurrentBusiness,
        switchBusiness,
        loading,
        refreshBusinesses: fetchBusinesses,
        triggerRefresh,
        refreshTrigger,
        loadDemoDataset
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};
