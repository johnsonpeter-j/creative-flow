'use client';

import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { 
  Type, 
  Plus, 
  Minus, 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Trash2, 
  Download, 
  Upload,
  Crop,
  Undo,
  Redo,
  Palette
} from 'lucide-react';

interface EditorProps {
  initialImage?: string;
  initialText?: {
    text: string;
    left?: number;
    top?: number;
    fontSize?: number;
    fill?: string;
    fontFamily?: string;
  };
}

const Editor: React.FC<EditorProps> = ({ initialImage, initialText }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const FONT_FAMILIES = [
    'Inter',
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Verdana',
    'Courier New',
    'Comic Sans MS',
    'Impact',
    'Trebuchet MS',
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 700,
      backgroundColor: '#f3f4f6',
    });

    // Handle object selection
    fabricCanvas.on('selection:created', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });

    fabricCanvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });

    fabricCanvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    // Save state for undo/redo
    fabricCanvas.on('object:modified', saveState);
    fabricCanvas.on('object:added', saveState);
    fabricCanvas.on('object:removed', saveState);

    // Handle text editing to recalculate dimensions
    fabricCanvas.on('text:changed', (e) => {
      const obj = e.target as fabric.Textbox;
      if (obj && obj.type === 'textbox') {
        obj.initDimensions();
        fabricCanvas.renderAll();
      }
    });

    // Handle text editing completion
    fabricCanvas.on('text:editing:exited', (e) => {
      const obj = e.target as fabric.Textbox;
      if (obj && obj.type === 'textbox') {
        obj.initDimensions();
        fabricCanvas.renderAll();
        saveState();
      }
    });

    setCanvas(fabricCanvas);
    saveState();

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  const saveState = () => {
    if (!canvas) return;
    const json = JSON.stringify(canvas.toJSON());
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(json);
    if (newHistory.length > 50) newHistory.shift(); // Limit history
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0 && canvas) {
      const newIndex = historyIndex - 1;
      canvas.loadFromJSON(history[newIndex], () => {
        canvas.renderAll();
        setHistoryIndex(newIndex);
      });
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1 && canvas) {
      const newIndex = historyIndex + 1;
      canvas.loadFromJSON(history[newIndex], () => {
        canvas.renderAll();
        setHistoryIndex(newIndex);
      });
    }
  };

  useEffect(() => {
    if (canvas && initialImage) {
      fabric.Image.fromURL(initialImage, (img) => {
        const scale = canvas.width! / img.width!;
        img.scale(scale);
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        
        if (initialText) {
          setTimeout(() => {
            const text = new fabric.Textbox(initialText.text, {
              left: initialText.left || 100,
              top: initialText.top || 100,
              fontSize: initialText.fontSize || 32,
              fill: initialText.fill || '#000000',
              fontFamily: initialText.fontFamily || 'Inter',
              editable: true,
              width: 600,
              splitByGrapheme: true,
              dynamicMinWidth: 100,
            });
            canvas.add(text);
            canvas.setActiveObject(text);
            canvas.renderAll();
            saveState();
          }, 100);
        }
      }, { crossOrigin: 'anonymous' });
    } else if (canvas && initialText) {
      const text = new fabric.Textbox(initialText.text, {
        left: initialText.left || 100,
        top: initialText.top || 100,
        fontSize: initialText.fontSize || 32,
        fill: initialText.fill || '#000000',
        fontFamily: initialText.fontFamily || 'Inter',
        editable: true,
        width: 600,
        splitByGrapheme: true,
        dynamicMinWidth: 100,
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();
      saveState();
    }
  }, [canvas, initialImage, initialText]);

  const addText = () => {
    if (!canvas) return;
    const text = new fabric.Textbox('Edit me', {
      left: 100,
      top: 100,
      fontSize: 32,
      fill: '#000000',
      editable: true,
      fontFamily: 'Inter',
      width: 400,
      splitByGrapheme: true,
      dynamicMinWidth: 100,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    saveState();
  };

  const updateTextProperty = (property: string, value: any) => {
    if (!canvas || !selectedObject) return;
    const activeObject = canvas.getActiveObject() as fabric.Textbox;
    if (activeObject && activeObject.type === 'textbox') {
      activeObject.set(property, value);
      
      // Recalculate dimensions when font family changes
      if (property === 'fontFamily') {
        activeObject.initDimensions();
      }
      
      canvas.renderAll();
      saveState();
    }
  };

  const increaseFontSize = () => {
    if (!canvas || !selectedObject) return;
    const activeObject = canvas.getActiveObject() as fabric.Textbox;
    if (activeObject && activeObject.type === 'textbox') {
      const currentSize = activeObject.fontSize || 32;
      const newSize = Math.min(currentSize + 4, 200);
      
      // Adjust width proportionally to font size to prevent stretching
      const currentWidth = activeObject.width || 400;
      const widthRatio = newSize / currentSize;
      const newWidth = Math.max(currentWidth * widthRatio, 100);
      
      activeObject.set({
        fontSize: newSize,
        width: newWidth,
      });
      
      // Recalculate text dimensions
      activeObject.initDimensions();
      canvas.renderAll();
      saveState();
    }
  };

  const decreaseFontSize = () => {
    if (!canvas || !selectedObject) return;
    const activeObject = canvas.getActiveObject() as fabric.Textbox;
    if (activeObject && activeObject.type === 'textbox') {
      const currentSize = activeObject.fontSize || 32;
      const newSize = Math.max(currentSize - 4, 8);
      
      // Adjust width proportionally to font size
      const currentWidth = activeObject.width || 400;
      const widthRatio = newSize / currentSize;
      const newWidth = Math.max(currentWidth * widthRatio, 100);
      
      activeObject.set({
        fontSize: newSize,
        width: newWidth,
      });
      
      // Recalculate text dimensions
      activeObject.initDimensions();
      canvas.renderAll();
      saveState();
    }
  };

  const toggleBold = () => {
    if (!canvas || !selectedObject) return;
    const activeObject = canvas.getActiveObject() as fabric.Textbox;
    if (activeObject && activeObject.type === 'textbox') {
      const currentWeight = activeObject.fontWeight as string;
      activeObject.set('fontWeight', currentWeight === 'bold' ? 'normal' : 'bold');
      activeObject.initDimensions();
      canvas.renderAll();
      saveState();
    }
  };

  const toggleItalic = () => {
    if (!canvas || !selectedObject) return;
    const activeObject = canvas.getActiveObject() as fabric.Textbox;
    if (activeObject && activeObject.type === 'textbox') {
      const currentStyle = activeObject.fontStyle as string;
      activeObject.set('fontStyle', currentStyle === 'italic' ? 'normal' : 'italic');
      activeObject.initDimensions();
      canvas.renderAll();
      saveState();
    }
  };

  const setTextAlign = (align: 'left' | 'center' | 'right') => {
    if (!canvas || !selectedObject) return;
    const activeObject = canvas.getActiveObject() as fabric.Textbox;
    if (activeObject && activeObject.type === 'textbox') {
      activeObject.set('textAlign', align);
      activeObject.initDimensions();
      canvas.renderAll();
      saveState();
    }
  };

  const deleteSelected = () => {
    if (!canvas || !selectedObject) return;
    const activeObjects = canvas.getActiveObjects();
    activeObjects.forEach((obj) => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.renderAll();
    setSelectedObject(null);
    saveState();
  };

  const uploadImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvas) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgUrl = event.target?.result as string;
      fabric.Image.fromURL(imgUrl, (img) => {
        img.scaleToWidth(400);
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        saveState();
      });
    };
    reader.readAsDataURL(file);
  };

  const cropImage = () => {
    if (!canvas || !selectedObject) return;
    const activeObject = canvas.getActiveObject() as fabric.Image;
    if (activeObject && activeObject.type === 'image') {
      // Enable crop mode - user can resize the image to crop
      activeObject.set({
        selectable: true,
        hasControls: true,
        hasBorders: true,
      });
      canvas.setActiveObject(activeObject);
      canvas.renderAll();
    }
  };

  const downloadImage = () => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({
      format: 'jpeg',
      quality: 1,
      multiplier: 2,
    });
    const link = document.createElement('a');
    link.download = 'creative-flow-ad.jpg';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isTextSelected = selectedObject && selectedObject.type === 'textbox';
  const isImageSelected = selectedObject && selectedObject.type === 'image';
  const activeText = isTextSelected ? selectedObject as fabric.Textbox : null;

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-xl shadow-lg max-w-6xl mx-auto">
      {/* Main Toolbar */}
      <div className="w-full flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
        {/* Add Elements */}
        <div className="flex gap-2 border-r border-gray-300 pr-3">
          <button
            onClick={addText}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            title="Add Text"
          >
            <Type className="w-4 h-4" />
            <span className="hidden sm:inline">Add Text</span>
          </button>
          <button
            onClick={uploadImage}
            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
            title="Upload Image"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Upload</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-2 border-r border-gray-300 pr-3">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Text Controls - Only show when text is selected */}
        {isTextSelected && (
          <>
            {/* Font Size */}
            <div className="flex gap-1 items-center border-r border-gray-300 pr-3">
              <button
                onClick={decreaseFontSize}
                className="px-2 py-2 bg-gray-200 hover:bg-gray-300 rounded transition"
                title="Decrease Font Size"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-2 text-sm font-medium min-w-[3rem] text-center">
                {activeText?.fontSize || 32}px
              </span>
              <button
                onClick={increaseFontSize}
                className="px-2 py-2 bg-gray-200 hover:bg-gray-300 rounded transition"
                title="Increase Font Size"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Font Family */}
            <select
              value={activeText?.fontFamily || 'Inter'}
              onChange={(e) => updateTextProperty('fontFamily', e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {FONT_FAMILIES.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>

            {/* Text Style */}
            <div className="flex gap-1 border-r border-gray-300 pr-3">
              <button
                onClick={toggleBold}
                className={`px-3 py-2 rounded transition ${
                  activeText?.fontWeight === 'bold'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={toggleItalic}
                className={`px-3 py-2 rounded transition ${
                  activeText?.fontStyle === 'italic'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
            </div>

            {/* Text Alignment */}
            <div className="flex gap-1 border-r border-gray-300 pr-3">
              <button
                onClick={() => setTextAlign('left')}
                className={`px-3 py-2 rounded transition ${
                  activeText?.textAlign === 'left'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                title="Align Left"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTextAlign('center')}
                className={`px-3 py-2 rounded transition ${
                  activeText?.textAlign === 'center'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                title="Align Center"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTextAlign('right')}
                className={`px-3 py-2 rounded transition ${
                  activeText?.textAlign === 'right'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                title="Align Right"
              >
                <AlignRight className="w-4 h-4" />
              </button>
            </div>

            {/* Text Color */}
            <div className="flex items-center gap-2 border-r border-gray-300 pr-3">
              <Palette className="w-4 h-4 text-gray-600" />
              <input
                type="color"
                value={activeText?.fill as string || '#000000'}
                onChange={(e) => updateTextProperty('fill', e.target.value)}
                className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                title="Text Color"
              />
            </div>
          </>
        )}

        {/* Image Controls - Only show when image is selected */}
        {isImageSelected && (
          <div className="flex gap-2 border-r border-gray-300 pr-3">
            <button
              onClick={cropImage}
              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              title="Crop Image"
            >
              <Crop className="w-4 h-4" />
              <span className="hidden sm:inline">Crop</span>
            </button>
          </div>
        )}

        {/* Delete */}
        {selectedObject && (
          <button
            onClick={deleteSelected}
            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
            title="Delete Selected"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        )}

        {/* Download */}
        <button
          onClick={downloadImage}
          className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 ml-auto"
          title="Download"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Download</span>
        </button>
      </div>

      {/* Canvas */}
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-inner">
        <canvas ref={canvasRef} />
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-600 text-center max-w-2xl">
        <p className="mb-1">
          <strong>Text:</strong> Click to edit, drag to move, use handles to resize
        </p>
        <p>
          <strong>Image:</strong> Select and resize to crop, drag to reposition
        </p>
      </div>
    </div>
  );
};

export default Editor;
