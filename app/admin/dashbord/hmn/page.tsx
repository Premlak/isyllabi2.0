"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function NewsManager() {
  const [news, setNews] = React.useState("");
  const [existingNews, setExistingNews] = React.useState(null);
  const [dis, setDis] = React.useState(false);

  async function fetchNews() {
    const res = await fetch("/api/admin/news", { method: "GET" });
    const data = await res.json();
    if (data.news) {
      setExistingNews(data.news);
      setNews(data.news.news);
    }
  }
  async function handleSave() {
    if (!news) {
      toast("Please enter news content");
      return;
    }
    setDis(true);
    const res = await fetch("/api/admin/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ news }),
    });
    const out = await res.json();
    toast.success(out.message);
    fetchNews();
    setDis(false);
  }

  async function handleDelete() {
    setDis(true);
    const res = await fetch("/api/admin/news", { method: "DELETE" });
    const out = await res.json();
    toast.success(out.message);
    setExistingNews(null);
    setNews("");
    setDis(false);
  }

  React.useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      {existingNews ? (
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Current News</CardTitle>
          </CardHeader>
          <CardContent>
            <Input value={news} onChange={(e) => setNews(e.target.value)} className="mb-4" />
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={dis}>Update News</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={dis}>Delete News</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <Input placeholder="Enter news content" value={news} onChange={(e) => setNews(e.target.value)} />
          <Button onClick={handleSave} disabled={dis} className="mt-2">Create News</Button>
        </div>
      )}
    </div>
  );
}
