import React, { useState, useRef, useEffect } from 'react';
import myImage from './images/myImage.jpeg';

const robotAscii = `
██████╗  ██╗ ███╗   ███╗  █████╗  ████████╗ ██╗   ██╗ ██████╗  ██╗   ██╗ ███████╗
██╔══██╗ ██║ ████╗ ████║ ██╔══██╗ ╚══██╔══╝ ██║   ██║ ██╔══██╗ ██║   ██║ ██╔════╝
██████╔╝ ██║ ██╔████╔██║ ███████║    ██║    ██║   ██║ ██████╔╝ ██║   ██║ ███████╗
██╔══██╗ ██║ ██║╚██╔╝██║ ██╔══██║    ██║    ██║   ██║ ██╔══██╗ ██║   ██║ ╚════██║
██║  ██║ ██║ ██║ ╚═╝ ██║ ██║  ██║    ██║    ╚██████╔╝ ██║  ██║ ╚██████╔╝ ███████║
╚═╝  ╚═╝ ╚═╝ ╚═╝     ╚═╝ ╚═╝  ╚═╝    ╚═╝     ╚═════╝  ╚═╝  ╚═╝  ╚═════╝  ╚══════╝
by Edoardo Caciorgna

`;

const commands = {
    help: <p><strong>Available commands:</strong> 
            <br></br>- help : this command, 
            <br></br>- whoami: a brief introduction to me, 
            <br></br>- education: what I studied, 
            <br></br>- research: the fields I'm interested in, 
            <br></br>- projects: main project where I was involved, 
            <br></br>- skills,
            <br></br>- contacts, 
            <br></br>- clear: clear the terminal</p>,
    
    whoami: `Hi there 👋\nI'm a dedicated and enthusiastic Master's degree student pursuing a degree in Robotics Engineering, with a strong passion for robotics, autonomous driving, and cutting-edge technology.\n\nFun fact: My GitHub username "rimaturus" is derived from the Latin word "rimor" meaning "to explore/discover." I chose this verb in the future participle form to reflect my ongoing passion and commitment for delving into new technologies and pushing the boundaries of what's possible in robotics.`,

    education: `🎓 Master's Degree in Robotics Engineering - University of Pisa\n🎓 Bachelor's Degree in Electronics Engineering - University of Pisa`,
    
    research: `Research Interests:\n\n🤖 Robotics\n🚗 Autonomous Driving\n📟 PCB & Microcontrollers`,
    
    projects: (
        <p>Projects I have worked on:
            <br/><br/>🏎️ <strong>ETeam Squadra Corse</strong><br/>
                - <strong>Model Predictive Control</strong> for autonomous driving FSAE car based on SLAM and cone detection<br/>
                - <strong>GraphSLAM</strong> for precise and dynamic mapping and localization during environment exploration<br/>
                - Real-time code development using FreeRTOS for Vehicle Control Unit and other critical system
            <br/><br/>
            🏎️ <strong>SmartDrive</strong>
        </p>
    ),
    
    skills: `Skills:\n\n💻 Programming Languages: Python, C++\n🤖 Robotics Frameworks: ROS/ROS2 (Robot Operating System), Gazebo\n📂 Version Control: Git, GitHub, Gitlab\n🔧 Others: Docker, MATLAB/Simulink`,
    
    quote: <p className="italic">The best way to predict the future is to invent it. - Alan Kay</p>,
    
    contacts: (
        <div className="flex items-center">
            <img src={myImage} alt="myImage" className="w-60 h-60 mr-4" />
            <div>
                <p><strong>Name:</strong> Edoardo Caciorgna</p>
                <p><strong>Email:</strong> edo.ca1999@gmail.com</p>
                <p><strong>GitHub:</strong> <a href="https://github.com/rimaturus" target="_blank" rel="noopener noreferrer">https://github.com/rimaturus</a></p>
                <p><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/edoardo-caciorgna-b45b5b183/" target="_blank" rel="noopener noreferrer">https://www.linkedin.com/in/edoardo-caciorgna-b45b5b183/</a></p>
            </div>
        </div>
    ),
    cv: '[Prompting for CV download...]',
};


