"use client";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import messages from "@/messages.json";
import { FlipWords } from "@/components/ui/flip-words";
import Link from "next/link";

export default function Home() {
  const words = ["anonymous", "honest", "hidden", "candid"];

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-16 min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500/30">
      
      {/* Hero Section */}
      <section className="text-center mb-10 md:mb-14 max-w-2xl">
        {/* Eyebrow badge matching your active state pill theme */}
        <span className="inline-block mb-5 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
          True Feedback ✦
        </span>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-950 leading-tight mb-4">
          Get{" "}
          <span className="text-indigo-600 font-black">
            <FlipWords words={words} />
          </span>{" "}
          <br />
          feedback
        </h1>

        <p className="text-base md:text-lg text-slate-600 max-w-lg mx-auto leading-relaxed">
          Where your identity remains a secret — fostering honest and open
          communication between people.
        </p>

        {/* CTA buttons matching dashboard purple actions */}
        <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
          <Link
            href="/sign-up"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            Get started
          </Link>
          <Link
            href="/sign-in"
            className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-sm border border-slate-200 transition-all shadow-sm hover:-translate-y-0.5"
          >
            Sign in
          </Link>
        </div>

        {/* Feature pills matching the green accent theme */}
        <div className="flex items-center justify-center gap-5 mt-8 flex-wrap">
          {["100% anonymous", "No sign-up required to message", "Delete anytime"].map((f) => (
            <span key={f} className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {f}
            </span>
          ))}
        </div>
      </section>

      {/* Carousel Section matching Dashboard Card aesthetics */}
      <div className="w-full max-w-lg">
        <p className="text-center text-xs font-bold tracking-widest uppercase text-indigo-600/80 mb-5">
          What people are saying
        </p>
        <Carousel
          opts={{ align: "start" }}
          orientation="vertical"
          className="w-full"
          plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
        >
          <CarouselContent className="h-[340px]">
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-2">
                <div className="h-full">
                  {/* Cards mimic the exact yellow highlighted cards seen in the screenshot */}
                  <Card className="h-full flex flex-col rounded-xl border border-amber-200 shadow-sm bg-white hover:shadow-md transition-all duration-300 overflow-hidden relative">
                    {/* Top Accent Highlight */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400" />
                    
                    <CardHeader className="px-5 pt-5 pb-1">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold text-slate-800 line-clamp-1">
                          {message.title}
                        </h3>
                        <span className="text-xs text-amber-500">★</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 flex flex-col justify-between px-5 pb-5">
                      <p className="text-sm font-medium leading-relaxed text-slate-600 break-words">
                        "{message.content}"
                      </p>
                      
                      {/* Metadata bottom row to sync visual continuity with the app preview */}
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                        <span>Recent</span>
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          ● 100% Genuine
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="flex justify-center items-center gap-4 mt-6">
            <CarouselPrevious className="static translate-y-0 bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-xl h-9 w-9 shadow-sm transition-all" />
            <CarouselNext className="static translate-y-0 bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-xl h-9 w-9 shadow-sm transition-all" />
          </div>
        </Carousel>
      </div>
    </main>
  );
}