"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { toast } from "sonner";

const page = () => {
  const prompt = "write quote of the day";
  const [output, setOutput] = useState(" this is next js project ");

  const generateText = async () => {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ body: prompt }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setOutput(data.output);
      } else {
        setOutput(data.error);
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <div>
      <div>
        <Button onClick={generateText}>Click to view quote of day.</Button>
      </div>

      {output}
    </div>
  );
};

export default page;
