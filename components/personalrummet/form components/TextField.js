// Används för att kunna skriva rich text vilket gör att man kan formatera texten
// Målet är att WYSIWYG - What you see is what you get. Dvs så man formaterar det
// så kommer det se ut när det är publicerat.

import { useState } from "react";

import dynamic from "next/dynamic";
const ReactQuill = dynamic(import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function TextField({ _ref, defaultValue }) {
  // Quill toolbar stuff
  let modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ color: [] }],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link"],
      ["clean"],
    ],
  };

  let formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "color",
  ];

  const [value, setValue] = useState(defaultValue);

  return (
    <ReactQuill
      theme="snow"
      modules={modules}
      formats={formats}
      required
      ref={_ref}
      value={value}
      onChange={(value) => {
        setValue(value);
        _ref.current.value = value;
      }}></ReactQuill>
  );
}
