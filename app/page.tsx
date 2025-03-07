"use client";
import React, { useEffect, useState } from "react";
import NavBar from "./_components/NavBar";
import { Card, CardContent } from "@/components/ui/card";
import { Facebook, Youtube, Linkedin, Instagram } from "lucide-react";
import { AnimatedTestimonials } from "@/components/ui/animatedTestinomals";
import { TextGenerateEffect } from "@/components/ui/textGenration";
import { BackgroundBeamsWithCollision } from "@/components/ui/backgroundBeamWithCollicison";
export default function Home() {
  const [data, setData]: any = useState([]);
  const [news, setNews]: any = useState();
  const [loading, setLoading] = useState(true);
  async function fetchData() {
    try {
      const res = await fetch("/api/image", { method: "GET" });
      const data1 = await res.json();
      if (data1.news?.news) {
        setNews(data1.news.news);
      }
      if (data1.data) {
        const formattedTestimonials = data1.data.map((item: any) => ({
          quote: item.description,
          name: item.title,
          designation: item.subTitle,
          src: item.src,
        }));
        setData(formattedTestimonials);
      }
      setTimeout(() => {
        console.log(data);
      }, 2000);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div>
        <NavBar />
      </div>
      <div className="mt-4 text-md font-serif flex justify-center items-end p-3">
        <h1>A step towards skilled <strong className="text-red-800">Bharat</strong>: An online platform for skilled courses & internship programs </h1>
      </div>
      {!loading ? (
        <div className="mt-8">
          {news && (
            <BackgroundBeamsWithCollision className="min-h-10 max-h-32">
              <TextGenerateEffect words={news}/>
            </BackgroundBeamsWithCollision>
          )}
          {data.length > 0 && <AnimatedTestimonials testimonials={data}/>}
        </div>
      ) : (
        <></>
      )}
       <footer className=" text-white py-8 mt-12 bg-slate-100">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
        <Card className=" p-4 rounded-lg shadow-md">
          <CardContent>
            <h2 className="text-lg font-semibold mb-2">About iSyllabi</h2>
            <p className="text-sm text-gray-400">
              An online educational platform for courses, internship programs & competitive exams. Registered on MSME
            </p>
          </CardContent>
        </Card>
        <Card className=" p-4 rounded-lg shadow-md">
          <CardContent>
            <div className="flex justify-center align-middle">
            <h2 className="text-lg font-semibold mb-2 flex just">Follow Us</h2>
            </div>
            <div className="flex justify-center gap-4 text-xl items-center mx-auto">
  <a href="https://www.facebook.com/people/ISyllabi/61555804107077/#" className="text-blue-500 hover:text-blue-700"><Facebook /></a>
  <a href="https://www.instagram.com/isyllabi/?utm_source=qr&igsh=dGNpdHEyd3QxYm44#" className="text-pink-500 hover:text-pink-700"><Instagram /></a>
  <a href="https://www.youtube.com/@isyllabi" className="text-red-500 hover:text-pink-700"><Youtube /></a>
  <a href="https://in.linkedin.com/in/isyllabi-584541277" className="text-blue-700 hover:text-blue-900"><Linkedin /></a>
</div>
          </CardContent>
        </Card>
        <Card className=" p-4 rounded-lg shadow-md">
          <CardContent>
            <h2 className="text-lg font-semibold mb-2">Contact Us</h2>
            <p className="text-sm text-gray-400">
              Email: <a href="mailto:thecomputerdiary@gmail.com" className="text-blue-400 hover:underline">thecomputerdiary@gmail.com</a>
            </p>
            <p className="text-sm text-gray-400">Address: Fatehabad, Haryana (125050)</p>
          </CardContent>
        </Card>
      </div>
    </footer>
    </>
  );
}
