// Används för att kunna skriva rich text vilket gör att man kan formatera texten
// Målet är att WYSIWYG - What you see is what you get. Dvs så man formaterar det
// så kommer det se ut när det är publicerat.
import dynamic from "next/dynamic";
const ReactQuill = dynamic(import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function TextField({ value, onChange }) {
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

  return (
    <ReactQuill
      theme="snow"
      modules={modules}
      formats={formats}
      value={value}
      onChange={onChange}
      required
    ></ReactQuill>
  );
}
