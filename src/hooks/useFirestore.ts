import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, collection, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import * as initialData from "@/lib/portfolio-data";

// Deeply sanitizes objects to remove functions and non-serializable objects (like React elements/Symbols)
function deepSanitize(val: any): any {
  if (val === null || val === undefined) return val;
  if (Array.isArray(val)) {
    return val.map(deepSanitize);
  }
  if (typeof val === "object") {
    // If it looks like a React element/symbol, drop it
    if (val.$$typeof || typeof val.render === "function" || val.displayName) {
      return undefined;
    }
    const cleanObj: Record<string, any> = {};
    for (const key of Object.keys(val)) {
      const cleanVal = deepSanitize(val[key]);
      if (cleanVal !== undefined && typeof cleanVal !== "function") {
        cleanObj[key] = cleanVal;
      }
    }
    return cleanObj;
  }
  return val;
}

// Helper function is now a no-op since the database is fully seeded and fallback data is removed
export async function seedDatabaseIfEmpty() {
  // Database seeded. Auto-seeding disabled.
}

// Simple in-memory cache to prevent redundant round-trip API queries and layout shifts
const docCache: Record<string, any> = {};
const colCache: Record<string, any[]> = {};

// Helper to check object equality to prevent state updates/re-renders if data matches
function isEqual(a: any, b: any): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

// React custom hook to subscribe to any collection/document with no fallback and memory cache
export function useFirestoreDoc<T>(collectionName: string, docId: string, fallbackData: T = {} as T) {
  const cacheKey = `${collectionName}/${docId}`;
  const cachedVal = docCache[cacheKey];

  const [data, setData] = useState<T>(cachedVal !== undefined ? cachedVal : fallbackData);
  const [loading, setLoading] = useState(cachedVal === undefined);

  useEffect(() => {
    let active = true;
    const fetchDoc = async () => {
      try {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);
        if (active) {
          if (docSnap.exists()) {
            const freshData = docSnap.data() as T;
            if (!isEqual(data, freshData)) {
              docCache[cacheKey] = freshData;
              setData(freshData);
            }
          } else {
            if (!isEqual(data, fallbackData)) {
              docCache[cacheKey] = fallbackData;
              setData(fallbackData);
            }
          }
          setLoading(false);
        }
      } catch (err) {
        console.error(`Error loading document ${collectionName}/${docId}:`, err);
        if (active) {
          setData(fallbackData);
          setLoading(false);
        }
      }
    };

    fetchDoc();
    return () => { active = false; };
  }, [collectionName, docId]);

  const updateDocData = async (newData: Partial<T>) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, newData, { merge: true });
      const updated = { ...data, ...newData } as T;
      docCache[cacheKey] = updated;
      setData(updated);
      return true;
    } catch (err) {
      console.error(`Error updating document ${collectionName}/${docId}:`, err);
      throw err;
    }
  };

  return { data, loading, updateDocData };
}

export function useFirestoreCollection<T>(collectionName: string, fallbackList: T[] = [], idField: keyof T = "id" as any) {
  const cacheKey = collectionName;
  const cachedVal = colCache[cacheKey];

  const [list, setList] = useState<T[]>(cachedVal !== undefined ? cachedVal : fallbackList);
  const [loading, setLoading] = useState(cachedVal === undefined);

  const fetchCollection = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      if (!querySnapshot.empty) {
        const items: T[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as unknown as T);
        });
        if (!isEqual(list, items)) {
          colCache[cacheKey] = items;
          setList(items);
        }
      } else {
        if (!isEqual(list, [])) {
          colCache[cacheKey] = [];
          setList([]);
        }
      }
      setLoading(false);
    } catch (err) {
      console.error(`Error loading collection ${collectionName}:`, err);
      setList([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollection();
  }, [collectionName]);

  const addOrUpdateItem = async (docId: string, itemData: any) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, itemData, { merge: true });
      // Optimistically update cache and list to prevent UI lag
      const updatedItem = { id: docId, ...itemData } as unknown as T;
      const currentList = colCache[cacheKey] || [];
      const index = currentList.findIndex((item: any) => item.id === docId);
      let newList = [...currentList];
      if (index > -1) {
        newList[index] = { ...newList[index], ...updatedItem };
      } else {
        newList.push(updatedItem);
      }
      colCache[cacheKey] = newList;
      setList(newList);

      await fetchCollection();
      return true;
    } catch (err) {
      console.error(`Error writing item to collection ${collectionName}:`, err);
      throw err;
    }
  };

  const deleteItem = async (docId: string) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      // Optimistically update list
      const currentList = colCache[cacheKey] || [];
      const newList = currentList.filter((item: any) => item.id !== docId);
      colCache[cacheKey] = newList;
      setList(newList);

      await fetchCollection();
      return true;
    } catch (err) {
      console.error(`Error deleting item from collection ${collectionName}:`, err);
      throw err;
    }
  };

  return { list, loading, addOrUpdateItem, deleteItem, refresh: fetchCollection };
}

