"use client";
import * as React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Menu,
  LayoutDashboard,
  CircleUserIcon,
  GraduationCap,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Sun, Moon,  ChevronsUpDown, UserRound } from "lucide-react";
import { Terminal, BookOpenIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { useUser, SignIn, UserButton } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ColourfulText } from "@/components/ui/ColorfullText";
import { Cover } from "@/components/ui/cover";
import { TextGenerateEffect } from "@/components/ui/textGenration";
export default function NavBar() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const [coll, setColl] = React.useState(false);
  const { setTheme, theme } = useTheme();
  const [coll2, setColl2] = React.useState(false);
  const [coll3, setColl3] = React.useState(false);
  const { user } = useUser();
  const [courses, setCourses] = React.useState([]);
  // const [books, setBooks] = React.useState([]);
  const loadCourses = async () => {
    const data = await fetch("/api/courses", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // const data2 = await fetch("/api/books", {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // const res2 = await data2.json();
    // setBooks(res2.courses);
    const res = await data.json();
    setCourses(res.courses);
  };
  React.useEffect(() => {
    loadCourses();
  }, []);
  return (
    <>
      <div className="flex h-14 items-center px-4 justify-center">
      <Button onClick={()=>{if(theme == "dark"){setTheme("light")}else{setTheme("dark")}}} variant="outline" size="icon" className="ml-6 p-2">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
        <div className="me-10 pl-2 min-w-32 font-bold text-xl">
          <div onClick={()=>{toast("Redirecting To Home");router.push("/");}}>
              <Cover>
                <ColourfulText text="iSyllabi"/>
              </Cover>
              </div>
        </div>
        <div className="hidden sm:block me-36">
          <div
            className={`items-center justify-between ${
              open ? "" : "hidden"
            } w-full md:flex md:w-auto md:order-1" id="navbar-sticky`}
          >
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="shadow-2xl bg-blue-300">Courses</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    {courses.length > 0 ? (
                      <Accordion
                        type="single"
                        collapsible
                        className="justify-center content-center align-middle mx-auto my-auto w-full shadow-2xl"
                      >
                        {courses.map((course: any) =>
                          !course.it ? (
                            <AccordionItem
                              value={course._id}
                              className="shadow-md m-2 dark:shadow-black rounded-lg shadow-black"
                            >
                              <AccordionTrigger className="text-xl font-semibold justify-center flex items-center">
                                <Avatar className="mt-5 ml-2 mr-2">
                                  <AvatarImage src={course.img} alt="@shadcn" />
                                  <AvatarFallback>Logo</AvatarFallback>
                                </Avatar>
                                <span className="mt-4 text-pretty text-md font-light">
                                  {course.name}
                                </span>
                              </AccordionTrigger>
                              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                {course.subCourses.length > 0 ? (
                                  course.subCourses.map((subCourse: any) => (
                                    <AccordionContent
                                      key={subCourse._id}
                                      className="mt-1"
                                    >
                                       <div style={{minHeight: '109px !important'}} className="border-l border-r border-2 block overflow-hidden select-none space-y-1 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-gray-900 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground max-w-64">
                                        <div className="space-y-1 flex items-center content-center text-center">
                                          <Badge>Course:</Badge>
                                          <h4 className="text-md mb-2 font-medium ml-2 pb-2">
                                            {subCourse.name}
                                          </h4>
                                        </div>
                                        <Separator className="my-4" />
                                        <div className="flex h-10 items-center space-x-4 text-sm">
                                          <div className="flex mt-2">
                                            <span>
                                              <Badge>Price:</Badge>
                                            </span>{" "}
                                            &nbsp;
                                            {subCourse.price}
                                          </div>
                                          <Separator orientation="vertical" />
                                          <div className="flex mt-2">
                                            <Badge>
                                              <BookOpenIcon
                                                onClick={() => {
                                                  router.push(
                                                    `/courses/${subCourse._id}`
                                                  );
                                                  toast(
                                                    "Redirecting................"
                                                  );
                                                }}
                                              ></BookOpenIcon>
                                            </Badge>
                                          </div>
                                          <Separator orientation="vertical" />
                                          {subCourse.cer == true ? (
                                            <>
                                              <div className="flex mt-2">
                                                <Badge>
                                                  <GraduationCap></GraduationCap>
                                                </Badge>
                                              </div>
                                              <Separator orientation="vertical" />
                                            </>
                                          ) : (
                                            <></>
                                          )}
                                        </div>
                                      </div>
                                    </AccordionContent>
                                  ))
                                ) : (
                                  <></>
                                )}
                              </ul>
                            </AccordionItem>
                          ) : (
                            <></>
                          )
                        )}
                      </Accordion>
                    ) : (
                      <Alert className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        <Terminal className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]" />
                        <AlertTitle>Message</AlertTitle>
                        <AlertDescription>
                          Courses are in Loading State. Please Wait.
                        </AlertDescription>
                      </Alert>
                    )}
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-blue-300 shadow-2xl">
                    Competition Exam
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    {courses.length > 0 ? (
                      <Accordion
                        type="single"
                        collapsible
                        className="justify-center content-center align-middle mx-auto my-auto w-full shadow-2xl"
                      >
                        {courses.map((course: any) =>
                          course.it ? (
                            <AccordionItem
                              value={course._id}
                              className="shadow-md m-4 dark:shadow-black shadow-black rounded-lg"
                            >
                              <AccordionTrigger className="text-xl font-semibold flex justify-between">
                                <Avatar className="m-3">
                                  <AvatarImage src={course.img} alt="@shadcn" />
                                  <AvatarFallback>Logo</AvatarFallback>
                                </Avatar>
                                <span className="mt-4 text-pretty text-md font-light">
                                  {course.name}
                                </span>
                              </AccordionTrigger>
                              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                {course.subCourses.length > 0 ? (
                                  course.subCourses.map((subCourse: any) => (
                                    <AccordionContent
                                      key={subCourse._id}
                                      className="mt-1"
                                    >
                                      <div className="block select-none space-y-1 border-l border-r border-2 hover:bg-slate-200 dark:hover:bg-gray-900 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                        <div className="space-y-1 flex items-center content-center text-center">
                                          <Badge>Course:</Badge>
                                          <h4 className="text-md mb-2 font-medium ml-2 pb-2">
                                            {subCourse.name}
                                          </h4>
                                        </div>
                                        <Separator className="my-4" />
                                        <div className="flex h-10 items-center space-x-4 text-sm">
                                          <div className="flex mt-2">
                                            <span>
                                              <Badge>Price:</Badge>
                                            </span>{" "}
                                            &nbsp;
                                            {subCourse.price}
                                          </div>
                                          <Separator orientation="vertical" />
                                          <div className="flex mt-2">
                                            <Badge>
                                              <BookOpenIcon
                                                onClick={() => {
                                                  router.push(
                                                    `/courses/${subCourse._id}`
                                                  );
                                                  toast(
                                                    "Redirecting................"
                                                  );
                                                }}
                                              ></BookOpenIcon>
                                            </Badge>
                                          </div>
                                          <Separator orientation="vertical" />
                                          {subCourse.cer == true ? (
                                            <>
                                              <div className="flex mt-2">
                                                <Badge>
                                                  <GraduationCap></GraduationCap>
                                                </Badge>
                                              </div>
                                              <Separator orientation="vertical" />
                                            </>
                                          ) : (
                                            <></>
                                          )}
                                        </div>
                                      </div>
                                    </AccordionContent>
                                  ))
                                ) : (
                                  <></>
                                )}
                              </ul>
                            </AccordionItem>
                          ) : (
                            <></>
                          )
                        )}
                      </Accordion>
                    ) : (
                      <Alert className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        <Terminal className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]" />
                        <AlertTitle>Message</AlertTitle>
                        <AlertDescription>
                          Courses are in Loading State. Please Wait.
                        </AlertDescription>
                      </Alert>
                    )}
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
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
            <div className="sm:block hidden md:flex ml-3 me-3 space-x-3">
              <Button variant="outline" onClick={()=>{
                toast("Redirecting......");
                router.push('/dashboard');
              }}>
                <LayoutDashboard></LayoutDashboard>&nbsp;DashBoard
              </Button>
            </div>
          </>
        )}
        <div className="mr-4 hidden gap-2 md:flex"></div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="mr-8">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="flex flex-col items-center justify-start gap-16 min-h-full w-full p-2">
              <div className="min-h-28 min-w-28 flex border p-5 shadow-2xl rounded-lg bg-blue-300 text-white">
                <TextGenerateEffect words="iSyllabi provide internship & training program" className="text-white"/>
              </div>
            {user && (
              <div>
                <div className="mb-6">
                      <Button variant="outline" className="shadow-lg" onClick={()=>{
                        toast("Redirecting.....");
                        router.push('/dashboard')
                      }}><UserRound /> &nbsp;DashBoard</Button>
                </div>
              </div>
            )}
