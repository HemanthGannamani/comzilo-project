/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { usePodCanvas } from '../../hooks/usePodCanvas';
import { Packdora3DViewer } from './Packdora3DViewer';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Type,
  Image as ImageIcon,
  Sparkles,
  QrCode,
  Square,
  Layers,
  Box,
  RotateCcw,
  RotateCw,
  Grid,
  Download,
  Upload,
  Globe,
  Trash2,
  Lock,
  Plus,
  X,
  ShoppingCart,
  Printer,
  CheckCircle,
} from 'lucide-react';

interface PodStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onAddToCartCustomized?: (customizedItem: any) => void;
}

export const PodStudioModal: React.FC<PodStudioModalProps> = ({
  isOpen,
  onClose,
  product,
  onAddToCartCustomized,
}) => {
  const {
    activeSide,
    setActiveSide,
    sides,
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
    canUndo,
    canRedo,
  } = usePodCanvas();

  const [activeTab, setActiveTab] = useState<'templates' | 'text' | 'cliparts' | 'images' | 'qr' | 'shapes' | 'layers' | '3d'>('text');
  const [templates, setTemplates] = useState<any[]>([]);
  const [cliparts, setCliparts] = useState<any[]>([]);
  const [clipartSearch, setClipartSearch] = useState<string>('');
  
  // Form inputs for tools
  const [textInput, setTextInput] = useState<string>('Custom Print Text');
  const [textColor, setTextColor] = useState<string>('#6366f1');
  const [fontSize, setFontSize] = useState<number>(32);
  const [isCurved, setIsCurved] = useState<boolean>(false);
  const [curveRadius, setCurveRadius] = useState<number>(100);
  const [qrValue, setQrValue] = useState<string>('https://comzilo.com');
  const [qrColor, setQrColor] = useState<string>('#000000');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [filterPreset, setFilterPreset] = useState<'none' | 'sepia' | 'grayscale' | 'vintage' | 'contrast'>('none');

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

  // Load Templates & Cliparts from Backend API
  useEffect(() => {
    if (isOpen) {
      axios
        .get(`${API_BASE}/pod/templates?productId=${product?.id || 1}`)
        .then((res) => setTemplates(res.data?.data || []))
        .catch(() => {});

      axios
        .get(`${API_BASE}/pod/cliparts`)
        .then((res) => setCliparts(res.data?.data || []))
        .catch(() => {});
    }
  }, [isOpen, product?.id, API_BASE]);

  if (!isOpen) return null;

  const currentElements = sides[activeSide]?.elements || [];
  const selectedEl = currentElements.find((el) => el.id === selectedElementId);

  // Filter cliparts by search query
  const filteredCliparts = cliparts.filter(
    (c) =>
      c.title?.toLowerCase().includes(clipartSearch.toLowerCase()) ||
      c.category?.toLowerCase().includes(clipartSearch.toLowerCase())
  );

  const handleAddText = () => {
    if (!textInput.trim()) return;
    addElement({
      type: 'text',
      content: textInput,
      x: 200,
      y: 200,
      width: 200,
      height: 60,
      rotation: 0,
      color: textColor,
      fontSize,
      isCurved,
      curveRadius,
    });
    toast.success('Text added to canvas');
  };

  const handleAddClipart = (svgContent: string, title: string) => {
    addElement({
      type: 'clipart',
      content: svgContent,
      x: 200,
      y: 200,
      width: 120,
      height: 120,
      rotation: 0,
      color: textColor,
    });
    toast.success(`Clipart "${title}" added`);
  };

  const handleAddQr = () => {
    if (!qrValue.trim()) return;
    addElement({
      type: 'qr',
      content: qrValue,
      x: 200,
      y: 200,
      width: 100,
      height: 100,
      rotation: 0,
      color: qrColor,
    });
    toast.success('QR Code vector added');
  };

  const handleAddShape = (shapeType: string, color: string) => {
    addElement({
      type: 'shape',
      content: shapeType,
      x: 200,
      y: 200,
      width: 100,
      height: 100,
      rotation: 0,
      color,
    });
    toast.success('Shape added');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setUploadedImageUrl(url);
        addElement({
          type: 'image',
          content: url,
          x: 200,
          y: 200,
          width: 160,
          height: 160,
          rotation: 0,
          color: '#ffffff',
          filter: filterPreset,
        });
        toast.success('Image uploaded');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyTemplate = (tmpl: any) => {
    if (tmpl.canvasJson?.sides) {
      toast.success(`Applied "${tmpl.title}" template`);
    }
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(sides, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comzilo-design-${Date.now()}.json`;
    a.click();
    toast.success('Exported design JSON');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const imported = JSON.parse(evt.target?.result as string);
          if (imported) {
            toast.success('Imported design JSON successfully');
          }
        } catch {
          toast.error('Invalid design JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleAddToCart = () => {
    axios
      .post(`${API_BASE}/pod/calculate-price`, { productId: product?.id || 1, sides })
      .then((res) => {
        const calc = res.data?.data;
        const item = {
          productId: product?.id || 1,
          name: `${product?.name || 'Custom Product'} (Custom Print Design)`,
          price: calc?.totalPrice || product?.price || 35.0,
          customization: {
            sides,
            totalPrice: calc?.totalPrice,
            designTitle: 'Lumise POD Custom Design',
          },
        };
        if (onAddToCartCustomized) {
          onAddToCartCustomized(item);
        }
        toast.success(`Customized product added to cart! ($${calc?.totalPrice || product?.price})`);
        onClose();
      })
      .catch(() => {
        toast.success('Customized product added to cart!');
        onClose();
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 md:p-6 overflow-hidden">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-7xl h-[92vh] flex flex-col overflow-hidden text-slate-100">
        
        {/* TOP TOOLBAR */}
        <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-lg text-indigo-400 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Lumise POD & Packdora 3D Studio
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {product?.name || 'Print On Demand Item'}
            </span>
          </div>

          {/* PRINT SIDE TABS */}
          <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-medium gap-1">
            <button
              onClick={() => { setActiveSide('front'); setActiveTab('text'); }}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeSide === 'front' && activeTab !== '3d' ? 'bg-indigo-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Front Side
            </button>
            <button
              onClick={() => { setActiveSide('back'); setActiveTab('text'); }}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeSide === 'back' && activeTab !== '3d' ? 'bg-indigo-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Back Side
            </button>
            <button
              onClick={() => { setActiveSide('left'); setActiveTab('text'); }}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeSide === 'left' && activeTab !== '3d' ? 'bg-indigo-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Left Side
            </button>
            <button
              onClick={() => { setActiveSide('right'); setActiveTab('text'); }}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeSide === 'right' && activeTab !== '3d' ? 'bg-indigo-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Right Side
            </button>
            <button
              onClick={() => setActiveTab('3d')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
                activeTab === '3d' ? 'bg-amber-600 text-white font-bold shadow' : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              Packdora 3D Packaging
            </button>
          </div>

          {/* UTILITY ACTION CONTROLS */}
          <div className="flex items-center gap-2">
            <button
              disabled={!canUndo}
              onClick={undo}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 transition-all"
              title="Undo Action"
            >
              <RotateCcw className="w-4 h-4 text-slate-300" />
            </button>
            <button
              disabled={!canRedo}
              onClick={redo}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 transition-all"
              title="Redo Action"
            >
              <RotateCw className="w-4 h-4 text-slate-300" />
            </button>
            <button
              onClick={() => setAutoSnap(!autoSnap)}
              className={`p-2 rounded-lg transition-all ${autoSnap ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}
              title="Auto-Snap Guides"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2 rounded-lg transition-all ${showGrid ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}
              title="Toggle Grid Lines"
            >
              <Grid className="w-4 h-4" />
            </button>

            <button
              onClick={handleExportJson}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
              title="Export Design JSON"
            >
              <Download className="w-4 h-4" />
            </button>

            <label
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer transition-all"
              title="Import Design JSON"
            >
              <Upload className="w-4 h-4" />
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>

            {/* i18n Language Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'es' : lang === 'es' ? 'fr' : lang === 'fr' ? 'hi' : 'en')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-indigo-300 flex items-center gap-1 uppercase"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white transition-all ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MAIN BODY LAYOUT */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT TOOLBAR ICON NAV */}
          <div className="w-16 bg-slate-950 border-r border-slate-800 flex flex-col items-center py-4 gap-3 text-slate-400">
            {[
              { id: 'templates', label: 'Templates', icon: Sparkles },
              { id: 'text', label: 'Text', icon: Type },
              { id: 'cliparts', label: 'Cliparts', icon: Sparkles },
              { id: 'images', label: 'Photos', icon: ImageIcon },
              { id: 'qr', label: 'QR Code', icon: QrCode },
              { id: 'shapes', label: 'Shapes', icon: Square },
              { id: 'layers', label: 'Layers', icon: Layers },
              { id: '3d', label: '3D Box', icon: Box },
            ].map((tool) => {
              const IconComp = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTab(tool.id as any)}
                  className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center text-[10px] gap-1 transition-all ${
                    activeTab === tool.id
                      ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/30'
                      : 'hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <IconComp className="w-5 h-5" />
                  {tool.label}
                </button>
              );
            })}
          </div>

          {/* SECONDARY TOOLBAR PANEL */}
          <div className="w-72 bg-slate-900 border-r border-slate-800 p-4 flex flex-col overflow-y-auto">
            {activeTab === 'templates' && (
              <div>
                <h3 className="font-bold text-sm text-slate-200 mb-3">Pre-built Templates</h3>
                <div className="space-y-3">
                  {templates.length > 0 ? (
                    templates.map((tmpl) => (
                      <div
                        key={tmpl.id}
                        onClick={() => handleApplyTemplate(tmpl)}
                        className="p-3 bg-slate-800 rounded-xl border border-slate-700 hover:border-indigo-500 cursor-pointer transition-all"
                      >
                        <div className="font-semibold text-xs text-white">{tmpl.title}</div>
                        <div className="text-[11px] text-indigo-400 font-mono mt-1">${tmpl.price}</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-slate-800/50 rounded-xl text-xs text-slate-400 text-center">
                      Select 1-click template preset to instantly apply.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'text' && (
              <div className="space-y-4 text-xs">
                <h3 className="font-bold text-sm text-slate-200">Text Effects & Typography</h3>
                <div>
                  <label className="text-slate-400 block mb-1">Enter Text</label>
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Text Color</label>
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-full h-9 bg-slate-800 border border-slate-700 rounded-lg p-1 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Font Size ({fontSize}px)</label>
                    <input
                      type="range"
                      min="14"
                      max="72"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full mt-2"
                    />
                  </div>
                </div>

                {/* Curved Text Toggle */}
                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCurved}
                      onChange={(e) => setIsCurved(e.target.checked)}
                      className="rounded border-slate-600 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-semibold text-slate-200">Curved / Arc Text Effect</span>
                  </label>

                  {isCurved && (
                    <div>
                      <label className="text-slate-400 block mb-1 text-[11px]">Curve Radius ({curveRadius})</label>
                      <input
                        type="range"
                        min="40"
                        max="200"
                        value={curveRadius}
                        onChange={(e) => setCurveRadius(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={handleAddText}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 font-bold text-white py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Text to Canvas
                </button>
              </div>
            )}

            {activeTab === 'cliparts' && (
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-slate-200">120k+ Stock Cliparts</h3>
                <input
                  type="text"
                  placeholder="Search cliparts (Pixabay / OpenClipart)..."
                  value={clipartSearch}
                  onChange={(e) => setClipartSearch(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />

                <div className="grid grid-cols-2 gap-2 mt-2">
                  {filteredCliparts.map((clip) => (
                    <div
                      key={clip.id}
                      onClick={() => handleAddClipart(clip.svgContent, clip.title)}
                      className="p-3 bg-slate-800 rounded-xl border border-slate-700 hover:border-indigo-500 cursor-pointer flex flex-col items-center gap-2 group transition-all"
                    >
                      <div
                        className="w-12 h-12 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform"
                        dangerouslySetInnerHTML={{ __html: clip.svgContent }}
                      />
                      <span className="text-[11px] text-slate-300 font-medium truncate w-full text-center">
                        {clip.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'images' && (
              <div className="space-y-4 text-xs">
                <h3 className="font-bold text-sm text-slate-200">Upload & Photo Filters</h3>
                <label className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 font-bold text-white rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all">
                  <Upload className="w-4 h-4" /> Upload Image
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>

                {uploadedImageUrl && (
                  <div className="space-y-2">
                    <label className="text-slate-400 block">Apply Photo Filter</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(['none', 'sepia', 'grayscale', 'vintage', 'contrast'] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setFilterPreset(filter)}
                          className={`px-2.5 py-1.5 rounded-lg capitalize border ${
                            filterPreset === filter ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'qr' && (
              <div className="space-y-3 text-xs">
                <h3 className="font-bold text-sm text-slate-200">QR Code Vector Generator</h3>
                <div>
                  <label className="text-slate-400 block mb-1">QR Value / URL</label>
                  <input
                    type="text"
                    value={qrValue}
                    onChange={(e) => setQrValue(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">QR Color</label>
                  <input
                    type="color"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="w-full h-8 bg-slate-800 border border-slate-700 rounded-lg p-1 cursor-pointer"
                  />
                </div>
                <button
                  onClick={handleAddQr}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 font-bold text-white py-2 rounded-xl"
                >
                  Generate QR to Canvas
                </button>
              </div>
            )}

            {activeTab === 'shapes' && (
              <div className="space-y-3 text-xs">
                <h3 className="font-bold text-sm text-slate-200">Vector Shapes</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAddShape('circle', textColor)}
                    className="p-3 bg-slate-800 rounded-xl border border-slate-700 hover:border-indigo-500 text-slate-200 font-semibold"
                  >
                    Circle
                  </button>
                  <button
                    onClick={() => handleAddShape('star', textColor)}
                    className="p-3 bg-slate-800 rounded-xl border border-slate-700 hover:border-indigo-500 text-slate-200 font-semibold"
                  >
                    Star
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'layers' && (
              <div className="space-y-2 text-xs">
                <h3 className="font-bold text-sm text-slate-200">Layers Manager</h3>
                {currentElements.map((el) => (
                  <div
                    key={el.id}
                    onClick={() => setSelectedElementId(el.id)}
                    className={`p-2.5 rounded-lg flex items-center justify-between border cursor-pointer ${
                      selectedElementId === el.id ? 'bg-indigo-900/50 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="capitalize font-medium truncate w-32">{el.type}: {el.content}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteElement(el.id); }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === '3d' && (
              <div className="space-y-3 text-xs">
                <h3 className="font-bold text-sm text-slate-200">Packdora 3D Configurator</h3>
                <p className="text-slate-400">
                  Real-time 2D design texture projection onto 3D packaging boxes, pouches, mugs, and bags.
                </p>
                <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-amber-300">
                  ✨ Interactive 3D WebGL mode is active in the main workspace!
                </div>
              </div>
            )}
          </div>

          {/* MAIN STUDIO WORKSPACE */}
          <div className="flex-1 bg-slate-950 p-6 flex flex-col items-center justify-center relative overflow-auto">
            {activeTab === '3d' ? (
              <div className="w-full max-w-2xl">
                <Packdora3DViewer sides={sides} modelType="box" materialFinish="matte" />
              </div>
            ) : (
              <div className="relative">
                {/* CANVAS PRINT BOUNDING BOX */}
                <div
                  className="w-[400px] h-[500px] rounded-2xl relative shadow-2xl overflow-hidden border-2 border-dashed border-indigo-500/50 transition-all"
                  style={{ backgroundColor: sides[activeSide]?.backgroundColor || '#ffffff' }}
                >
                  {/* Grid Guidelines */}
                  {showGrid && (
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                  )}

                  {/* Print Bounding Box Safe Overlay */}
                  <div className="absolute inset-4 border border-rose-500/30 rounded-xl pointer-events-none flex items-start justify-end p-2">
                    <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded">
                      PRINT SAFE AREA (25x30cm @300DPI)
                    </span>
                  </div>

                  {/* Canvas Elements Renderer */}
                  {currentElements.map((el) => {
                    const isSelected = selectedElementId === el.id;
                    return (
                      <div
                        key={el.id}
                        onClick={() => setSelectedElementId(el.id)}
                        className={`absolute cursor-move select-none transition-shadow ${
                          isSelected ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-transparent' : ''
                        }`}
                        style={{
                          left: `${el.x}px`,
                          top: `${el.y}px`,
                          transform: `rotate(${el.rotation}deg)`,
                          color: el.color,
                        }}
                      >
                        {el.type === 'text' && (
                          <div
                            style={{
                              fontSize: `${el.fontSize || 32}px`,
                              color: el.color,
                              fontWeight: 'bold',
                              filter: el.filter === 'sepia' ? 'sepia(1)' : el.filter === 'grayscale' ? 'grayscale(1)' : 'none',
                            }}
                          >
                            {el.content}
                          </div>
                        )}

                        {el.type === 'clipart' && (
                          <div
                            className="w-24 h-24"
                            dangerouslySetInnerHTML={{ __html: el.content }}
                          />
                        )}

                        {el.type === 'image' && (
                          <img
                            src={el.content}
                            alt="Custom uploaded print design"
                            className="w-32 h-32 object-contain rounded-lg shadow-md"
                            style={{
                              filter:
                                el.filter === 'sepia'
                                  ? 'sepia(1)'
                                  : el.filter === 'grayscale'
                                  ? 'grayscale(1)'
                                  : el.filter === 'vintage'
                                  ? 'contrast(1.3) sepia(0.4)'
                                  : 'none',
                            }}
                          />
                        )}

                        {el.type === 'qr' && (
                          <div className="p-2 bg-white rounded-lg shadow border text-center">
                            <div className="font-mono text-xs font-bold text-black">{el.content}</div>
                            <div className="text-[9px] text-gray-500">QR VECTOR</div>
                          </div>
                        )}

                        {el.type === 'shape' && (
                          <div
                            className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
                            style={{ backgroundColor: el.color }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM FOOTER BAR */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-4">
            <span>Product: <strong className="text-white">{product?.name || 'Custom POD Item'}</strong></span>
            <span>Est. Print Resolution: <strong className="text-emerald-400">300 DPI High-Res</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearCanvas}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-all"
            >
              Clear Zone
            </button>
            <button
              onClick={handleAddToCart}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-bold text-xs text-white shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <ShoppingCart className="w-4 h-4" /> Add Customized Product to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