export default function RoboticsTerminal() {
    const [history, setHistory] = useState([]);
    const [input, setInput] = useState('');
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const inputRef = useRef(null);
    const [waitingForCvResponse, setWaitingForCvResponse] = useState(false);

    useEffect(() => {
        // Focus the input when component mounts
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    // Helper function to find common prefix for tab completion
    const findCommonPrefix = (strings) => {
        if (strings.length === 0) return '';
        
        const firstString = strings[0];
        let prefixLength = firstString.length;
        
        for (let i = 1; i < strings.length; i++) {
            const currentString = strings[i];
            let j = 0;
            
            while (j < prefixLength && j < currentString.length && 
                firstString.charAt(j) === currentString.charAt(j)) {
                j++;
            }
            
            prefixLength = j;
        }
        
        return firstString.substring(0, prefixLength);
    };

    const executeCommand = (e) => {
        if (e.key === 'Enter') {
            // If waiting for the CV response, interpret Y/N
            if (waitingForCvResponse) {
                const userInput = input.trim().toLowerCase();
                if (userInput === 'n') {
                  setHistory((prev) => [
                    ...prev,
                    { command: input, response: 'Okay, maybe next time!' },
                  ]);
                  setWaitingForCvResponse(false);
                } else if (userInput === '' || userInput === 'y') {
                  setHistory((prev) => [
                    ...prev,
                    { command: input, response: 'Downloading CV...' },
                  ]);
                  // Replace '/myCV.pdf' with your actual PDF path
                  window.open('/CV_CaciorgnaEdoardo_EN.pdf', '_blank');
                  setWaitingForCvResponse(false);
                } else {
                  setHistory((prev) => [
                    ...prev,
                    {
                      command: input,
                      response: 'Invalid choice. Please press Y or Enter for yes, N for no.',
                    },
                  ]);
                }
                setInput('');
                setHistoryIndex(-1);
                return;
              }

            if (input.trim() !== '') {
                if (input === 'clear') {
                    setHistory([]);
                }
                else if (input === 'cv') {
                    // Show a prompt asking if they want to download the CV
                    setHistory([...history, {
                      command: input,
                      response: 'Do you want to download my CV? [Y/n]'
                    }]);
                    // Next user input is a response to the CV prompt
                    setWaitingForCvResponse(true);
                } else if (input === 'sl') {
                    // 1) Push the typed command to history so it shows up
                    setHistory((prev) => [...prev, { command: 'sl', response: '' }]);
                    
                    // 2) Call the helper that animates the train
                    runSlAnimation();
                }
                else {
                    setHistory([...history, {
                        command: input,
                        response: commands[input] || 'Command not found'
                    }]);
                    
                    // Add command to history for arrow navigation
                    setCommandHistory([input, ...commandHistory]);
                }
                setInput('');
                setHistoryIndex(-1);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
                setHistoryIndex(newIndex);
                setInput(commandHistory[newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(commandHistory[newIndex]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setInput('');
            }
        } else if (e.key === 'Tab') {
            e.preventDefault(); // Prevent default tab behavior
            
            // Get possible command completions
            const commandKeys = Object.keys(commands);
            const possibleCompletions = commandKeys.filter(cmd => cmd.startsWith(input));
            
            if (possibleCompletions.length === 1) {
                // If there's only one completion, use it
                setInput(possibleCompletions[0]);
            } else if (possibleCompletions.length > 1) {
                // If there are multiple completions, find common prefix
                const commonPrefix = findCommonPrefix(possibleCompletions);
                if (commonPrefix.length > input.length) {
                    setInput(commonPrefix);
                } else {
                    // Show possible completions in terminal
                    setHistory([...history, {
                        command: input,
                        response: `Possible commands: ${possibleCompletions.join(', ')}`
                    }]);
                }
            }
        }
    };

    function runSlAnimation() {
        // 1) Estimate screen width in “character columns.”
        //    For a typical monospace font, ~8px per char is a rough guess.
        const charWidthPx = 8;
        const screenWidthPx = window.innerWidth || 800; // Fallback if unavailable
         // eslint-disable-next-line
        const screenCols = Math.floor(screenWidthPx / charWidthPx);
      
        // 2) Our train ASCII, as one multiline string
        const trainString = `
                       _-====-__-======-__-========-_____-============-__
                     _(                                                 _)
                  OO(           _/_ _  _  _/_   _/_ _  _  _/_           )_
                 0  (_          (__(_)(_) (__   (__(_)(_) (__            _)
               o0     (_                                                _)
              o         '=-___-===-_____-========-___________-===-dwb-='
            .o                                _________
           . ______          ______________  |         |      _____
         _()_||__|| ________ |            |  |_________|   __||___||__
        (BNSF 1995| |      | |            | __Y______00_| |_         _|
      /-OO----OO""="OO--OO"="OO--------OO"="OO-------OO"="OO-------OO"=P
      #####################################################################
      `.trimStart(); // Remove leading blank lines if any
      
        // 3) Parse into lines, measure max width ignoring trailing spaces
        const rawLines = trainString.split('\n');
        // Trim trailing spaces on each line and store
        const trainLines = rawLines.map((ln) => ln.replace(/\s+$/, ''));
        const trainWidth = Math.max(
          ...trainLines.map((ln) => ln.length)
        );
      
        // For convenience, find left-most and right-most columns that are non-whitespace
        // to know exactly how far we must shift before it “disappears.”
        // If your train has leading spaces on every line, set `leftEdge = 0`.
        let leftEdge = trainWidth;
        let rightEdge = 0;
        trainLines.forEach((ln) => {
          const first = ln.search(/[^ ]|$/);      // first non-space in this line
          const last = ln.lastIndexOf(' ') === -1 ? ln.length - 1 : ln.search(/\s+$/) - 1;
          if (first >= 0 && first < leftEdge) leftEdge = first;
          if (last > rightEdge) rightEdge = last;
        });
        // If no non-whitespace found, fallback
        if (leftEdge > rightEdge) {
          leftEdge = 0;
          rightEdge = 0;
        }
      
        /*
          PHASES:
          - Phase A: “Enter” from the right:
             * Start showing 1 column, then 2 columns, etc., up to full train width.
          - Phase B: Shift the fully-visible train left until left-most character hits left screen edge.
          - Phase C: Continue shifting so it goes off the left side, but “shrinks” from the left.
            (One could instead keep it fully drawn until it fully disappears, but user asked
             for “like it is entering that side,” i.e. partial fade from left.)
             
          NOTE:
          * We do this by adjusting how many columns are visible, and from which index.
          * We'll store each “frame” in the React state. For example, setHistory([...prev, { ... }]).
        */
      
        const frames = [];
      
        // Helper: produce a single “slice” of the train: [colStart, colEnd) in each line
        function getTrainSlice(colStart, colEnd) {
          // Clip so we don’t go below 0 or above line length
          return trainLines
            .map((ln) => {
              // If colStart > lineLength or colEnd < 0, that line is offscreen
              if (colEnd <= 0 || colStart >= ln.length) {
                return '';
              }
              return ln.slice(
                Math.max(0, colStart),
                Math.min(ln.length, colEnd)
              );
            })
            .join('\n');
        }
      
        // Phase A: “train enters from right” => visible columns from 1..trainWidth
        for (let visible = 1; visible <= trainWidth; visible++) {
          // The train’s right edge = 0, so we show columns [trainWidth - visible, trainWidth).
          const colStart = trainWidth - visible;
          const colEnd = trainWidth;
          frames.push(getTrainSlice(colStart, colEnd));
        }
      
        // Phase B: “fully visible, shift left” until the left-most character (leftEdge) is at screen col 0
        // If trainWidth <= screenCols, the train might never fill the screen,
        // but we’ll shift until the left edge is at 0 anyway.
        // offset is how many columns from the left of the train to the left of the screen
        // At offset=0, we show columns [0, trainWidth].
        // We'll shift until offset = leftEdge (the earliest non-whitespace hits col 0).
        // Actually, if trainWidth < screenCols, we can skip or do a small shift.
        // We'll do it anyway in case the train is wide.
        for (let offset = 1; offset <= leftEdge; offset++) {
          const colStart = offset;
          const colEnd = offset + trainWidth; // same width
          frames.push(getTrainSlice(colStart, colEnd));
        }
      
        // Phase C: “exiting to the left,” i.e. now the train is fully on screen,
        // and we shift so that the left-most char eventually reaches the right side.
        // We'll keep shrinking from the left until only 1 col remains. So that is
        // trainWidth..1 columns as we shift. So how many frames? We'll let offset go from 0..(trainWidth).
        // We'll show columns [offset, offset + trainWidth].
        // But once offset surpasses rightEdge, we can break or continue until only 1 column is left.
        // We'll do a step each time and reduce the visible columns from trainWidth..1
        // The difference from Phase B is we keep shifting the entire train left. But user wants “fade from left,”
        // which means each step is effectively losing 1 column on the left side.
        // i.e. if offset=1, we see columns [1..1+trainWidth], so the leftmost col is omitted, and so on.
        for (let shift = 1; shift < trainWidth; shift++) {
          // We now see columns [shift, shift + (trainWidth - shift)]? Actually we want
          // the total width to shrink from trainWidth down to 1. So visibleWidth = trainWidth - shift
          const visibleWidth = trainWidth - shift;
          if (visibleWidth <= 0) break;
          const colStart = shift;             // skip 'shift' columns on left
          const colEnd = shift + visibleWidth;
          frames.push(getTrainSlice(colStart, colEnd));
        }
      
        // Now we have a big list of “frames” to display, in order.
        // We'll replace the same item in history so it’s visually one region changing, or
        // push new items to history if you prefer. Here we do the “single slot” approach:
      
        let slIndex = null;
        setHistory((prev) => {
          slIndex = prev.length;
          return [...prev, { command: '', response: '' }]; // empty first
        });
      
        frames.forEach((frame, i) => {
          setTimeout(() => {
            // Use <div style={{ whiteSpace: 'pre' }}> to preserve spacing
            const jsxFrame = (
              <div style={{ whiteSpace: 'pre' }}>
                {frame}
              </div>
            );
            setHistory((prev) => {
              const newHistory = [...prev];
              newHistory[slIndex] = { command: '', response: jsxFrame };
              return newHistory;
            });
          }, i * 150); // e.g. 150 ms per frame
        });
      }
      

    return (
        <div className="bg-[#002b36] text-[#839496] min-h-screen p-4 font-mono">
            <pre className="text-[#268bd2]">{robotAscii}</pre>
            <div className="mb-2 text-[#2aa198]">Welcome to my personal website. Type 'help' to begin. (This is a fake terminal)</div>
            {history.map((item, index) => (
                <div key={index} className="mb-1">
                    <div className="flex">
                        <span className="text-[#859900]">user@EdoardoCaciorgna:</span>
                        <span className="text-[#268bd2]">~$</span>
                        <span className="text-[#b58900] ml-2">{item.command}</span>
                    </div>
                    <div className={`ml-2 whitespace-pre-line ${item.command in commands ? 'text-[#839496]' : 'text-[#dc322f]'}`}>
                        {item.response}
                    </div>
                </div>
            ))}
            <div className="flex items-center">
                <span className="text-[#859900]">user@EdoardoCaciorgna:</span>
                <span className="text-[#268bd2]">~$</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={executeCommand}
                    autoFocus
                    className="bg-transparent outline-none text-[#b58900] ml-2 flex-grow"
                />
            </div>
        </div>
    );
}
