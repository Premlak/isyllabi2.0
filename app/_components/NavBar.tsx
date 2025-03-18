"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, CircleUserIcon } from "lucide-react";
import { Sun, Moon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser, SignIn, UserButton } from "@clerk/nextjs";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useTheme } from "next-themes";
import { ColourfulText } from "@/components/ui/ColorfullText";
import { Cover } from "@/components/ui/cover";
export default function NavBar() {
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const { user } = useUser();
  return (
    <>
      <div className="flex h-14 items-center px-4 justify-center">
        <Button
          onClick={() => {
            if (theme == "dark") {
              setTheme("light");
            } else {
              setTheme("dark");
            }
          }}
          variant="outline"
          size="icon"
          className="ml-6 p-2"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <div className="me-10 pl-2 min-w-32 font-bold text-xl">
          <div
            onClick={() => {
              toast("Redirecting To Home");
              router.push("/");
            }}
          >
            <Cover>
              <ColourfulText text="Jaat Vivah" />
            </Cover>
          </div>
        </div>
        {!user && (
          <>
            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  className="me-1 max-sm:py-1 max-sm:px-2 max-sm:-pe-3"
                >
                  <CircleUserIcon></CircleUserIcon>&nbsp;Account
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>Log-IN: & Sign-UP:</DrawerTitle>
                    <DrawerDescription>
                      Maximum Session Can Be Held For 7 Days
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 pb-0">
                    <div className="flex items-center justify-center space-x-2">
                      <SignIn routing="hash"></SignIn>
                    </div>
                  </div>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          </>
        )}
        {user && (
          <>
            <div className=" dark:text-white me-3 text-white md:me-0">
              <UserButton showName />
            </div>
            <div className="md:flex">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast("Redirecting......");
                  router.push("/dashboard");
                }}
              >
                <LayoutDashboard></LayoutDashboard>Profile
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
