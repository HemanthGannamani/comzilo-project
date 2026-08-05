import { useState, useCallback, useRef } from 'react';

export interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'clipart' | 'qr' | 'shape';
  content: string; // text string, SVG content, or image URL
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  fontSize?: number;
  fontFamily?: string;
  isCurved?: boolean;
  curveRadius?: number;
  filter?: 'none' | 'sepia' | 'grayscale' | 'vintage' | 'contrast' | 'blur';
  opacity?: number;
  isLocked?: boolean;
}

export interface PrintSideState {
  elements: CanvasElement[];
  backgroundColor: string;
}

export function usePodCanvas() {
  const [activeSide, setActiveSide] = useState<string>('front');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [autoSnap, setAutoSnap] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [lang, setLang] = useState<'en' | 'es' | 'fr' | 'hi'>('en');

  // Multi-Side Canvas State
  const [sides, setSides] = useState<Record<string, PrintSideState>>({
    front: { elements: [], backgroundColor: '#ffffff' },
    back: { elements: [], backgroundColor: '#ffffff' },
    left: { elements: [], backgroundColor: '#ffffff' },
    right: { elements: [], backgroundColor: '#ffffff' },
    sleeve: { elements: [], backgroundColor: '#ffffff' },
    boxFront: { elements: [], backgroundColor: '#ffffff' },
    boxTop: { elements: [], backgroundColor: '#ffffff' },
  });

  // Undo / Redo History Stack
  const historyStackRef = useRef<Record<string, PrintSideState>[]>([]);
  const historyIndexRef = useRef<number>(-1);

  const saveHistory = useCallback((newSides: Record<string, PrintSideState>) => {
    const nextHistory = historyStackRef.current.slice(0, historyIndexRef.current + 1);
    nextHistory.push(JSON.parse(JSON.stringify(newSides)));
    if (nextHistory.length > 50) nextHistory.shift();
    historyStackRef.current = nextHistory;
    historyIndexRef.current = nextHistory.length - 1;
  }, []);

  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      setSides(JSON.parse(JSON.stringify(historyStackRef.current[historyIndexRef.current])));
    }
  }, []);

  const redo = useCallback(() => {
    if (historyIndexRef.current < historyStackRef.current.length - 1) {
      historyIndexRef.current += 1;
      setSides(JSON.parse(JSON.stringify(historyStackRef.current[historyIndexRef.current])));
    }
  }, []);

  const addElement = useCallback((element: Omit<CanvasElement, 'id'>) => {
    const id = `el_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newEl: CanvasElement = { ...element, id };
    setSides((prev) => {
      const currentSide = prev[activeSide] || { elements: [], backgroundColor: '#ffffff' };
      const updated = {
        ...prev,
        [activeSide]: {
          ...currentSide,
          elements: [...currentSide.elements, newEl],
        },
      };
      saveHistory(updated);
      return updated;
    });
    setSelectedElementId(id);
  }, [activeSide, saveHistory]);

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    setSides((prev) => {
      const currentSide = prev[activeSide] || { elements: [], backgroundColor: '#ffffff' };
      const updatedElements = currentSide.elements.map((el) => {
        if (el.id !== id) return el;
        let newX = updates.x !== undefined ? updates.x : el.x;
        let newY = updates.y !== undefined ? updates.y : el.y;

        // Auto-Snap Logic (snap to center or grid)
        if (autoSnap) {
          const centerX = 200; // Canvas Center X (400px width / 2)
          const centerY = 250; // Canvas Center Y (500px height / 2)
          if (Math.abs(newX - centerX) < 10) newX = centerX;
          if (Math.abs(newY - centerY) < 10) newY = centerY;
        }

        return { ...el, ...updates, x: newX, y: newY };
      });

      const updated = {
        ...prev,
        [activeSide]: { ...currentSide, elements: updatedElements },
      };
      saveHistory(updated);
      return updated;
    });
  }, [activeSide, autoSnap, saveHistory]);

  const deleteElement = useCallback((id: string) => {
    setSides((prev) => {
      const currentSide = prev[activeSide] || { elements: [], backgroundColor: '#ffffff' };
      const updated = {
        ...prev,
        [activeSide]: {
          ...currentSide,
          elements: currentSide.elements.filter((el) => el.id !== id),
        },
      };
      saveHistory(updated);
      return updated;
    });
    setSelectedElementId(null);
  }, [activeSide, saveHistory]);

  const clearCanvas = useCallback(() => {
    setSides((prev) => {
      const updated = {
        ...prev,
        [activeSide]: { elements: [], backgroundColor: '#ffffff' },
      };
      saveHistory(updated);
      return updated;
    });
    setSelectedElementId(null);
  }, [activeSide, saveHistory]);

  const setBackgroundColor = useCallback((color: string) => {
    setSides((prev) => {
      const currentSide = prev[activeSide] || { elements: [], backgroundColor: '#ffffff' };
      const updated = {
        ...prev,
        [activeSide]: { ...currentSide, backgroundColor: color },
      };
      saveHistory(updated);
      return updated;
    });
  }, [activeSide, saveHistory]);

  return {
    activeSide,
    setActiveSide,
    sides,
    setSides,
    selectedElementId,
    setSelectedElementId,
    autoSnap,
    setAutoSnap,
    showGrid,
    setShowGrid,
    lang,
    setLang,
    addElement,
    updateElement,
    deleteElement,
    clearCanvas,
    setBackgroundColor,
    undo,
    redo,
    canUndo: historyIndexRef.current > 0,
    canRedo: historyIndexRef.current < historyStackRef.current.length - 1,
  };
}
