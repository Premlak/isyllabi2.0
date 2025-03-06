"use client";
import dynamic from "next/dynamic";
import * as React from "react";
import { useDashboard } from "@/app/_components/AdminContext";
import { toast } from "sonner";
import { MCQGenrator } from "@/app/_components/McqGenrator";
import { SingleImageDropzone } from "@/app/_components/image-upload";
import { Button } from "@/components/ui/button";
const FroalaEditor = dynamic(() => import("react-froala-wysiwyg"), { ssr: false });
import "froala-editor/css/froala_editor.css";
import "froala-editor/css/froala_editor.min.css";
import "froala-editor/css/froala_editor.pkgd.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.css";
import "froala-editor/css/plugins.pkgd.css";
import "froala-editor/css/plugins.pkgd.min.css";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/js/plugins/image.min.js";
import "froala-editor/js/plugins/video.min.js";

export default function AlterContent() {
  const { tit, it } = useDashboard();
  const [img, setImg] = React.useState(null);
  const [content, setContent] = React.useState("");
  const [dis, setDis] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    loadContent();
  }, []);

  const loadContent = async () => {
    const response = await fetch("/api/topics/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tId: tit }),
    });
    const data = await response.json();
    if (data.content && data.content.length > 0) {
      setContent(data.content[0].con);
    }
  };

  const uploadImage = async () => {
    if (img) {
      toast("Uploading image...");
      const formData = new FormData();
      formData.append("image", img);
      const res = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setContent((prevContent) => prevContent + `<img src="${data.imageUrl}" width="250" height="250"/>`);
        toast("Image uploaded successfully!");
      } else {
        toast("Failed to upload image.");
      }
    }
  };
  const handleSave = async () => {
    if (content) {
      setDis(true);
      const req = await fetch("/api/topics/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tId: tit, con: content }),
      });
      const data = await req.json();
      toast(data.message);
      loadContent();
      setDis(false);
    } else {
      toast("Please Add Some Content Before Saving");
    }
  };

  React.useEffect(() => {
    uploadImage();
  }, [img]);

  if (!isClient) return null; // Ensure content renders only on client side

  return (
    <>
      <div className="flex flex-col justify-center items-center h-100vh w-100vh mx-auto max-w-xs">
        <FroalaEditor
          config={{
            placeholderText: "What to Show To the User",
            toolbarButtons: {
              moreText: {
                buttons: [
                  "bold", "italic", "underline", "strikeThrough", "subscript",
                  "superscript", "fontFamily", "fontSize", "textColor",
                  "backgroundColor", "inlineClass", "inlineStyle", "clearFormatting",
                ],
              },
              moreParagraph: {
                buttons: [
                  "alignLeft", "alignCenter", "formatOLSimple", "alignRight",
                  "alignJustify", "formatOL", "formatUL", "paragraphFormat",
                  "paragraphStyle", "lineHeight", "outdent", "indent", "quote",
                ],
              },
              moreRich: {
                buttons: [
                  "insertLink", "insertImage", "insertTable", "emoticons",
                  "fontAwesome", "specialCharacters", "embedly", "insertVideo",
                ],
              },
              moreMisc: {
                buttons: [
                  "undo", "redo", "fullscreen", "print", "spellChecker",
                  "selectAll", "html", "help",
                ],
                align: "right",
                buttonsVisible: 2,
              },
            },
            charCounterCount: true,
            events: {
              "image.removed": async function ($img) {
                
              },
            },
          }}
          model={content}
          onModelChange={setContent}
        />
      </div>
      <div className="block justify-center content-center items-center mx-auto">
        <div className="w-56 h-56 mt-4">
          <SingleImageDropzone value={img} onChange={setImg} />
        </div>
        {it && <MCQGenrator params={{ id: tit }} />}
        <Button disabled={dis} className="mt-4" onClick={handleSave}>
          Save
        </Button>
      </div>
    </>
  );
}
