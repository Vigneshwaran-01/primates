"use client";
import { cn } from "@/lib/utils";

export default function CardRow() {
  return (
    <div className="bg-black p-8  flex gap-6 justify-center items-start flex-wrap">
      {/* Card 1 */}
      <div className="max-w-xs w-full group/card">
        <div
          className={cn(
            "cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl max-w-sm mx-auto backgroundImage flex flex-col justify-between p-4",
            "bg-[url(https://res.cloudinary.com/dabyqx1mz/image/upload/v1751647225/download_5_gxokts.jpg)] bg-cover"
          )}
        >
          <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
          <div className="flex flex-row items-center space-x-4 z-10">
           
          </div>
          <div className="text content">
            <h1 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10">
              Author Card
            </h1>
            <p className="font-normal text-sm text-gray-50 relative z-10 my-4">
              Card with Author avatar, complete name and time to read - most
              suitable for blogs.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-xs w-full">
        <div
          className={cn(
            "group w-full cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl mx-auto flex flex-col justify-end p-4 border border-transparent dark:border-neutral-800",
            "bg-[url(https://res.cloudinary.com/dabyqx1mz/image/upload/v1751648343/Unlocking_Massive_Thigh_Gains__Your_Ultimate_Leg_Day_Blueprint_ldagft.jpg)] bg-cover",
            "before:bg-[url()] before:fixed before:inset-0 before:opacity-0 before:z-[-1]",
            "hover:bg-[url(https://res.cloudinary.com/dabyqx1mz/image/upload/v1751648343/Unlocking_Massive_Thigh_Gains__Your_Ultimate_Leg_Day_Blueprint_ldagft.jpg)]",
            "hover:after:content-[''] hover:after:absolute hover:after:inset-0 hover:after:bg-black hover:after:opacity-50",
            "transition-all duration-500"
          )}
        >
          <div className="text relative z-50">
            <h1 className="font-bold text-xl md:text-3xl text-gray-50 relative">
              Background Overlays
            </h1>
            <p className="font-normal text-base text-gray-50 relative my-4">
              This card is for some special elements, like displaying background
              gifs on hover only.
            </p>
          </div>
        </div>
      </div>

      {/* Card 1 */}
      <div className="max-w-xs w-full group/card">
        <div
          className={cn(
            "cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl max-w-sm mx-auto backgroundImage flex flex-col justify-between p-4",
            "bg-[url(https://res.cloudinary.com/dabyqx1mz/image/upload/v1751646943/Iron_Beauty__Strength_with_Style_qjeqhc.jpg)] bg-cover"
          )}
        >
          <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
          <div className="flex flex-row items-center space-x-4 z-10">
           
          </div>
          <div className="text content">
            <h1 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10">
              Author Card
            </h1>
            <p className="font-normal text-sm text-gray-50 relative z-10 my-4">
              Card with Author avatar, complete name and time to read - most
              suitable for blogs.
            </p>
          </div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="max-w-xs w-full">
        <div
          className={cn(
            "group w-full cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl mx-auto flex flex-col justify-end p-4 border border-transparent dark:border-neutral-800",
            "bg-[url(https://res.cloudinary.com/dabyqx1mz/image/upload/v1751648342/Can_You_Get_Bigger_Without_Lifting_Heavier__itml2w.jpg)] bg-cover",
            "before:bg-[url()] before:fixed before:inset-0 before:opacity-0 before:z-[-1]",
            "hover:bg-[url(https://res.cloudinary.com/dabyqx1mz/image/upload/v1751648342/Can_You_Get_Bigger_Without_Lifting_Heavier__itml2w.jpg)]",
            "hover:after:content-[''] hover:after:absolute hover:after:inset-0 hover:after:bg-black hover:after:opacity-50",
            "transition-all duration-500"
          )}
        >
          <div className="text relative z-50">
            <h1 className="font-bold text-xl md:text-3xl text-gray-50 relative">
              Background Overlays
            </h1>
            <p className="font-normal text-base text-gray-50 relative my-4">
              This card is for some special elements, like displaying background
              gifs on hover only.
            </p>
          </div>
        </div>
      </div>

      
    </div>
  );
}
