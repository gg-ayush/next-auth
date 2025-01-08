"use client";

import BentoGridDemo from "@/src/components/comp/AceternityUI/bento-grid/bento-grid-demo";
import BentoGridSecondDemo from "@/src/components/comp/AceternityUI/bento-grid/bento-grid-demo-2";
import BentoGridThirdDemo from "@/src/components/comp/AceternityUI/bento-grid/bento-grid-demo-3";
import { Button } from "@/src/ui/button/button";
import { useState } from "react";

export default function BentoGrid() {
  const [selected, setSelected] = useState("BentoGridDemo");

  const handleSelect = (selectedDemo: string) => {
    setSelected(selectedDemo);
  };

  return (
    <div className="relative flex justify-end mb-4 gap-x-2">
      <Button
        variant="black"
        className={`${selected === "BentoGridDemo" && "bg-white text-black"}`}
        onClick={() => handleSelect("BentoGridDemo")}
      >
        Demo 1
      </Button>
      <Button
        variant="black"
        className={`${
          selected === "BentoGridSecondDemo" && "bg-white text-black"
        }`}
        onClick={() => handleSelect("BentoGridSecondDemo")}
      >
        Demo 2
      </Button>
      <Button
        variant="black"
        className={`${
          selected === "BentoGridThirdDemo" && "bg-white text-black"
        }`}
        onClick={() => handleSelect("BentoGridThirdDemo")}
      >
        Demo 2
      </Button>

      {/* Render the selected demo */}
      {selected === "BentoGridDemo" && <BentoGridDemo />}
      {selected === "BentoGridSecondDemo" && <BentoGridSecondDemo />}
      {selected === "BentoGridThirdDemo" && <BentoGridThirdDemo />}
    </div>
  );
}
