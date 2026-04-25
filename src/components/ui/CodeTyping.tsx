import React, { useState, useEffect } from "react";

const CodeTyping = () => {
  const [text, setText] = useState("");
  const code = `const developer = {
  name: 'Felix Wahyu',
  role: 'Web Developer',
  skills: ['React', 'TypeScript', 'TailwindCSS'],
  passion: 'Building awesome web apps'
};

// Ready to build the future...
developer.startCoding();`;

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(code.slice(0, i + 1));
      i++;
      if (i >= code.length) clearInterval(interval);
    }, 50); // Typing speed

    return () => clearInterval(interval);
  }, [code]);

  // Simple syntax highlighter
  const highlightCode = (codeText: string) => {
    const html = codeText
      .replace(/const /g, '<span class="text-[#569cd6]">const </span>')
      .replace(/developer /g, '<span class="text-[#4fc1ff]">developer </span>')
      .replace(/'([^'\n]*)'?/g, '<span class="text-[#ce9178]">\'$1\'</span>') // strings
      .replace(/(name|role|skills|passion)(?=:)/g, '<span class="text-[#9cdcfe]">$1</span>') // object keys
      .replace(/\/\/.*$/gm, '<span class="text-[#6a9955]">$&</span>') // comments
      .replace(/startCoding/g, '<span class="text-[#dcdcaa]">startCoding</span>'); // functions
    return { __html: html };
  };

  return (
    <div className="w-full h-auto bg-[#1e1e1e] text-[#d4d4d4] rounded-[2rem] overflow-hidden flex flex-col font-mono shadow-2xl border-4 border-background z-10 relative rotate-3 hover:rotate-0 transition-transform duration-500 ease-out">
      {/* Mac Window Header */}
      <div className="h-10 shrink-0 bg-[#2d2d2d] flex items-center px-4 gap-2 border-b border-[#ffffff10]">
        <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] shadow-[0_0_10px_rgba(255,95,86,0.5)]"></div>
        <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] shadow-[0_0_10px_rgba(255,189,46,0.5)]"></div>
        <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] shadow-[0_0_10px_rgba(39,201,63,0.5)]"></div>
        <div className="mx-auto text-[#858585] text-xs font-semibold mr-10">developer.ts</div>
      </div>
      
      {/* Code Editor Body */}
      <div className="p-4 sm:p-6 text-xs sm:text-sm md:text-base text-left bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] relative">
        
        {/* INVISIBLE OVERLAY: Forces container to take exact final size from the start */}
        <div className="flex opacity-0 pointer-events-none select-none" aria-hidden="true">
          <div className="flex flex-col pr-4 text-right border-r border-transparent mr-4">
            {code.split('\n').map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <pre className="whitespace-pre-wrap font-mono m-0">
            {code}
            <span className="inline-block w-2 h-5 ml-1 align-middle"></span>
          </pre>
        </div>

        {/* ABSOLUTE OVERLAY: The actual typing animation */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex">
          {/* Line Numbers */}
          <div className="flex flex-col text-[#858585] select-none pr-4 text-right border-r border-[#ffffff10] mr-4 opacity-50">
            {code.split('\n').map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          {/* Code Content */}
          <pre className="whitespace-pre-wrap font-mono m-0 relative break-all">
            <span dangerouslySetInnerHTML={highlightCode(text)} />
            <span className="inline-block w-2 h-5 bg-primary animate-pulse ml-1 align-middle opacity-80"></span>
          </pre>
        </div>

      </div>
    </div>
  );
};

export default CodeTyping;
