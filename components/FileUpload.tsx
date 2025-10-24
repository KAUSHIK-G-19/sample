
import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/IconComponents';

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
      e.dataTransfer.clearData();
    }
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const removeFile = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName));
  };
  
  return (
    <div className="p-6">
      <div className="bg-gray-800 rounded-lg p-8">
        <div 
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors duration-300 ${isDragging ? 'border-blue-500 bg-gray-700' : 'border-gray-600 hover:border-gray-500'}`}
        >
          <input 
            type="file" 
            multiple 
            className="hidden" 
            id="file-upload"
            onChange={handleFileChange}
            accept=".mp4, .mp3, .pdf, .png, .jpg, .jpeg, .gif"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <UploadIcon className="mx-auto h-12 w-12 text-gray-500" />
            <p className="mt-2 text-gray-300">
              <span className="font-semibold text-blue-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">MP4, MP3, PDF, or Images</p>
          </label>
        </div>
        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-200">Selected Files:</h3>
            <ul className="mt-2 space-y-2">
              {files.map((file, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
                  <span className="text-sm text-gray-300 truncate">{file.name}</span>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-4">{(file.size / 1024).toFixed(2)} KB</span>
                    <button onClick={() => removeFile(file.name)} className="text-red-400 hover:text-red-300">
                      &times;
                    </button>
                  </div>
                </li>
              ))}
            </ul>
             <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
              Submit All Files
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
