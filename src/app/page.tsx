import Image from "next/image";
import Map from "@/Components/Map";
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
   <Map/>
    </div>
  );
}
