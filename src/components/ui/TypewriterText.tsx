import React, { useState, useEffect } from "react";

interface TypewriterTextProps {
  text: string | string[];
  delay?: number;
  speed?: number;
  deleteSpeed?: number;
  pauseTime?: number;
  className?: string;
  loop?: boolean;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  delay = 0, 
  speed = 100,
  deleteSpeed = 50,
  pauseTime = 2000,
  className = "",
  loop = true
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let i = 0;
    let isDeleting = false;
    let textIndex = 0;
    const texts = Array.isArray(text) ? text : [text];

    const typeWriter = () => {
      const currentText = texts[textIndex];
      setIsTyping(true);

      if (!isDeleting) {
        setDisplayedText(currentText.substring(0, i + 1));
        i++;
        if (i < currentText.length) {
          timeoutId = setTimeout(typeWriter, speed);
        } else {
          setIsTyping(false);
          if (loop || textIndex < texts.length - 1) {
            timeoutId = setTimeout(() => {
              isDeleting = true;
              typeWriter();
            }, pauseTime);
          }
        }
      } else {
        setDisplayedText(currentText.substring(0, i - 1));
        i--;
        if (i > 0) {
          timeoutId = setTimeout(typeWriter, deleteSpeed);
        } else {
          isDeleting = false;
          textIndex = (textIndex + 1) % texts.length;
          if (!loop && textIndex === 0) {
            setIsTyping(false);
            return;
          }
          timeoutId = setTimeout(typeWriter, speed);
        }
      }
    };

    timeoutId = setTimeout(typeWriter, delay);

    return () => clearTimeout(timeoutId);
  }, [text, delay, speed, deleteSpeed, pauseTime, loop]);

  return (
    <span className={`inline-flex items-center ${className}`}>
      {displayedText}
      <span 
        className={`inline-block w-[3px] h-[1em] bg-primary align-middle ml-1 ${
          !isTyping ? "animate-pulse" : ""
        }`}
      ></span>
    </span>
  );
};

export default TypewriterText;
