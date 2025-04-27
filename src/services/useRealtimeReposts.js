import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../config/firebase";

export const useRealtimeData = (path) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const dbRef = ref(database, path);
    setLoading(true);

    const unsubscribe = onValue(dbRef, (snapshot) => {
      try {
        if (snapshot.exists()) {
          const result = snapshot.val();
          // Convert object to array nếu cần
          setData(Array.isArray(result) ? result : [result]);
        } else {
          setData([]);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }, (err) => {
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [path]);

  return { data, loading, error };
};