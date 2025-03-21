"use client";
import { useState, useEffect } from "react";
import { IconArrowNarrowRight } from "@tabler/icons-react";

interface SlideData {
  title: string;
  button: string;
  src: string;
}

interface CarouselControlProps {
  type: string;
  title: string;
  handleClick: () => void;
}

const CarouselControl = ({ type, title, handleClick }: CarouselControlProps) => {
  return (
    <button
      className={`w-10 h-10 flex items-center mx-2 justify-center bg-neutral-200 dark:bg-neutral-800 border-3 border-transparent rounded-full focus:border-[#6D64F7] focus:outline-none hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 ${
        type === "previous" ? "rotate-180" : ""
      }`}
      title={title}
      onClick={handleClick}
    >
      <IconArrowNarrowRight className="text-neutral-600 dark:text-neutral-200" />
    </button>
  );
};

interface CarouselProps {
  slides: SlideData[];
}

export default function Carousel({ slides }: CarouselProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prevCurrent) => (prevCurrent + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePreviousClick = () => {
    const previous = current - 1;
    setCurrent(previous < 0 ? slides.length - 1 : previous);
  };

  const handleNextClick = () => {
    const next = current + 1;
    setCurrent(next === slides.length ? 0 : next);
  };

  return (
    <div className="relative w-full h-[60vh] md:h-[50vh] lg:h-[70vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className="absolute inset-0 w-full h-full transition-opacity duration-1000"
          style={{
            opacity: current === index ? 1 : 0,
            zIndex: current === index ? 10 : 0,
          }}
        >
          <img
            className="w-full h-full object-fill"
            style={{
              objectPosition: "center",
              // objectFit: "contain"
            }}
            src={slide.src || "/placeholder.svg"}
            alt=""
            loading="eager"
          />
        </div>
      ))}
      <div className="absolute flex justify-center w-full bottom-4">
        <CarouselControl
          type="previous"
          title="Go to previous slide"
          handleClick={handlePreviousClick}
        />
        <CarouselControl
          type="next"
          title="Go to next slide"
          handleClick={handleNextClick}
        />
      </div>
    </div>
  );
}
