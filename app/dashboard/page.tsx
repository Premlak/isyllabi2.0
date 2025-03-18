"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as faceapi from "face-api.js";
import Tesseract from "tesseract.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { SingleImageDropzone } from "@/app/_components/image-upload";
import NavBar from "../_components/NavBar";
import { Progress } from "@/components/progress";
import { toast } from "sonner";
export default function ProfileForm() {
  const [name, setName] = useState("");
  const [locality, setLocality] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [kile, setKile] = useState("");
  const [disbled, setDisable] = useState(false);
  const [mobile, setMobile] = useState("");
  const [employment, setEmployment] = useState("");
  const [salary, setSalary] = useState(10000);
  const [data,setData] = useState(false);
  const [img, setImg] = useState(null);
  const heightOptions = [
    "5'0",
    "5'2",
    "5'4",
    "5'5",
    "5'6",
    "5'7",
    "5'8",
    "5'9",
    "6'0",
    "6,1",
    "6'2",
    "6'3",
    "6'4",
    "6'8",
  ];
  const employmentOptions = [
    "Unemployed",
    "Business Owner",
    "Government Employee",
    "Prive Job",
    "Farming",
  ];
  const analyzeImage = async () => {
    setDisable(true);
    if (!img) return;
    const image = new Image();
    image.src = URL.createObjectURL(img);
    image.onload = async () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(
          "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights"
        ),
        faceapi.nets.tinyFaceDetector.loadFromUri(
          "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights"
        ),
      ]);
      const detections = await faceapi.detectAllFaces(
        canvas,
        new faceapi.TinyFaceDetectorOptions()
      );
      const hasFace = detections.length > 0;
      const { data } = await Tesseract.recognize(image, "eng");
      const cleanedText = data.text.replace(/[^a-zA-Z0-9]/g, "").trim();
      const hasText = cleanedText.length >= 5;
      if (!hasFace) {
        toast("❌ No Face Detected. Re-upload A Photo With Clear Face & Background");
        setDisable(false);
        setImg(null);
        return;
      }
      if (hasText && !hasFace) {
        toast("❌ Watermark Or Text Detected. Re-upload A Photo With Clear Face & Background");
        setDisable(false);
        setImg(null);
        return;
      }
      toast("✅ Image uploaded successfully.");
      setDisable(false);
    };
    setDisable(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !img ||
      name == "" ||
      locality == "" ||
      gender == "" ||
      age == "" ||
      height == "" ||
      kile == "" ||
      mobile == "" ||
      employment == ""
    ) {
      toast("All Fields Are Required");
    } else if (/\d/.test(name)) {
      toast("Name cannot contain numeric values!");
    }
    else {
      setDisable(true);
      const formData = new FormData();
      formData.append("image", img);
      formData.append("name", name);
      formData.append("locality", locality);
      formData.append("gender", gender);
      formData.append("age", age);
      formData.append("height", height);
      formData.append("kile", kile);
      formData.append("mobile", mobile);
      formData.append("employment", employment);
      formData.append("salary", salary.toString());
      const existingProfile = await fetch("/api/profile", { method: "GET" });
      const existingData = await existingProfile.json();
      const method = existingData?.name ? "PUT" : "POST";
      const response = await fetch("/api/profile", {
        method: method,
        body: formData,
      });
      const out: any = await response.json();
      toast.success(out.message);
      setDisable(false);
      getData();
    }
  };
  const getData = async () => {
    const req = await fetch("/api/profile", {
      method: "GET",
    });
    const data = await req.json();
    if (data.message) {
      toast(data.message);
    } else if (data.error) {
      toast(data.error);
    }
    setName(data?.name);
    setLocality(data?.locality);
    setGender(data?.gender);
    setAge(data?.age);
    setHeight(data?.height);
    setKile(data?.kile);
    setMobile(data?.mobile);
    setEmployment(data?.employment);
    setSalary(data?.salary);
    setImg(data?.image);
    setData(true);
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <NavBar />
      <Card className="shadow-2xl border border-gray-200 rounded-xl w-full max-w-lg mx-auto p-6 bg-white">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Locality</Label>
              <Input
                type="text"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Gender</Label>
              <Select onValueChange={setGender} value={gender}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Age</Label>
              <Input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Height</Label>
              <Select onValueChange={setHeight} value={height}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Height" />
                </SelectTrigger>
                <SelectContent>
                  {heightOptions.map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Kile (Plots Owned)</Label>
              <Input
                type="number"
                value={kile}
                onChange={(e) => setKile(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Mobile Number</Label>
              <Input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                maxLength={10}
              />
            </div>

            <div>
              <Label>Current Employment</Label>
              <Select onValueChange={setEmployment} value={employment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Employment" />
                </SelectTrigger>
                <SelectContent>
                  {employmentOptions.map((job) => (
                    <SelectItem key={job} value={job}>
                      {job}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Salary Range (₹{salary})</Label>
              <div className="relative">
                <Progress
                  value={(salary / 250000) * 100}
                  className="h-6 w-full bg-gray-200"
                />
                <input
                  type="range"
                  min={5000}
                  max={250000}
                  step={5000}
                  value={salary}
                  onChange={(e) => setSalary(Number(e.target.value))}
                  className="w-full opacity-0 absolute top-0 left-0 h-full cursor-pointer"
                />
              </div>
            </div>
            <div>
              <Label>Upload Image</Label>
              <SingleImageDropzone value={img} onChange={(file) => {setImg(file); if(file != undefined){analyzeImage();toast("Wait While Processing Image"); setDisable(true)}else{setDisable(false)}}} />
            </div>
            <Button
              type="submit"
              className="w-full text-lg font-semibold"
              disabled={disbled}
            >
              Save Profile
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                setDisable(true);
                const req = await fetch("/api/profile", {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ id: "notging" }),
                });
                const data = await req.json();
                if (
                  data.message &&
                  data.message != "Profile Deleted Successfully"
                ) {
                  toast(data.message);
                  getData();
                }
                if (data.message == "Profile Deleted Successfully") {
                  setName("");
                  setLocality("");
                  setGender("");
                  setAge("");
                  setHeight("");
                  setKile("");
                  setMobile("");
                  setEmployment("");
                  setSalary(5000);
                  setImg(null);
                }
              }}
              className="w-full text-lg font-semibold"
              disabled={disbled}
            >
              Delete Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
