"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SingleImageDropzone } from "@/app/_components/image-upload";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

export default function ImageManager() {
  const [img, setImg] = React.useState<File>();
  const [title, setTitle] = React.useState("");
  const [subTitle, setSubTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [images, setImages]: any = React.useState([]);
  const [dis, setDis] = React.useState(false);
  async function uploadImage() {
    if (!img || !title || !subTitle || !description) {
      toast("Please provide all required fields");
      return;
    }
    setDis(true);
    const formData = new FormData();
    formData.append("image", img);
    formData.append("title", title);
    formData.append("subTitle", subTitle);
    formData.append("description", description);
    const res = await fetch("/api/image", {
      method: "POST",
      body: formData,
    });
    const out = await res.json();
    toast.success(out.message);
    loadImages();
    setDis(false);
    setTitle("");
    setSubTitle("");
    setDescription("");
  }
  async function deleteImage(id: string) {
    setDis(true);
    const res = await fetch("/api/image", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: id }),
    });
    const out = await res.json();
    toast(out.message);
    loadImages();
    setDis(false);
  }
  async function loadImages() {
    const res = await fetch("/api/image", { method: "GET" });
    const data = await res.json();
    setImages(data.data);
  }
  React.useEffect(() => {
    loadImages();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <SingleImageDropzone value={img} onChange={setImg} />
      <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2" />
      <Input placeholder="Subtitle" value={subTitle} onChange={(e) => setSubTitle(e.target.value)} className="mt-2" />
      <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-2" />
      <Button onClick={uploadImage} disabled={dis} className="mt-4">
        Upload Image
      </Button>

      {images?.length > 0 && (
        <Table className="mt-6">
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Subtitle</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {images.map((image: { src: string; _id: string; title: string; subTitle: string; description: string }, index: number) => (
              <TableRow key={index}>
                <TableCell>
                  <img src={image.src} alt="Uploaded" width={100} height={100} className="rounded-md" />
                </TableCell>
                <TableCell>{image.title}</TableCell>
                <TableCell>{image.subTitle}</TableCell>
                <TableCell>{image.description}</TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm" onClick={() => deleteImage(image._id)} disabled={dis}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
