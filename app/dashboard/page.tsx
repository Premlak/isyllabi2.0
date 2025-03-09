"use client";
import * as React from "react";
import NavBar from "../_components/NavBar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, BellRing } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
export default function Home() {
  const router = useRouter();
  const [data, setData]: any = React.useState();
  const [name, setName] = React.useState("");
  const [f, setF] = React.useState("");
  const [dis, setDis] = React.useState(false);
  const [m, setM] = React.useState("");
  const [i, setI] = React.useState("");
  const [a, setA] = React.useState("");
  const downloadCertificate = (course: any) => {
    const certDiv = document.createElement("div");
    certDiv.style.width = "900px";
    certDiv.style.height = "650px";
    certDiv.style.padding = "30px";
    certDiv.style.textAlign = "center";
    certDiv.style.fontFamily = "Arial, sans-serif";
    certDiv.style.border = "8px solid #6d1d1d";
    certDiv.style.background = "#fdf7f1";
    certDiv.style.color = "#4d2b1a";
    certDiv.style.borderRadius = "10px";
    certDiv.style.boxShadow = "0px 4px 15px rgba(0, 0, 0, 0.3)";
    certDiv.style.position = "relative";
    certDiv.style.display = "flex";
    certDiv.style.flexDirection = "column";
    certDiv.style.justifyContent = "space-between";
    certDiv.style.alignItems = "center";
    certDiv.style.overflow = "hidden";

    // Header with Logo
    const headerDiv = document.createElement("div");
    headerDiv.style.width = "100%";
    headerDiv.style.display = "flex";
    headerDiv.style.justifyContent = "space-between";
    headerDiv.style.alignItems = "center";
    headerDiv.style.marginBottom = "10px";

    // Header Text (Centered)
    const headerTextDiv = document.createElement("div");
    headerTextDiv.style.flex = "1";
    headerTextDiv.style.textAlign = "center";
    headerTextDiv.innerHTML = `
  <h1 style="font-size: 28px; font-weight: bold; color: #6d1d1d; margin: 0;">iSyllabi</h1>
  <p style="font-size: 14px; color: #4d2b1a; margin: 0;">
    A &nbsp;&nbsp;&nbsp;&nbsp; S &nbsp;T &nbsp;E&nbsp; P&nbsp;&nbsp;&nbsp;&nbsp;  T&nbsp; O &nbsp;W &nbsp;A&nbsp; R&nbsp; D&nbsp; S&nbsp;&nbsp;&nbsp;&nbsp;  
    S&nbsp; K&nbsp; I&nbsp; L&nbsp; L&nbsp; E&nbsp; D&nbsp;&nbsp;&nbsp;&nbsp;  B&nbsp; H&nbsp; A&nbsp; R&nbsp; A&nbsp; T&nbsp; <br>
    ( Registered under MSME )
  </p>
`;

    // Logo (Right-Aligned)
    // const logo = document.createElement("img");
    // logo.src = "./logo.jpeg";
    // logo.style.width = "100px";
    // logo.style.height = "100px";
    // logo.style.borderRadius = "50%";
    // logo.style.marginRight = "10px";

    // Append to header
    headerDiv.appendChild(headerTextDiv);
    // headerDiv.appendChild(logo);
    certDiv.appendChild(headerDiv);

    const formattedDate = course.date
      .split("T")[0]
      .split("-")
      .reverse()
      .join("-");
    certDiv.innerHTML += `
  <h2 style="font-size: 40px; font-weight: bold; color: #6d1d1d; margin-bottom: 0;">CERTIFICATE&nbsp;&nbsp; OF&nbsp;&nbsp; INTERNSHIP</h2>
  <div style="width: 100%; border-bottom: 2px solid #6d1d1d; margin-bottom: 5px; margin-top: 0;"></div>
  <div style="width: 90%; text-align: center;">
    <p style="font-size: 18px; color: #4d2b1a;">
      This internship program certificate is proudly awarded to <strong>${data.user.name}</strong>,
    </p>
    <p style="font-size: 16px; color: #4d2b1a;">
      For his / her outstanding completion of the internship program at iSyllabi in <strong>${course.ExamName}</strong></br>from ${data.user.mName} to ${formattedDate}
    </p>
    <p style="font-size: 16px; color: #4d2b1a; margin-top: 5px;">
       He / She found to be hard working and diligent. We wish his / her all the best for future
    </p>
  </div>
  <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding-top: 30px;">
    <div style="text-align: center;">
      <img src="./director.png" alt="Director Signature" style="width: 80px; height: 50px; object-fit: contain;">
      <p style="margin: 0; font-size: 18px; font-family: 'Trattatello', cursive;">Mahwish</p>
      <p style="margin: 0; font-size: 16px; font-weight: bold;">Director</p>
    </div>
    <div style="text-align: center;">
      <img src="./manager.png" alt="Program Manager Signature" style="width: 80px; height: 50px; object-fit: contain; margin-left: 20px;">
      <p style="margin: 0; font-size: 18px; font-family: 'Trattatello', cursive;">Sanjay Kumar</p>
      <p style="margin: 0; font-size: 16px; font-weight: bold;">Program Manager</p>
    </div>
  </div>
`;
    const watermark = document.createElement("div");
    watermark.innerText = "iSyllabi";
    watermark.style.position = "absolute";
    watermark.style.top = "50%";
    watermark.style.left = "50%";
    watermark.style.transform = "translate(-50%, -50%)";
    watermark.style.fontSize = "80px";
    watermark.style.fontWeight = "bold";
    watermark.style.color = "rgba(0, 0, 0, 0.05)";
    watermark.style.zIndex = "0";
    certDiv.appendChild(watermark);
    document.body.appendChild(certDiv);
    html2canvas(certDiv).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4");
      pdf.addImage(imgData, "PNG", 10, 10, 277, 190);
      pdf.save(`${data.user.name}-Certificate.pdf`);
      document.body.removeChild(certDiv);
    });
  };
  const loadData = async () => {
    const request = await fetch("/api/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await request.json();
    if(data.message != ""){toast(data.message)};
    console.log(data);
    if (!data.flag) {
      router.push("/");
    } else {
      setData(data);
    }
  };
  const saveUser = async () => {
    if (name == "" || f == "" || m == "" || i == "" || a == "") {
      toast("All Fields Are Required");
    } else {
      setDis(true);
      const req = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, f, m, i, a }),
      });
      const data = await req.json();
      if(data.message != ""){toast(data.message)};
      loadData();
      setDis(false);
      const inputElement = document.activeElement; 
      if (
        inputElement.tagName === "INPUT" ||
        inputElement.tagName === "TEXTAREA"
      ) {
        inputElement.blur();
      }
      toast(
        "You can now apply for a certificate by visiting the course section"
      );
    }
  };
  React.useEffect(() => {
    loadData();
  }, []);
  return (
    <>
      <NavBar />
      {data ? (
        <div className="grid justify-center content-center items-center mx-auto w-full h-full mt-4">
          <div className="flex justify-center items-center mx-auto w-full h-full mt-4">
            {!data.user ? (
              <>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant={"outline"}>Complete Profile</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[450px] mx-auto">
                    <DialogHeader>
                      <DialogTitle>Let Us Know You</DialogTitle>
                      <DialogDescription className="text-red-400">
                        This Information Is Not Editable In Future & Will Be
                        Used To Generate Your Certificate
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Name</Label>
                        <Input
                          className="col-span-3"
                          onChange={(e) => {
                            setName(e.target.value);
                          }}
                          placeholder="Enter Your Good Name"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Father Name</Label>
                        <Input
                          className="col-span-3"
                          onChange={(e) => {
                            setF(e.target.value);
                          }}
                          placeholder="Enter Your Father Name"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">
                          Training Start From
                        </Label>
                        <Input
                          type="date"
                          onChange={(e) => {
                            const selectedDate = new Date(e.target.value);
                            const today = new Date();
                            if (selectedDate > today) {
                              toast(
                                "Please select a date that is not in the future."
                              );
                              e.target.value = "";
                            } else {
                              const formattedDate = selectedDate
                                .toLocaleDateString("en-GB")
                                .split("/")
                                .join("-");
                              setM(formattedDate);
                            }
                          }}
                          placeholder="Enter Training Starting Date"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">
                          Institute or Collage
                        </Label>
                        <Input
                          className="col-span-3"
                          onChange={(e) => {
                            setI(e.target.value);
                          }}
                          placeholder="Currently Stydying At"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Address</Label>
                        <Input
                          className="col-span-3"
                          onChange={(e) => {
                            setA(e.target.value);
                          }}
                          placeholder="Required For Placement Releted Events"
                        />
                      </div>
                      {/* Rest of the Input fields */}
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={() => {
                          saveUser();
                        }}
                        disabled={dis}
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              <Card className="w-[350px] sm:max-w-350px bg-blue-200">
                <CardHeader>
                  <CardTitle>{data.user.name}</CardTitle>
                  <CardDescription>Welcome Back!</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className=" flex items-center space-x-4 rounded-md border p-4">
                    <BellRing />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        You Like iSyllabi
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Disable if you don't like it
                      </p>
                    </div>
                    <Switch
                      checked={true}
                      onClick={() =>
                        toast("Unable to perform this at this time")
                      }
                    />
                  </div>
                  <div>
                    <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                      <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {data.user.fName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Your Father Name
                        </p>
                      </div>
                    </div>
                    <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                      <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {data.user.mName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Traning Starting Date
                        </p>
                      </div>
                    </div>
                    <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                      <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {data.user.iName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Your Institute
                        </p>
                      </div>
                    </div>
                    <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                      <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {data.user.address}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Used for placement regarding query
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => {
                      window.location.assign("https://wa.me/918307030976");
                    }}
                    className="w-full"
                  >
                    <Check /> &nbsp;Helo & Support
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
          <div className="w-full flex justify-center items-center mx-auto h-full mt-4">
            <Card className="w-[350px] sm:max-w-350px mx-auto bg-blue-200">
              <CardHeader>
                <CardTitle>Your Certificates</CardTitle>
                <CardDescription>
                  Only Shown If You Quliffied Any Exam
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div>
                  {data.exam.length > 0 &&
                    data.exam.map((course: any) => {
                      return (
                        <div
                          className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                          key={course.cId}
                        >
                          <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {course.ExamName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <div className="flex justify-between mt-2">
                                <div>
                                  <p>
                                    Click on certificate to Download
                                  </p>
                                </div>
                                <div>
                                  <Badge
                                    onClick={() => {
                                      downloadCertificate(course);
                                    }}
                                  >
                                    Certificate
                                  </Badge>
                                </div>
                              </div>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="w-full flex justify-center items-center mx-auto h-full mt-4">
            <Card className="w-[350px] sm:max-w-350px mx-auto bg-blue-200">
              <CardHeader>
                <CardTitle>Your Courses</CardTitle>
                <CardDescription>
                  Only Shown If You Are A Premium User
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div>
                  {data.Courses.length > 0 &&
                    data.Courses.map((course: any) => {
                      const expiryDate = new Date(course.expiryDate);
                      return (
                        <div
                          className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                          key={course.cId}
                        >
                          <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {course.courseName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <div className="flex justify-between mt-2">
                                <div>
                                  <Badge
                                    onClick={() => {
                                      toast("Redirecting....");
                                      router.push(
                                        `/courses/${course.courseId}`
                                      );
                                    }}
                                  >
                                    Open Now
                                  </Badge>
                                </div>
                                <div>
                                  Valid Till:&nbsp;{expiryDate.getDate()}-
                                  {expiryDate.getMonth() + 1}-
                                  {expiryDate.getFullYear()}
                                </div>
                              </div>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="grid place-items-center mx-auto mt-10">
          {[...Array(10)].map((_, idx) => (
            <div key={idx} className="flex items-center space-x-4 mt-3">
              <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px] bg-gray-400" />
                <Skeleton className="h-4 w-[200px] bg-gray-300" />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
