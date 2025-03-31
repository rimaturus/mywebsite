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

// Mobile-friendly ASCII art - simplified version for small screens
const mobileRobotAscii = `
██████╗ ██╗███╗   ███╗ █████╗ ████████╗ ██╗   ██╗ ██████╗  ██╗   ██╗ ███████
██╔══██╗██║████╗ ████║██╔══██╗╚══██╔══╝ ██║   ██║ ██╔══██╗ ██║   ██║ ██╔════
██████╔╝██║██╔████╔██║███████║   ██║    ██║   ██║ ██████╔╝ ██║   ██║ ███████
██╔══██╗██║██║╚██╔╝██║██╔══██║   ██║    ██║   ██║ ██╔══██╗ ██║   ██║ ╚════██
██║  ██║██║██║ ╚═╝ ██║██║  ██║   ██║    ╚██████╔╝ ██║  ██║ ╚██████╔╝ ███████
╚═╝  ╚═╝╚═╝╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝     ╚═════╝  ╚═╝  ╚═╝  ╚═════╝  ╚══════
by Edoardo Caciorgna
`;

const commands = {
    help: <p><strong>Available commands:</strong> 
            <br></br>- help : shows this help message, 
            <br></br>- whoami: a brief introduction to me, 
            <br></br>- education: what I studied, 
            <br></br>- research: the fields I'm interested in, 
            <br></br>- projects: main project where I was involved, 
            <br></br>- skills,
            <br></br>- contacts, 
            <br></br>- cv: download my CV,
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
        <div className="flex flex-col md:flex-row items-center">
            <img src={myImage} alt="myImage" className="w-40 h-40 md:w-60 md:h-60 mb-4 md:mr-4" />
            <div>
                <p><strong>Name:</strong> Edoardo Caciorgna</p>
                <p><strong>Email:</strong> edo.ca1999@gmail.com</p>
                <p><strong>GitHub:</strong> <a href="https://github.com/rimaturus" target="_blank" rel="noopener noreferrer" className="break-all">https://github.com/rimaturus</a></p>
                <p><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/edoardo-caciorgna-b45b5b183/" target="_blank" rel="noopener noreferrer" className="break-all">https://www.linkedin.com/in/edoardo-caciorgna-b45b5b183/</a></p>
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
    const terminalRef = useRef(null);
    const [waitingForCvResponse, setWaitingForCvResponse] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Focus the input when component mounts
        if (inputRef.current) {
            inputRef.current.focus();
        }
        
        // Check if device is mobile
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    
    // Scroll to bottom when history changes
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

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

    return (
        <div ref={terminalRef} className="bg-[#002b36] text-[#839496] min-h-screen p-2 md:p-4 font-mono overflow-auto text-sm md:text-base">
            <pre className={`text-[#268bd2] overflow-x-auto whitespace-pre-wrap leading-tight ${isMobile ? 'text-[8px]' : 'text-xs md:text-sm'}`}>
                {isMobile ? mobileRobotAscii : robotAscii}
            </pre>
            <div className="mb-2 text-[#2aa198] text-sm md:text-base leading-tight">
                Hi there, welcome to my personal website. 👋<br></br>I'm a dedicated and enthusiastic Master's degree student pursuing a degree in Robotics Engineering, with a strong passion for robotics, autonomous driving, and cutting-edge technology.
                <br></br><br></br>
                (This is a fake terminal. Type 'help' to see available commands)
            </div>
            <div className="mb-1">
                <div className="flex flex-wrap">
                    <span className="text-[#859900]">user@EdoC:</span>
                    <span className="text-[#268bd2]">~$</span>
                    <span className="text-[#b58900] ml-1">help</span>
                </div>
                <div className="ml-2 whitespace-pre-line text-[#839496] leading-tight">
                    {commands.help}
                </div>
            </div>
            {history.map((item, index) => (
                <div key={index} className="mb-1">
                    <div className="flex flex-wrap">
                        <span className="text-[#859900]">user@EdoC:</span>
                        <span className="text-[#268bd2]">~$</span>
                        <span className="text-[#b58900] ml-1">{item.command}</span>
                    </div>
                    <div className={`ml-2 whitespace-pre-line ${item.command in commands ? 'text-[#839496]' : 'text-[#dc322f]'} break-words leading-tight`}>
                        {item.response}
                    </div>
                </div>
            ))}
            <div className="flex flex-wrap items-center">
                <span className="text-[#859900]">user@EdoC:</span>
                <span className="text-[#268bd2]">~$</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={executeCommand}
                    autoFocus
                    className="bg-transparent outline-none text-[#b58900] ml-1 flex-grow min-w-0"
                    onClick={() => {
                        // For mobile devices, ensure keyboard appears
                        if (inputRef.current) inputRef.current.focus();
                    }}
                />
            </div>
        </div>
    );
}
