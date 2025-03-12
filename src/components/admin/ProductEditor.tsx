"use client";
import React, { useState } from "react";
import CkEditor from "./Editor";

interface Props {
  editorData: string;
  setEditorData: (data: string) => void;
}
const ProductCkEditor = ({ editorData, setEditorData }: Props) => {
  const [data, setData] = useState<string>("");

  const handleOnUpdate = (editor: string, field: string): void => {
    if (field === "description") {
      // console.log("Editor data field:", editor);
      setData(editor);
    }
  };

  return (
    <div>
      <div className="max-w-3xl mx-auto">
        <CkEditor
          editorData={editorData}
          setEditorData={setEditorData}
          handleOnUpdate={handleOnUpdate}
        />
      </div>
    </div>
  );
};

export default ProductCkEditor;
