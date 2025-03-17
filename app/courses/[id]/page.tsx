"use client";
import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import NavBar from "@/app/_components/NavBar";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { LockIcon, ShoppingCartIcon} from "lucide-react";
import { useTheme } from "next-themes";
import McqView from "@/app/_components/McqView";
export default function Home({ params }: { params: { id: String } }) {
  const cId = params.id;
  const [titles, setTitles] = React.useState([]);
  const router = useRouter();
  const [cer, setCer] = React.useState(false);
  const [cs, setCs] = React.useState(false);
  const [mcq, setMcq] = React.useState([]);
  const [exp, setExp] = React.useState(false);
  const [topic, setTopic] = React.useState("");
  const [prof, setProf]: any = React.useState(null);
  const { user } = useUser();
  const {theme} = useTheme();
  const [con, setCont] = React.useState("Loading");
  const [uTheme, setUTheme] = React.useState(`${theme}`);
  const loadCon = async () => {
    setCont("Loading");
    const getCouser = await fetch("/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: cId }),
    });
    const dataTem = await getCouser.json();
    console.log(dataTem)
    if (dataTem.course) {
      setExp(dataTem.exp);
      if (dataTem.course.cer == true) {
        setCer(true);
      }
      setProf(dataTem.profile);
      console.log(dataTem);
    } else {
      toast("In-Valid Course ID");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
    const res = await fetch("/api/content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tId: topic }),
    });
    const data = await res.json();
    setCont(
      `<style>body, * {background-color: ${uTheme === "dark" ? "#000000" : "#FFFFFF"} !important; background: ${uTheme === "dark" ? "#000000" : "#FFFFFF"} !important; ::-webkit-scrollbar {width: 0;}</style>${data.content[0]?.con.replace(/<p[^>]*>\s*Powered by\s*<a[^>]*Froala Editor[^>]*>.*?<\/a>\s*<\/p>/g, '')} <script>document.addEventListener('selectstart', (e) => e.preventDefault());document.addEventListener('mousedown', (e) => e.preventDefault()); document.body.style.backgroundColor = ${uTheme === "dark" ? "#000000" : "#FFFFFF"};</script>`
    );
  };
  React.useEffect(() => {
    (async () => {
      const res = await fetch("/api/topics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cId }),
      });
      const data = await res.json();
      if (data.result[0]) {
        if (exp) {
          let unpaidTopic = null;
          for (let i = 0; i < data.result.length; i++) {
            if (!data.result[i].paid) {
              unpaidTopic = data.result[i]._id;
              break;
            }
          }
          if (unpaidTopic) {
            setTopic(unpaidTopic); 
          } else {
            console.error("No unpaid topics found");
          }
        } else {
          setTopic(data.result[0]._id);
        }
      }
      setTitles(data.result); 
    })();
  }, [exp]); 
  React.useEffect(() => {
    loadCon();
  }, [topic]);
  React.useEffect(()=>{
    setUTheme(`${theme}`);
    console.log(uTheme);
  },[theme])
  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="max-md:hidden flex flex-grow scrollbar-hide w-screen overflow-hidden outline-none border-none">
        <div className="w-1/5 h-full scrollbar-hide border-none ml-3 overflow-hidden">
          <ScrollArea className="h-full max-w-xs rounded-md border-none overflow-y-hidden">
            <div className="max-w-xs flex flex-col scrollbar-hide shadow-lg">
              <Button className="-ml-4 bg-blue-300 text-black dark:text-white dark:bg-black dark:hover:bg-black hover:bg-gray-200 shadow-lg" variant={"default"}>
                &nbsp;Explore Courses{exp && (<span className="shadow-black shadow-lg rounded-xl ml-1.5 flex p-1" onClick={()=>{router.push(`/buycourse/${cId}`); toast("Redirecting")}}><ShoppingCartIcon size={"20"}/></span>)} 
                {cer ? (
                  <>
                    <Badge
                      variant={"destructive"}
                      className="ml-3 shadow-black shadow-lg"
                      onClick={() => {
                        if (exp == false) {
                          if(user && prof == true){
                            toast("Redirecting.....");
                            alert("To get certificate, you need to attempt & qualify the following exam. Do you want to proceed ?")
                            router.push(`/exams/${cId}`);
                          }else if(user && prof == false){
                            alert("Completing your profile is required before applying for the certificate. Redirecting to Dashboard for Profile Compilation");
                            router.push("/dashboard");
                          }
                        } else {
                          toast("Buy or Log-IN to Get Certificate");
                          router.push(`/buycourse/${cId}`);
                        }
                      }}
                    >
                      Certificate
                    </Badge>
                  </>
                ) : (
                  <></>
                )}
                {/* <Badge
                  className="ml-1"
                  onClick={async() => {
                    try{
                      await navigator.clipboard.writeText(window.location.href);
                      toast("URL Coppied");
                    }catch(e){
                      console.log(e);
                    }
                  }}
                >
                  <LucideShare2></LucideShare2>
                </Badge> */}
              </Button>
            </div>
            <div className="mt-4 max-w-xs border-none scrollbar-hide">
  {titles.length > 0 &&
    titles.map((title: any, index: number) => (
      <div key={title._id} className="flex flex-col scrollbar-hide">
        {exp == true && title.paid == true ? (
          <>
            <div
              onClick={() => {
                toast(
                  "You need to Buy to view this content or Log-IN to your Account"
                );
                router.push(`/buycourse/${cId}`);
              }}
              className="max-w-xs flex border-double border-e-2 border-l-2"
            >
              {title.mcq.length > 0 ? (
                <div className="flex w-full justify-between text-sm">
                  <div className="w-9/10">
                    {title.name}
                  </div>
                  <div className="w-1/10 flex justify-center">
                    &nbsp;&nbsp;
                    <span className="shadow-lg rounded-lg dark:shadow-white">
                      MCQ
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full text-sm">
                  {title.name}
                </div>
              )}
              &nbsp;<LockIcon className="h-4 w-4"></LockIcon>
            </div>
          </>
        ) : (
          <>
            <div
              onClick={() => {
                setCs(false);
                setTopic(title._id);
              }}
              className="max-w-xs flex border-double border-e-2 border-l-2"
            >
              {title.mcq.length > 0 ? (
                <div className="flex w-full justify-between text-sm">
                  <div className="w-9/10">
                    {title.name}
                  </div>
                  <div className="w-1/10 flex justify-center">
                    &nbsp;&nbsp;
                    <span className="mx-auto text-sm p-1 shadow-lg rounded-lg dark:shadow-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCs(true);
                          setMcq(title.mcq[0].questions);
                        }}>MCQ
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full text-sm">
                  {title.name}
                </div>
              )}
            </div>
          </>
        )}
        <Separator className="my-2 min-w-full border-teal-50 dark:border-teal-900" />
      </div>
    ))}
  {titles.length <= 0 && (
    <div className="grid place-items-center mx-auto mt-10">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px] bg-gray-400" />
          <Skeleton className="h-4 w-[200px] bg-gray-300" />
        </div>
      </div>
      <div className="flex items-center space-x-4 m-5">
        <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px] bg-gray-400" />
          <Skeleton className="h-4 w-[200px] bg-gray-300" />
        </div>
      </div>
      <div className="flex items-center space-x-4 m-5">
        <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px] bg-gray-400" />
          <Skeleton className="h-4 w-[200px] bg-gray-300" />
        </div>
      </div>
      <div className="flex items-center space-x-4 m-5">
        <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px] bg-gray-400" />
          <Skeleton className="h-4 w-[200px] bg-gray-300" />
        </div>
      </div>
      <div className="flex items-center space-x-4 m-5">
        <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px] bg-gray-400" />
          <Skeleton className="h-4 w-[200px] bg-gray-300" />
        </div>
      </div>
      <div className="flex items-center space-x-4 m-5">
        <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px] bg-gray-400" />
          <Skeleton className="h-4 w-[200px] bg-gray-300" />
        </div>
      </div>
    </div>
  )}
