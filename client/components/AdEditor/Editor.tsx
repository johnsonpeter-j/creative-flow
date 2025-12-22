'use client';

import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

interface EditorProps {
  initialImage?: string;
}

const Editor: React.FC<EditorProps> = ({ initialImage }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 700,
      backgroundColor: '#f3f4f6',
    });

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (canvas && initialImage) {
      fabric.Image.fromURL(initialImage, (img) => {
        img.scaleToWidth(800);
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      }, { crossOrigin: 'anonymous' });
    }
  }, [canvas, initialImage]);

  const addText = () => {
    if (!canvas) return;

    const text = new fabric.Textbox('Edit me', {
      left: 100,
      top: 100,
      fontSize: 32,
      fill: '#000000',
      editable: true,
      fontFamily: 'Inter',
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const downloadImage = () => {
    if (!canvas) return;

    const dataURL = canvas.toDataURL({
      format: 'jpeg',
      quality: 1,
      multiplier: 1 // enhance quality if needed
    });

    const link = document.createElement('a');
    link.download = 'creative-flow-ad.jpg';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-xl shadow-sm">
      <div className="flex gap-4 mb-4">
        <button
          onClick={addText}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Add Text Layer
        </button>
        <button
          onClick={downloadImage}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Download JPG
        </button>
      </div>
      
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <canvas ref={canvasRef} />
      </div>
      
      <p className="text-sm text-gray-500 mt-2">
        Select text to edit. Drag to move. Use handles to resize.
      </p>
    </div>
  );
};

export default Editor;
