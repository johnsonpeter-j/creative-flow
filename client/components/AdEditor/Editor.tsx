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
    fontWeight?: 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
    textAlign?: 'left' | 'center' | 'right';
  };
  initialTexts?: Array<{
    text: string;
    type?: 'headline' | 'body' | 'cta';
    left?: number;
    top?: number;
    fontSize?: number;
    fill?: string;
    fontFamily?: string;
    fontWeight?: 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
    textAlign?: 'left' | 'center' | 'right';
  }>;
  onCanvasChange?: (dataURL: string) => void;
}

const Editor: React.FC<EditorProps> = ({ initialImage, initialText, initialTexts, onCanvasChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalImageSizeRef = useRef<{ width: number; height: number } | null>(null);

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

    const calculateCanvasSize = () => {
      const container = canvasRef.current?.parentElement;
      if (!container) return { width: 800, height: 700 };
      
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const padding = 32;
      
      // Use most of the container space, with reasonable max sizes
      const maxWidth = Math.min(containerWidth - padding, 1400);
      const maxHeight = Math.max(containerHeight - padding, 600);
      
      return { width: maxWidth, height: maxHeight };
    };

    const { width, height } = calculateCanvasSize();
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: width,
      height: height,
      backgroundColor: '#f3f4f6',
    });
    
    // Store calculateCanvasSize for resize handler
    const canvasSizeCalculator = calculateCanvasSize;

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

    // Function to notify parent of canvas changes
    const notifyCanvasChange = () => {
      if (onCanvasChange && fabricCanvas) {
        try {
          const dataURL = fabricCanvas.toDataURL({
            format: 'jpeg',
            quality: 1,
            multiplier: 1,
          });
          onCanvasChange(dataURL);
        } catch (error) {
          console.error('Error generating canvas data URL:', error);
        }
      }
    };

    // Save state for undo/redo and notify changes
    fabricCanvas.on('object:modified', () => {
      saveState();
      notifyCanvasChange();
    });
    fabricCanvas.on('object:added', () => {
      saveState();
      notifyCanvasChange();
    });
    fabricCanvas.on('object:removed', () => {
      saveState();
      notifyCanvasChange();
    });

    // Handle text editing to recalculate dimensions
    fabricCanvas.on('text:changed', (e) => {
      const obj = e.target as fabric.Textbox;
      if (obj && obj.type === 'textbox') {
        obj.initDimensions();
        fabricCanvas.renderAll();
        notifyCanvasChange();
      }
    });

    // Handle text editing completion
    fabricCanvas.on('text:editing:exited', (e) => {
      const obj = e.target as fabric.Textbox;
      if (obj && obj.type === 'textbox') {
        obj.initDimensions();
        fabricCanvas.renderAll();
        saveState();
        notifyCanvasChange();
      }
    });

    setCanvas(fabricCanvas);
    saveState();

    // Handle window resize - dynamically resize image if it exists
    const handleResize = () => {
      if (!canvasRef.current || !fabricCanvas) return;
      
      // If there's an image with stored original dimensions, recalculate
      if (originalImageSizeRef.current && initialImage) {
        const { width: imgWidth, height: imgHeight } = originalImageSizeRef.current;
        const container = canvasRef.current?.parentElement?.parentElement;
        
        if (container && originalImageSizeRef.current) {
          const { width: imgWidth, height: imgHeight } = originalImageSizeRef.current;
          
          // Get actual toolbar height dynamically
          const toolbar = container.querySelector('.bg-gray-50');
          const toolbarHeight = toolbar ? (toolbar as HTMLElement).offsetHeight + 2 : 50;
          const gap = 2;
          
          const containerWidth = container.clientWidth || container.offsetWidth;
          const containerHeight = container.clientHeight || container.offsetHeight;
          
          const availableWidth = containerWidth;
          const availableHeight = containerHeight - toolbarHeight - gap;
          
          // Calculate scale to fit FULL image (handles both vertical and horizontal)
          const scaleX = availableWidth / imgWidth;
          const scaleY = availableHeight / imgHeight;
          const scale = Math.min(scaleX, scaleY); // Ensures full image fits
          
          // Canvas size = scaled image size (full image visible)
          const canvasWidth = Math.floor(imgWidth * scale);
          const canvasHeight = Math.floor(imgHeight * scale);
          
          fabricCanvas.setDimensions({ width: canvasWidth, height: canvasHeight });
          
          // Update image scale to show full image
          const objects = fabricCanvas.getObjects();
          const backgroundImage = objects.find(obj => obj.type === 'image' && !obj.selectable);
          if (backgroundImage) {
            (backgroundImage as fabric.Image).set({
              scaleX: scale,
              scaleY: scale,
            });
          }
        }
      } else {
        // No image, use default calculation
        const { width, height } = calculateCanvasSize();
        fabricCanvas.setDimensions({ width, height });
      }
      
      fabricCanvas.renderAll();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
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
    const addTextLayers = (texts: Array<{
      text: string;
      type?: 'headline' | 'body' | 'cta';
      left?: number;
      top?: number;
      fontSize?: number;
      fill?: string;
      fontFamily?: string;
      fontWeight?: 'normal' | 'bold';
      fontStyle?: 'normal' | 'italic';
      textAlign?: 'left' | 'center' | 'right';
    }>) => {
      if (!canvas) return;
      
      const canvasWidth = canvas.width || 800;
      const canvasHeight = canvas.height || 600;
      const placedTexts: Array<{ top: number; bottom: number; left: number; right: number }> = [];
      const minVerticalSpacing = canvasHeight * 0.15; // 15% minimum spacing between texts
      
      // Sort texts by type: headline first, then CTA (skip body)
      const sortedTexts = texts
        .filter(t => t.type !== 'body') // Remove body text to avoid clutter
        .sort((a, b) => {
          const order = { headline: 0, cta: 1 };
          return (order[a.type as keyof typeof order] ?? 2) - (order[b.type as keyof typeof order] ?? 2);
        });
      
      sortedTexts.forEach((textConfig, index) => {
        setTimeout(() => {
          // Convert percentage positions to pixels if needed (API returns 0-100 for percentages)
          // If value is <= 100, treat as percentage; if > 100, treat as pixels
          let left = textConfig.left !== undefined 
            ? (textConfig.left <= 100 ? (textConfig.left / 100) * canvasWidth : textConfig.left) 
            : canvasWidth / 2; // Default to center
          
          // For center-aligned text, adjust left position
          if (textConfig.textAlign === 'center') {
            left = canvasWidth / 2;
          }
          
          let top = textConfig.top !== undefined 
            ? (textConfig.top <= 100 ? (textConfig.top / 100) * canvasHeight : textConfig.top) 
            : (textConfig.type === 'headline' ? canvasHeight * 0.1 : canvasHeight * 0.9);
          
          // Estimate text dimensions
          const fontSize = textConfig.fontSize || 32;
          const estimatedHeight = fontSize * 2; // More conservative height estimate
          const estimatedWidth = Math.min(canvasWidth * 0.8, textConfig.text.length * fontSize * 0.6);
          
          // Adjust left for center alignment
          if (textConfig.textAlign === 'center') {
            left = (canvasWidth - estimatedWidth) / 2;
          }
          
          const bottom = top + estimatedHeight;
          const right = left + estimatedWidth;
          
          // Check for overlap with previously placed texts and adjust if needed
          let adjusted = false;
          for (const placed of placedTexts) {
            // Check vertical overlap
            const verticalOverlap = !(bottom < placed.top || top > placed.bottom);
            // Check horizontal overlap (with some margin)
            const horizontalOverlap = !(right < placed.left - 20 || left > placed.right + 20);
            
            if (verticalOverlap && horizontalOverlap) {
              // Adjust position to avoid overlap
              if (textConfig.type === 'headline') {
                // Headline should be at top - move it up if needed
                top = Math.max(10, placed.top - estimatedHeight - minVerticalSpacing);
              } else if (textConfig.type === 'cta') {
                // CTA should be at bottom - move it down if needed
                top = Math.min(canvasHeight - estimatedHeight - 10, placed.bottom + minVerticalSpacing);
              } else {
                // For other types, find a safe position
                if (top < placed.top) {
                  top = placed.top - estimatedHeight - minVerticalSpacing;
                } else {
                  top = placed.bottom + minVerticalSpacing;
                }
              }
              adjusted = true;
            }
          }
          
          // Ensure text stays within canvas bounds
          top = Math.max(10, Math.min(top, canvasHeight - estimatedHeight - 10));
          left = Math.max(10, Math.min(left, canvasWidth - estimatedWidth - 10));
          
          // Store this text's position for future overlap checks
          placedTexts.push({ 
            top, 
            bottom: top + estimatedHeight, 
            left, 
            right: left + estimatedWidth 
          });
          
          // Adjust width based on text length and canvas size
          const maxWidth = Math.min(canvasWidth * 0.85, 600);
          const text = new fabric.Textbox(textConfig.text, {
            left: left,
            top: top,
            fontSize: textConfig.fontSize || 32,
            fill: textConfig.fill || '#000000',
            fontFamily: textConfig.fontFamily || 'Inter',
            fontWeight: textConfig.fontWeight === 'bold' ? 'bold' : 'normal',
            fontStyle: textConfig.fontStyle === 'italic' ? 'italic' : 'normal',
            textAlign: textConfig.textAlign || 'center',
            editable: true,
            width: maxWidth,
            splitByGrapheme: true,
            dynamicMinWidth: 100,
          });
          canvas.add(text);
          if (index === sortedTexts.length - 1) {
            canvas.setActiveObject(text);
          }
          canvas.renderAll();
          
          // Notify parent after all text layers are added
          if (index === sortedTexts.length - 1 && onCanvasChange) {
            setTimeout(() => {
              try {
                const dataURL = canvas.toDataURL({
                  format: 'jpeg',
                  quality: 1,
                  multiplier: 1,
                });
                onCanvasChange(dataURL);
              } catch (error) {
                console.error('Error generating canvas data URL after text added:', error);
              }
            }, 200);
          }
        }, 150 * (index + 1));
      });
      
      setTimeout(() => saveState(), 150 * sortedTexts.length + 100);
    };

    if (canvas && initialImage) {
      fabric.Image.fromURL(initialImage, (img) => {
        const imgWidth = img.width!;
        const imgHeight = img.height!;
        
        // Wait a bit for DOM to be fully rendered
        setTimeout(() => {
          // Get the Editor root container
          const container = canvasRef.current?.parentElement?.parentElement;
          if (!container) return;
          
          // Get toolbar height
          const toolbar = container.querySelector('.bg-gray-50');
          const toolbarHeight = toolbar ? (toolbar as HTMLElement).offsetHeight + 4 : 50;
          const gap = 4;
          
          // Use viewport dimensions directly for maximum size
          // The page uses 60vh for content area
          const viewportHeight = window.innerHeight;
          const viewportWidth = window.innerWidth;
          
          // Calculate available space from viewport (60vh content area)
          const contentAreaHeight = viewportHeight * 0.6; // 60vh
          const contentAreaWidth = Math.min(viewportWidth - 100, 1600); // Full width minus margins
          
          // Also check actual container dimensions
          const containerWidth = container.clientWidth || container.offsetWidth || contentAreaWidth;
          const containerHeight = container.clientHeight || container.offsetHeight || contentAreaHeight;
          
          // Use the larger dimensions for maximum size
          const availableWidth = Math.max(containerWidth, contentAreaWidth) - 20; // Small margin
          const availableHeight = Math.max(containerHeight, contentAreaHeight) - toolbarHeight - gap;
          
          // Calculate scale to fit FULL image - maximize size
          const scaleX = availableWidth / imgWidth;
          const scaleY = availableHeight / imgHeight;
          
          // Use Math.min to ensure FULL image fits (no cropping)
          // This works for both portrait and landscape images
          const scale = Math.min(scaleX, scaleY);
          
          // Calculate canvas size to show full image at maximum size
          const canvasWidth = Math.floor(imgWidth * scale);
          const canvasHeight = Math.floor(imgHeight * scale);
        
          // Set canvas to fit the full image (maintains aspect ratio)
          canvas.setDimensions({
            width: canvasWidth,
            height: canvasHeight,
          });
          
          // Scale image to match canvas exactly
          // Image width = canvas width, Image height = canvas height
          // This ensures full image is visible for both vertical and horizontal images
          img.set({
            left: 0,
            top: 0,
            scaleX: scale,
            scaleY: scale,
            selectable: false,
            evented: false,
            lockMovementX: true,
            lockMovementY: true,
            lockRotation: true,
            lockScalingX: true,
            lockScalingY: true,
          });
          
          // Add image to canvas and send to back
          canvas.add(img);
          canvas.sendToBack(img);
          canvas.renderAll();
          
          // Notify parent of initial canvas state (image loaded)
          if (onCanvasChange) {
            setTimeout(() => {
              try {
                const dataURL = canvas.toDataURL({
                  format: 'jpeg',
                  quality: 1,
                  multiplier: 1,
                });
                onCanvasChange(dataURL);
              } catch (error) {
                console.error('Error generating initial canvas data URL:', error);
              }
            }, 150);
          }
          
          // Use initialTexts if provided, otherwise use initialText
          if (initialTexts && initialTexts.length > 0) {
            setTimeout(() => addTextLayers(initialTexts), 200);
          } else if (initialText) {
            setTimeout(() => addTextLayers([initialText]), 200);
          }
        }, 100); // Small delay to ensure DOM is ready
      }, { crossOrigin: 'anonymous' });
    } else if (canvas) {
      // No image, just add text layers
      if (initialTexts && initialTexts.length > 0) {
        addTextLayers(initialTexts);
      } else if (initialText) {
        addTextLayers([initialText]);
      }
    }
  }, [canvas, initialImage, initialText, initialTexts]);

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

  const updateTextProperty = (property: keyof fabric.Textbox, value: any) => {
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
    <div className="flex flex-col items-center gap-1 p-0 bg-white rounded-xl shadow-lg w-full h-full max-w-full">
      {/* Main Toolbar */}
      <div className="w-full flex flex-wrap gap-1.5 p-2 bg-gray-50 rounded-lg border border-gray-200 flex-shrink-0">
        {/* Add Elements */}
        <div className="flex gap-1.5 border-r border-gray-300 pr-2">
          <button
            onClick={addText}
            className="p-2 text-white rounded-lg transition flex items-center justify-center"
            style={{
              backgroundColor: 'var(--color-frame)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            title="Add Text"
          >
            <Type className="w-4 h-4" />
          </button>
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1.5 border-r border-gray-300 pr-2">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-2 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            style={{
              backgroundColor: 'var(--color-frame)',
            }}
            onMouseEnter={(e) => {
              if (historyIndex > 0) {
                e.currentTarget.style.opacity = '0.9';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = historyIndex <= 0 ? '0.5' : '1';
            }}
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            style={{
              backgroundColor: 'var(--color-frame)',
            }}
            onMouseEnter={(e) => {
              if (historyIndex < history.length - 1) {
                e.currentTarget.style.opacity = '0.9';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = historyIndex >= history.length - 1 ? '0.5' : '1';
            }}
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Text Controls - Only show when text is selected */}
        {isTextSelected && (
          <>
            {/* Font Size */}
            <div className="flex gap-1 items-center border-r border-gray-300 pr-2">
              <button
                onClick={decreaseFontSize}
                className="p-1.5 bg-gray-200 hover:bg-gray-300 rounded transition"
                title="Decrease Font Size"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-1.5 text-xs font-medium min-w-[2.5rem] text-center">
                {activeText?.fontSize || 32}px
              </span>
              <button
                onClick={increaseFontSize}
                className="p-1.5 bg-gray-200 hover:bg-gray-300 rounded transition"
                title="Increase Font Size"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Font Family */}
            <select
              value={activeText?.fontFamily || 'Inter'}
              onChange={(e) => updateTextProperty('fontFamily', e.target.value)}
              className="px-2 py-1.5 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {FONT_FAMILIES.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>

            {/* Text Style */}
            <div className="flex gap-1 border-r border-gray-300 pr-2">
              <button
                onClick={toggleBold}
                className={`p-2 rounded transition ${
                  activeText?.fontWeight === 'bold'
                    ? 'text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                style={activeText?.fontWeight === 'bold' ? { backgroundColor: 'var(--color-frame)' } : {}}
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={toggleItalic}
                className={`p-2 rounded transition ${
                  activeText?.fontStyle === 'italic'
                    ? 'text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                style={activeText?.fontStyle === 'italic' ? { backgroundColor: 'var(--color-frame)' } : {}}
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
            </div>

            {/* Text Alignment */}
            <div className="flex gap-1 border-r border-gray-300 pr-2">
              <button
                onClick={() => setTextAlign('left')}
                className={`p-2 rounded transition ${
                  activeText?.textAlign === 'left'
                    ? 'text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                style={activeText?.textAlign === 'left' ? { backgroundColor: 'var(--color-frame)' } : {}}
                title="Align Left"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTextAlign('center')}
                className={`p-2 rounded transition ${
                  activeText?.textAlign === 'center'
                    ? 'text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                style={activeText?.textAlign === 'center' ? { backgroundColor: 'var(--color-frame)' } : {}}
                title="Align Center"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTextAlign('right')}
                className={`p-2 rounded transition ${
                  activeText?.textAlign === 'right'
                    ? 'text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                style={activeText?.textAlign === 'right' ? { backgroundColor: 'var(--color-frame)' } : {}}
                title="Align Right"
              >
                <AlignRight className="w-4 h-4" />
              </button>
            </div>

            {/* Text Color */}
            <div className="flex items-center gap-1.5 border-r border-gray-300 pr-2">
              <Palette className="w-3.5 h-3.5 text-gray-600" />
              <input
                type="color"
                value={activeText?.fill as string || '#000000'}
                onChange={(e) => updateTextProperty('fill', e.target.value)}
                className="w-8 h-7 rounded border border-gray-300 cursor-pointer"
                title="Text Color"
              />
            </div>
          </>
        )}

        {/* Image Controls - Only show when image is selected */}
        {isImageSelected && (
          <div className="flex gap-1.5 border-r border-gray-300 pr-2">
            <button
              onClick={cropImage}
              className="p-2 text-white rounded-lg transition flex items-center justify-center"
              style={{
                backgroundColor: 'var(--color-frame)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              title="Crop Image"
            >
              <Crop className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Delete */}
        {selectedObject && (
          <button
            onClick={deleteSelected}
            className="p-2 text-white rounded-lg transition flex items-center justify-center"
            style={{
              backgroundColor: 'var(--color-frame)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            title="Delete Selected"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        {/* Download */}
        <button
          onClick={downloadImage}
          className="p-2 text-white rounded-lg transition flex items-center justify-center ml-auto"
          style={{
            backgroundColor: 'var(--color-frame)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
          title="Download"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 min-h-0 w-full flex items-center justify-center p-0 m-0 overflow-auto">
        <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-inner inline-block">
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
};

export default Editor;
