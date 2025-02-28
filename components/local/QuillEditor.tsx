"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Load ReactQuill dynamically to prevent SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading editor...</div>;
  }

  return (
    
    <ReactQuill
      theme='snow'
      value={value}
      onChange={onChange}
      placeholder='Write your email message...'
      className="min-h-20"
    />
  );
};

export default QuillEditor;
