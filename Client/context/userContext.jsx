import axios from 'axios';
import { createContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8000/profile', { withCredentials: true });
      if (response.data && response.data !== user) {
        setUser(response.data);
      }
    } catch (err) {
      if (err.response) {
        if (user !== null) setUser(null);
        toast.error(err.response.data.err);
      }
    } finally {
      if (loading) setLoading(false);
    }
  }, [user, loading]);

  useEffect(() => {
    if (!user) {
      fetchData();
    }
  }, [fetchData, user]);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}