<Collapsible
  onClick={() => {
    setColl2(false);
    setColl3(false);
  }}
  open={coll}
  onOpenChange={setColl}
  className="w-full space-y-2 rounded-lg border"
>
  <div className="border p-1 flex items-center justify-between space-x-4 px-4 rounded-lg shadow-2xl">
    <h4 className="text-sm font-semibold">Courses</h4>
    <CollapsibleTrigger asChild>
      <Button variant={"ghost"} size={"sm"} className="w-9 p-0">
        <ChevronsUpDown className="h-4 w-4" />
        <span className="sr-only">Toggle</span>
      </Button>
    </CollapsibleTrigger>
  </div>
  <CollapsibleContent className="space-y-2">
    <div className="w-full overflow-x-auto">
      <div className="flex space-x-4 flex-nowrap p-2">
        {courses.length > 0 &&
          courses.map(
            (course: any) =>
              !course.it && (
                <Dialog key={course._id}>
                  <DialogTrigger asChild>
                    <div className="cursor-pointer w-80 flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                      <Avatar className="m-1">
                        <AvatarImage src={course.img} alt="@shadcn" />
                        <AvatarFallback>Logo</AvatarFallback>
                      </Avatar>
                      <h4 className="text-md font-medium mt-2">{course.name}</h4>
                    </div>
                  </DialogTrigger>
                  {/* Popup for SubCourses */}
                  <DialogContent className="max-w-3xl p-4">
                    <h3 className="text-lg font-semibold">{course.name} - SubCourses</h3>
                    <div className="w-full overflow-x-auto mt-4">
                      <div className="flex space-x-4 flex-nowrap p-2">
                        {course.subCourses.length > 0 &&
                          course.subCourses.map((subCourse: any) => (
                            <div
                              key={subCourse._id}
                              className="flex-shrink-0 w-64 bg-slate-200 select-none space-y-1 hover:bg-slate-300 dark:hover:bg-gray-900 dark:bg-slate-800 rounded-md p-2 transition-colors"
                            >
                              <div className="flex items-center">
                                <Badge>Course:</Badge>
                                <h4 className="text-md ml-2 font-medium">{subCourse.name}</h4>
                              </div>
                              <Separator className="my-2" />
                              <div className="flex items-center space-x-4 text-sm">
                                <div className="flex">
                                  <Badge>Price:</Badge>
                                  &nbsp;{subCourse.price}
                                </div>
                                <Separator orientation="vertical" />
                                <div className="flex">
                                  <Badge>
                                    <BookOpenIcon
                                      onClick={() => {
                                        router.push(`/courses/${subCourse._id}`);
                                        toast("Redirecting...");
                                      }}
                                    />
                                  </Badge>
                                </div>
                                {subCourse.cer && (
                                  <>
                                    <Separator orientation="vertical" />
                                    <div className="flex">
                                      <Badge>
                                        <GraduationCap />
                                      </Badge>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )
          )}
      </div>
    </div>
  </CollapsibleContent>
</Collapsible>

<Collapsible
  onClick={() => {
    setColl(false);
    setColl3(false);
  }}
  open={coll2}
  onOpenChange={setColl2}
  className="w-full space-y-2 rounded-lg border"
>
  <div className="border p-1 flex items-center justify-between space-x-4 px-4 rounded-lg shadow-2xl">
    <h4 className="text-sm font-semibold">Competition Exam</h4>
    <CollapsibleTrigger asChild>
      <Button variant={"ghost"} size={"sm"} className="w-9 p-0">
        <ChevronsUpDown className="h-4 w-4" />
        <span className="sr-only">Toggle</span>
      </Button>
    </CollapsibleTrigger>
  </div>
  <CollapsibleContent className="space-y-2">
    <div className="w-full overflow-x-auto">
      <div className="flex space-x-4 flex-nowrap p-2">
        {courses.length > 0 &&
          courses.map(
            (course: any) =>
              course.it && (
                <Dialog key={course._id}>
                  <DialogTrigger asChild>
                    <div className="cursor-pointer w-80 flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                      <Avatar className="m-1">
                        <AvatarImage src={course.img} alt="@shadcn" />
                        <AvatarFallback>Logo</AvatarFallback>
                      </Avatar>
                      <h4 className="text-md font-medium mt-2">{course.name}</h4>
                    </div>
                  </DialogTrigger>
                  {/* Popup for SubCourses */}
                  <DialogContent className="max-w-3xl p-4">
                    <h3 className="text-lg font-semibold">{course.name} - SubCourses</h3>
                    <div className="w-full overflow-x-auto mt-4">
                      <div className="flex space-x-4 flex-nowrap p-2">
                        {course.subCourses.length > 0 &&
                          course.subCourses.map((subCourse: any) => (
                            <div
                              key={subCourse._id}
                              className="flex-shrink-0 w-64 bg-slate-200 select-none space-y-1 hover:bg-slate-300 dark:hover:bg-gray-900 dark:bg-slate-800 rounded-md p-2 transition-colors"
                            >
                              <div className="flex items-center">
                                <Badge>Course:</Badge>
                                <h4 className="text-md ml-2 font-medium">{subCourse.name}</h4>
                              </div>
                              <Separator className="my-2" />
                              <div className="flex items-center space-x-4 text-sm">
                                <div className="flex">
                                  <Badge>Price:</Badge>
                                  &nbsp;{subCourse.price}
                                </div>
                                <Separator orientation="vertical" />
                                <div className="flex">
                                  <Badge>
                                    <BookOpenIcon
                                      onClick={() => {
                                        router.push(`/courses/${subCourse._id}`);
                                        toast("Redirecting...");
                                      }}
                                    />
                                  </Badge>
                                </div>
                                {subCourse.cer && (
                                  <>
                                    <Separator orientation="vertical" />
                                    <div className="flex">
                                      <Badge>
                                        <GraduationCap />
                                      </Badge>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )
          )}
      </div>
    </div>
  </CollapsibleContent>
</Collapsible>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
