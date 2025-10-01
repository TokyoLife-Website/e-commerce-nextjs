"use client";
import React, { useState } from "react";
import CkEditor from "./Editor";

interface Props {
  editorData: string;
  setEditorData: (data: string) => void;
}
const ProductCkEditor = ({ editorData, setEditorData }: Props) => {
  return (
    <div className="max-w-3xl mx-auto">
      <CkEditor editorData={editorData} setEditorData={setEditorData} />
    </div>
  );
};

export default ProductCkEditor;