</div>
          </ScrollArea>
        </div>
        <div className="w-4/5 m-2 h-full scrollbar-hide outline-none border-none overflow-hidden flex justify-center items-center content-center mx-auto">
          {con == "Loading" ? (
            <>
              <div className="grid place-items-center mx-auto mt-10">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px] bg-gray-400" />
                    <Skeleton className="h-4 w-[200px] bg-gray-300" />
                  </div>
                </div>
                <div className="flex items-center space-x-4 m-5">
                  <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px] bg-gray-400" />
                    <Skeleton className="h-4 w-[200px] bg-gray-300" />
                  </div>
                </div>
                <div className="flex items-center space-x-4 m-5">
                  <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px] bg-gray-400" />
                    <Skeleton className="h-4 w-[200px] bg-gray-300" />
                  </div>
                </div>
                <div className="flex items-center space-x-4 m-5">
                  <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px] bg-gray-400" />
                    <Skeleton className="h-4 w-[200px] bg-gray-300" />
                  </div>
                </div>
                <div className="flex items-center space-x-4 m-5">
                  <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px] bg-gray-400" />
                    <Skeleton className="h-4 w-[200px] bg-gray-300" />
                  </div>
                </div>
                <div className="flex items-center space-x-4 m-5">
                  <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px] bg-gray-400" />
                    <Skeleton className="h-4 w-[200px] bg-gray-300" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="ml-2 mt-8 overflow-hidden overflow-y-auto scrollbar-hide w-full bg-white dark:bg-black">
              {cs == false ? (
                <iframe
                style={{
                  width: "100vh",
                  height: "100vh",
                  margin: 0,
                  padding: 0,
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  backgroundColor: `${uTheme == "dark" ? "#000000" : "#FFFFFF"}`,
                  background: `${uTheme == "dark" ? "#000000" : "#FFFFFF"}`,
                  color: `${uTheme == "dark" ? "#FFFFFF" : "#000000"}`,
                }}
                className={`m-0 p-0 min-h-screen min-w-full mt-3 overflow-hidden overflow-y-hidden ${uTheme === "dark" ? "text-white bg-black" : "text-black"}`}
                srcDoc={con}
              />
              ): (<>
              <McqView mcq={mcq}/>
              </>)}
            </div>
          )}
        </div>
        {/* <div className="w-1/5 m-2 h-full scrollbar-hide outline-none border-none overflow-hidden flex justify-center items-center content-center mx-auto">
        <ScrollArea className="w-full h-screen p-6">
        <div id="pc-ad">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga illo ut voluptatem reiciendis amet iste deserunt unde aut alias exercitationem, rem obcaecati eligendi nemo error sint consequatur voluptatibus est provident suscipit voluptates expedita? Cumque, dolorum fugit delectus error nam quam. Doloremque aut non assumenda voluptatibus, iure sapiente, aliquam praesentium ut ab accusamus repellat consequatur asperiores nesciunt, atque rem delectus vero ducimus tempora quod sequi veniam architecto eum in accusantium. Modi minima, fugit vero sint natus magni blanditiis cupiditate optio doloremque eum quis enim. Excepturi tempora eligendi nesciunt quos nostrum fugiat recusandae corporis repudiandae asperiores exercitationem earum quam eaque tenetur quae, laborum distinctio. Repellat est non consectetur fugiat tenetur, quibusdam libero distinctio enim voluptates reprehenderit et quam? Quidem delectus consequatur non dolor sapiente odit fuga tempora quas unde nobis. Ducimus libero quam minus at enim nesciunt eveniet, velit aperiam aliquam commodi eaque. Aspernatur sapiente animi quo sit optio eos ex! Veniam ipsam ut vel sapiente omnis esse, accusantium, mollitia distinctio praesentium veritatis ea iste incidunt recusandae aperiam possimus culpa enim repudiandae optio, error eaque consequuntur est voluptatem ratione illo! Non deserunt suscipit quidem explicabo? Corporis qui, blanditiis similique vel, sint dicta ratione soluta nemo minus porro eum! Eveniet illum voluptatum officia? Fuga suscipit culpa quisquam animi. Atque eaque consectetur delectus minus aliquam et eos inventore numquam exercitationem deserunt a, fuga adipisci doloribus sapiente libero distinctio cum labore magni doloremque rerum sed nisi modi cupiditate sit! Amet sapiente itaque rerum in voluptas sint omnis quae eos qui ab blanditiis officiis voluptatum officia, mollitia quidem quaerat, numquam optio consequatur provident recusandae repellat quas corrupti? Expedita, autem maiores veniam quae fuga aspernatur, sint voluptates nihil, deleniti totam assumenda dolore suscipit ut temporibus nesciunt voluptas recusandae voluptatem accusantium optio perferendis sunt explicabo ipsum! Tenetur hic commodi, qui eos nesciunt ipsam minus ut ea necessitatibus aliquid, harum voluptatum dolores. Aliquam ipsum sed inventore molestiae saepe, minus neque iste at. Suscipit culpa blanditiis eum. Eaque qui labore illum dolorem autem, fugiat expedita neque repellat quisquam adipisci. A qui aliquid recusandae fugiat consectetur natus velit voluptatum. Quis tenetur molestiae harum dignissimos architecto autem aperiam incidunt, ad, provident aspernatur illum? Ipsum dignissimos accusantium odit aperiam enim explicabo perferendis. Unde similique nulla et tempore. Id, eveniet ab! Veritatis ipsam rem eveniet quibusdam repellendus. Provident iste culpa autem aliquid obcaecati facere aliquam doloribus iusto quos maxime. Adipisci dolorem enim odit corrupti quidem maxime officiis qui, voluptate voluptatum nesciunt! Nihil placeat ab obcaecati tempore aliquam voluptate ex, sunt dolor quos asperiores provident velit. Optio eveniet molestiae labore, est quae repellat dolore obcaecati id ratione assumenda facilis repellendus sunt sed alias, cum beatae dolorum eaque dolorem minus natus! Iure fuga quaerat eaque labore unde mollitia earum porro. Natus, deserunt temporibus, perferendis maxime ipsa facilis corporis doloribus perspiciatis eius nesciunt saepe ipsam? Vel et earum asperiores, alias non voluptatibus facilis voluptatem commodi atque ipsam, cumque, iste officia. Commodi debitis deserunt earum reiciendis id a ea optio libero accusantium quisquam, assumenda quo voluptatum? Vitae numquam distinctio tempore nam assumenda sit nisi! Ad tenetur sint consequatur vel maiores est inventore harum ipsa et, eveniet enim distinctio illum veniam modi cum officiis perferendis, temporibus quaerat! Itaque odio dolores obcaecati voluptatum! Optio reprehenderit, ad veniam sapiente neque, velit voluptatibus, impedit ducimus libero quas omnis. Fuga tenetur provident impedit. Ab ut iure optio quidem quibusdam illo totam magnam, rem, nam illum libero aperiam error. Aspernatur, quisquam eius pariatur perferendis necessitatibus iusto consequatur nisi, distinctio aut id suscipit sed reiciendis soluta dicta amet voluptas laborum, quasi optio aliquid veritatis alias iste? Amet cupiditate est qui ducimus quaerat. Cumque possimus saepe, officiis at excepturi dolore repudiandae laudantium rem ipsa, non omnis!
        </div>
        </ScrollArea>
        </div> */}
      </div>
      <div className="hidden max-md:flex w-screen mt-2 mb-2 overflow-hidden scrollbar-hide dark:bg-transparent">
        <div className="grid grid-flow-col border dark:border-transparent pb-3 shadow-lg auto-cols-max gap-4 items-center overflow-x-auto scrollbar-hide">
          <p className="ml-2 shadow-lg bg-blue-300 rounded-lg p-1">Explore Course</p>
          {exp && (<span className="shadow-black shadow-lg rounded-xl ml-1 flex p-1" onClick={()=>{router.push(`/buycourse/${cId}`); toast("Redirecting")}}><ShoppingCartIcon size={"20"}/></span>)} 
          {cer && (
            <Badge
              variant={"destructive"}
              className="ml-3"
              onClick={() => {
                if (exp == false) {
                  if(user && prof == true){
                    toast("Redirecting.....");
                    alert("To get certificate, you need to attempt & qualify the follwing exam. Do you want to proceed ?")
                    router.push(`/exams/${cId}`);
                  }else if(user && prof == false){
                    alert("Completing your profile is required before applying for the certificate. Redirecting to Dashboard for Profile Compilation");
                    router.push("/dashboard");
                  }
                } else {
                  toast("Buy or Log-IN to Get Certificate");
                  router.push(`/buycourse/${cId}`);
                }
              }}
            >
              Certificate
            </Badge>
          )}
          {titles.length > 0 ? (
            titles.map((title: any) => (
              <div key={title.id} className="flex flex-col dark:bg-black">
                {exp == true && title.paid == true ? (
                  <>
                          <Button
                          onClick={() => {
                            toast(
                              "You need to Buy to view this content or Log-IN to your Account"
                            );
                            router.push(`/buycourse/${cId}`);
                          }}
                          variant={"outline"}
                          className="w-full bg-blue-300"
                        >
                          {title.name} {title.mcq.length > 0 ? (
                            <>
                            &nbsp;&nbsp;<span className="m-1 p-1 shadow-black shadow-lg rounded-lg dark:shadow-white" onClick={()=>{toast("You need to Buy to view this content or Log-IN to your Account");router.push(`/buycourse/${cId}`);}}>MCQ</span>
                            </>
                          ): ( <></>)}
                           &nbsp;<LockIcon className="h-4 w-4"></LockIcon>
                        </Button>
                  </>
                ) : (
                  <>
                    <Button
                          onClick={() => {
                            setCs(false);
                            setTopic(title._id);
                          }}
                          variant={"outline"}
                          className="w-full bg-blue-300"
                        >
                          {title.name}
                          {title.mcq.length > 0 ? (
                            <>
                            &nbsp;&nbsp;<span className="m-1 shadow-lg rounded-lg dark:shadow-white p-1 shadow-black" onClick={(e)=>{e.stopPropagation(); setCs(true); setMcq(title.mcq[0].questions);}}>MCQ</span>
                            </>
                          ): ( <></>)}
                        </Button>
                  </>
                )}
              </div>
            ))
          ) : (
            <>
              <div className="flex flex-col dark:bg-transparent">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px] bg-gray-400" />
                  <Skeleton className="h-4 w-[100px] bg-gray-300" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {/* <div className="hidden max-md:flex w-screen h-32 overflow-hidden scrollbar-hide bg-transparent mt-1 mb-1 border-t border-b border-2">
        <ScrollArea className="w-full h-full">
          <div id="mobile-ad">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit sapiente repudiandae inventore consequatur mollitia praesentium pariatur perspiciatis at accusantium dolorum harum aut voluptatem natus eaque, facere adipisci aperiam ut minus. Itaque nam molestias reprehenderit! Quae aspernatur sint voluptatum minima neque. Facere eligendi odit illum incidunt quia, animi adipisci magnam blanditiis deleniti eius accusamus laborum ea temporibus veritatis, ut modi voluptatibus nisi hic exercitationem sed sit quaerat! Neque doloremque porro facilis quaerat consequatur distinctio fuga quis minus sit minima voluptas dolorem aliquid suscipit, totam, quibusdam, ducimus iure. Itaque maxime et repudiandae laboriosam temporibus ad minus commodi aperiam nemo? Maxime explicabo eligendi debitis assumenda veniam tempore a reiciendis officia unde ipsa. Minima autem ea quae explicabo, aliquid adipisci voluptatem ut eligendi porro voluptatum sunt deleniti ipsam eos maxime corrupti fugiat provident, magnam tempora consequatur beatae. Nobis esse hic voluptatem possimus rerum repellat, consequuntur sunt aspernatur est, in eaque laborum architecto. Dolores nulla vitae perspiciatis suscipit nesciunt minus commodi illo voluptatibus magnam recusandae ipsam sit eos quasi aspernatur unde facere natus quis pariatur hic eum exercitationem libero, rem doloribus! Minima voluptas porro ducimus, dolor iure soluta et molestiae cum, eaque corrupti quaerat explicabo reiciendis eligendi alias illo dolores recusandae ad suscipit temporibus maxime illum. Inventore, deleniti, eaque corporis vero reprehenderit ipsam, error praesentium magnam facere cupiditate tenetur soluta. Doloribus sapiente quis consequuntur maiores sunt, esse officiis nulla cumque quae earum quo alias neque distinctio a adipisci id? Ipsum soluta laborum modi, necessitatibus ullam minus laudantium quibusdam facilis omnis error. Odio expedita eos earum provident perferendis nobis asperiores aliquam inventore enim ea quam sapiente aut ad, voluptatem cum sint suscipit harum debitis aspernatur quia? Nisi natus, obcaecati suscipit illum minus perferendis voluptate dignissimos expedita soluta facere earum, veritatis, nemo magnam atque impedit quo voluptas assumenda? Vitae expedita, non unde quasi facilis necessitatibus. Veniam quos repellat optio possimus adipisci dolore odio provident aut cupiditate itaque ipsam totam ab dicta accusantium ut, molestias ratione obcaecati ducimus architecto eveniet illum minus eaque tenetur? Cum error dolore facilis, voluptates repellat exercitationem consequuntur delectus maxime velit esse atque repellendus aut et non. Nostrum neque qui labore consectetur modi et minus accusamus enim, doloremque, quisquam fugiat, at aperiam soluta sapiente. Qui a animi quidem at illo cum obcaecati, et nam labore provident praesentium harum! Exercitationem nesciunt inventore voluptatem, quod molestias placeat temporibus vitae qui dolor magnam iste laudantium reiciendis modi nihil eligendi velit maiores hic facere ipsa, adipisci repudiandae. Fugit hic, earum, doloremque ex consequuntur provident praesentium possimus voluptatem pariatur dolorem, aspernatur architecto. Dolor ipsa porro, nemo dolorum dicta quod soluta magni similique molestiae maiores perspiciatis praesentium facere repellendus cumque aliquid illo consequuntur at assumenda! Sequi veritatis, sit et nemo nihil minus placeat repellendus laudantium saepe? Architecto hic nostrum atque dolor ut, sed quod impedit dolores consequatur esse! Quia quos, delectus deserunt vel voluptatibus itaque eaque reprehenderit aspernatur assumenda doloribus excepturi? Neque odit voluptatum qui sapiente cumque beatae saepe necessitatibus eum, corporis tempora rem? Expedita soluta error vitae velit voluptate vel! Doloribus optio ipsa dolore sunt. Architecto et qui velit voluptatum minus quo illo alias fugiat voluptatem nulla, obcaecati cupiditate? Cum dolore corporis assumenda debitis perferendis? Voluptas dolorum eos iste illum quas error assumenda, labore commodi recusandae sed quae mollitia voluptatibus veniam, explicabo natus nesciunt adipisci, neque iusto ducimus accusantium non iure reiciendis. Nobis sapiente quibusdam eaque minima facere itaque, nulla quasi similique praesentium fugiat, sequi laborum maxime porro voluptas officiis id, ipsum magnam aperiam vel sunt doloribus autem beatae necessitatibus non. Unde, dolorem nesciunt, deserunt quisquam suscipit pariatur quaerat quia ducimus, dignissimos dicta illum labore perferendis sequi consequatur natus nostrum cum quasi aperiam eius repellendus veritatis. Quam, animi hic.
          </div>
        </ScrollArea>
      </div> */}
      <div className="hidden max-md:flex w-screen h-screen overflow-hidden scrollbar-hide bg-transparent">
        {con == "Loading" ? (
          <>
            <div className="grid place-items-center mx-auto mt-10">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px] bg-gray-400" />
                  <Skeleton className="h-4 w-[200px] bg-gray-300" />
                </div>
              </div>
              <div className="flex items-center space-x-4 m-5">
                <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px] bg-gray-400" />
                  <Skeleton className="h-4 w-[200px] bg-gray-300" />
                </div>
              </div>
              <div className="flex items-center space-x-4 m-5">
                <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px] bg-gray-400" />
                  <Skeleton className="h-4 w-[200px] bg-gray-300" />
                </div>
              </div>
              <div className="flex items-center space-x-4 m-5">
                <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px] bg-gray-400" />
                  <Skeleton className="h-4 w-[200px] bg-gray-300" />
                </div>
              </div>
              <div className="flex items-center space-x-4 m-5">
                <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px] bg-gray-400" />
                  <Skeleton className="h-4 w-[200px] bg-gray-300" />
                </div>
              </div>
              <div className="flex items-center space-x-4 m-5">
                <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px] bg-gray-400" />
                  <Skeleton className="h-4 w-[200px] bg-gray-300" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {cs == false ? (
                <iframe
                style={{
                  width: "100vh",
                  height: "100vh",
                  margin: 0,
                  padding: 0,
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  backgroundColor: `${uTheme == "dark" ? "#000000" : "#FFFFFF"}`,
                  background: `${uTheme == "dark" ? "#000000" : "#FFFFFF"}`,
                  color: `${uTheme == "dark" ? "#FFFFFF" : "#000000"}`,
                }}
                className={`m-0 p-0 min-h-screen min-w-full mt-3 overflow-hidden overflow-y-hidden ${uTheme === "dark" ? "text-white bg-black" : "text-black"}`}
                srcDoc={con}
              />
              ): (<div className="min-w-full">
              <McqView mcq={mcq}/>
              </div>)}
          </>
        )}
      </div>
    </div>
  );
}
