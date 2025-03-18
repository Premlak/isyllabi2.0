"use client";
import React, { useEffect, useState } from "react";
import NavBar from "./_components/NavBar";
import { Card, CardContent } from "@/components/ui/card";
import { Facebook } from "lucide-react";
import { AnimatedProfiles } from "@/components/ui/animatedTestinomals";
import { TextGenerateEffect } from "@/components/ui/textGenration";
import { useRouter } from "next/navigation";
import { BackgroundBeamsWithCollision } from "@/components/ui/backgroundBeamWithCollicison";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
export default function Home() {
  const [data, setData]: any = useState([]);
  const router = useRouter();
  const [news, setNews]: any = useState();
  const {isSignedIn} = useUser();
  const [loading, setLoading] = useState(true);
  async function fetchData() {
    try {
      const req = await fetch("/api/data", { method: "GET" });
      const data = await req.json();
  
      if (isSignedIn && data.message === "Profile Not Found") {
        toast("Please Complete Your Profile First");
        router.push("/dashboard");
        return;
      }
      
      if (data.message === "Login To Your Account First") {
        toast("Please Login To Your Account First");
        return;
      }
      setNews(data.news.news);
      setTimeout(() => {
        if (data.data) {
          const formattedProfiles = data.data.map((item: any) => ({
            name: item.name,
            image: item.image,
            locality: item.locality,
            age: item.age,
            height: item.height,
            employment: item.employment,
            salary: item.salary,
            mobile: item.mobile,
            isPremium: data.isPremium, 
            kile: item.kile
          }));
          setData(formattedProfiles);
        }
        setLoading(false);
      }, 0);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  }
  
  useEffect(() => {
    fetchData();
  }, []);
  
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <div>
        <NavBar />
      </div>
      {!loading ? (
        <div className="mt-8">
          {news && (
            <BackgroundBeamsWithCollision className="min-h-10 max-h-32">
              <TextGenerateEffect words={news} />
            </BackgroundBeamsWithCollision>
          )}
          {data.length > 0 && <AnimatedProfiles profiles={data} />}
        </div>
      ) : (
        <></>
      )}
      <footer className=" text-white py-8 mt-12 bg-slate-100 dark:bg-slate-800">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <Card className=" p-4 rounded-lg shadow-md">
            <CardContent>
              <h2 className="text-lg font-semibold mb-2">About जाट विवाह</h2>
              <p className="text-sm text-gray-400">
              A dedicated online platform exclusively designed for Jaat and village-based marriages, serving as an alternative to Shaadi.com and Tinder
              </p>
            </CardContent>
          </Card>
          <Card className=" p-4 rounded-lg shadow-md">
            <CardContent>
              <div className="flex justify-center align-middle">
                <h2 className="text-lg font-semibold mb-2 flex just">
                  Follow Us On
                </h2>
              </div>
              <div className="flex justify-center gap-4 text-xl items-center mx-auto">
                <a
                  href="https://www.facebook.com/profile.php?id=61574112716462"
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Facebook />
                </a>
              </div>
            </CardContent>
          </Card>
          <Card className=" p-4 rounded-lg shadow-md">
            <CardContent>
              <h2 className="text-lg font-semibold mb-2">Contact Us</h2>
              <p className="text-sm text-gray-400">
                Email:{" "}
                <a
                  href="mailto:96119611godara@gmail.com"
                  className="text-blue-400 hover:underline"
                >
                  96119611godara@gmail.com
                </a>
              </p>
              <p className="text-sm text-gray-400">
                Address: Fatehabad, Haryana (125050)
              </p>
              <p className="text-sm text-gray-400">
                Phone:{" "}
                <a
                  href="tel:+918570886733"
                  className="text-blue-400 hover:underline"
                >
                  +9185708 86733 
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </footer>
    </>
  );
}
