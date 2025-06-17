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

export default function Home() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 text-gray-900 min-h-screen bg-white">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold text-black leading-tight">
          Get started with{" "}
          <span className="text-black underline">anonymous feedback</span>
        </h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
          True Feedback – Where your identity remains a secret, fostering honest
          and open communication.
        </p>
      </section>

      {/* Carousel Section */}
      <Carousel
        opts={{ align: "start" }}
        orientation="vertical"
        className="w-full max-w-lg mx-auto"
        plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
      >
        <CarouselContent className="h-[400px]">
          {messages.map((message, index) => (
            <CarouselItem key={index} className="p-1">
              <div className="h-full">
                <Card className="h-full shadow-lg transition-transform duration-300 hover:scale-[1.01] flex flex-col">
                  <CardHeader className="bg-yellow-200 p-4 text-center rounded-t-md">
                    <h3 className="text-xl font-bold text-gray-800">
                      {message.title}
                    </h3>
                  </CardHeader>
                  <CardContent className="flex-1 flex items-center justify-center bg-white text-gray-800 px-6 py-8 rounded-b-md">
                    <p className="text-base font-medium leading-relaxed text-center break-words">
                      {message.content}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center items-center gap-4 mt-4">
          <CarouselPrevious className="bg-black text-white rounded-full p-2 shadow hover:bg-gray-700 transition" />
          <CarouselNext className="bg-black text-white rounded-full p-2 shadow hover:bg-gray-700 transition" />
        </div>
      </Carousel>
    </main>
  );
}
