import React, { useState, useRef, useEffect } from 'react';
import myImage from './images/myImage.jpeg';
import DrivingGame from './DrivingGame';

const robotAscii = `
██████╗  ██╗ ███╗   ███╗  █████╗  ████████╗ ██╗   ██╗ ██████╗  ██╗   ██╗ ███████╗
██╔══██╗ ██║ ████╗ ████║ ██╔══██╗ ╚══██╔══╝ ██║   ██║ ██╔══██╗ ██║   ██║ ██╔════╝
██████╔╝ ██║ ██╔████╔██║ ███████║    ██║    ██║   ██║ ██████╔╝ ██║   ██║ ███████╗
██╔══██╗ ██║ ██║╚██╔╝██║ ██╔══██║    ██║    ██║   ██║ ██╔══██╗ ██║   ██║ ╚════██║
██║  ██║ ██║ ██║ ╚═╝ ██║ ██║  ██║    ██║    ╚██████╔╝ ██║  ██║ ╚██████╔╝ ███████║
╚═╝  ╚═╝ ╚═╝ ╚═╝     ╚═╝  ╚═╝  ╚═╝    ╚═╝     ╚═════╝  ╚═╝  ╚═╝  ╚═════╝  ╚══════╝
by Edoardo Caciorgna

`;

// Mobile-friendly ASCII art - simplified version for small screens
const mobileRobotAscii = `
██████╗ ██╗███╗   ███╗ █████╗ ████████╗██╗   ██╗██████╗ ██╗   ██╗███████╗
██╔══██╗██║████╗ ████║██╔══██╗╚══██╔══╝██║   ██║██╔══██╗██║   ██║██╔════╝
██████╔╝██║██╔████╔██║███████║   ██║   ██║   ██║██████╔╝██║   ██║███████╗
██╔══██╗██║██║╚██╔╝██║██╔══██║   ██║   ██║   ██║██╔══██╗██║   ██║╚════██║
██║  ██║██║██║ ╚═╝ ██║██║  ██║   ██║   ╚██████╔╝██║  ██║╚██████╔╝███████║
╚═╝  ╚═╝╚═╝╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚══════╝
by Edoardo Caciorgna
`;

const commands = {
    help: <p><strong>Available commands:</strong> 
            <br></br>- <strong>clear</strong> : clear the terminal,
            <br></br>- <strong>contacts</strong> , 
            <br></br>- <strong>cv</strong> : download my CV,
            <br></br>- <strong>dv</strong> : display autonomous driving visualization,
            <br></br>- <strong>education</strong> : what I studied, 
            <br></br>- <strong>help</strong>  : shows this help message, 
            <br></br>- <strong>projects</strong> : main project where I was involved, 
            <br></br>- <strong>research</strong> : the fields I'm interested in, 
            <br></br>- <strong>skills</strong> ,
            <br></br>- <strong>whoami</strong> : a brief introduction to me, 
            </p>,
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
    dv: <DrivingGame />,
    cv: '[Prompting for CV download...]',
};


export default function RoboticsTerminal() {
    const [history, setHistory] = useState([]);
    const [input, setInput] = useState('');
    const [suggestion, setSuggestion] = useState(''); // Add suggestion state
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const inputRef = useRef(null);
    const terminalRef = useRef(null);
    const bottomRef = useRef(null); // New ref for scrolling to bottom
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
        
        // Enhanced click handler that focuses input when clicking anywhere on terminal background
        const handleTerminalClick = (e) => {
            // Get the clicked element
            const target = e.target;
            
            // Don't capture clicks on interactive elements or their children
            if (target.tagName === 'INPUT' || 
                target.tagName === 'BUTTON' || 
                target.tagName === 'A' || 
                target.tagName === 'IMG' ||
                target.classList.contains('cursor-pointer') ||
                target.closest('button') || 
                target.closest('a') ||
                target.closest('.cursor-pointer')) {
                return;
            }
            
            // Focus the input for any other clicks within the terminal
            if (inputRef.current) {
                inputRef.current.focus();
                
                // For mobile, ensure keyboard appears and cursor is at end of input
                if (isMobile) {
                    const length = inputRef.current.value.length;
                    inputRef.current.setSelectionRange(length, length);
                }
            }
        };
        
        // Add the click handler to the entire terminal
        if (terminalRef.current) {
            terminalRef.current.addEventListener('click', handleTerminalClick);
        }
        
        return () => {
            window.removeEventListener('resize', checkMobile);
            if (terminalRef.current) {
                // eslint-disable-next-line
                terminalRef.current.removeEventListener('click', handleTerminalClick);
            }
        };
    }, [isMobile]); // Add isMobile as dependency
    
    // Enhanced scroll to bottom when history changes
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        // Refocus the input after scrolling
        inputRef.current?.focus();
    }, [history]);

    // Ensure focus is maintained after any state change
    useEffect(() => {
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
        return () => clearTimeout(timer);
    }, [input, waitingForCvResponse]);

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

    // Check for command suggestions when input changes
    const handleInputChange = (e) => {
        const newInput = e.target.value;
        setInput(newInput);
        
        // Check if input has capital letters
        if (/[A-Z]/.test(newInput)) {
            // Find commands that match case-insensitively
            const commandKeys = Object.keys(commands);
            const matchingCommands = commandKeys.filter(cmd => 
                cmd.toLowerCase().startsWith(newInput.toLowerCase())
            );
            
            if (matchingCommands.length > 0) {
                setSuggestion(matchingCommands[0]); // Use the first match as suggestion
            } else {
                setSuggestion('');
            }
        } else {
            setSuggestion('');
        }
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

            const commandToExecute = suggestion || input; // Use suggestion if available
            
            if (commandToExecute.trim() !== '') {
                if (commandToExecute === 'clear') {
                    setHistory([]);
                }
                else if (commandToExecute === 'cv') {
                    // Show a prompt asking if they want to download the CV
                    setHistory([...history, {
                      command: commandToExecute,
                      response: 'Do you want to download my CV? [Y/n]'
                    }]);
                    setWaitingForCvResponse(true);
                }
                else {
                    setHistory([...history, {
                        command: commandToExecute,
                        response: commands[commandToExecute] || 'Command not found'
                    }]);
                    
                    // Add command to history for arrow navigation
                    setCommandHistory([commandToExecute, ...commandHistory]);
                }
                setInput('');
                setSuggestion(''); // Clear suggestion
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
            e.preventDefault();
            
            // If there's a suggestion, use it
            if (suggestion) {
                setInput(suggestion);
                setSuggestion('');
                return;
            }
            
            // Existing Tab completion code...
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
        // Refocus input after any key press
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    // New function to handle command execution via tap
    const executeCommandByTap = (command) => {
        if (command === 'clear') {
            setHistory([]);
        }
        else if (command === 'cv') {
            setHistory([...history, {
                command: command,
                response: 'Do you want to download my CV? [Y/n]'
            }]);
            setWaitingForCvResponse(true);
        }
        else {
            setHistory([...history, {
                command: command,
                response: commands[command] || 'Command not found'
            }]);
            
            // Add command to history for arrow navigation
            setCommandHistory([command, ...commandHistory]);
        }
        // Focus the input again after executing command
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 0);
    };

    // Modify the help command to include clickable items in mobile mode
    const renderHelp = () => {
        if (!isMobile) {
            return commands.help;
        }
        
        return (
            <div>
                <p><strong>Available commands:</strong> <span className="text-[#2aa198] italic">(tap on any command to execute it)</span></p>
                <p onClick={() => executeCommandByTap('clear')} className="cursor-pointer hover:text-[#2aa198]">
                    - <strong>clear</strong>: clear the terminal
                </p>
                <p onClick={() => executeCommandByTap('contacts')} className="cursor-pointer hover:text-[#2aa198]">
                    - <strong>contacts</strong>
                </p>
                <p onClick={() => executeCommandByTap('cv')} className="cursor-pointer hover:text-[#2aa198]">
                    - <strong>cv</strong>: download my CV
                </p>
                <p onClick={() => executeCommandByTap('dv')} className="cursor-pointer hover:text-[#2aa198]">
                    - <strong>dv</strong>: display autonomous driving visualization
                </p>
                <p onClick={() => executeCommandByTap('education')} className="cursor-pointer hover:text-[#2aa198]">
                    - <strong>education</strong>: what I studied
                </p>
                <p onClick={() => executeCommandByTap('help')} className="cursor-pointer hover:text-[#2aa198]">
                    - <strong>help</strong>: shows this help message
                </p>
                <p onClick={() => executeCommandByTap('projects')} className="cursor-pointer hover:text-[#2aa198]">
                    - <strong>projects</strong>: main project where I was involved
                </p>
                <p onClick={() => executeCommandByTap('research')} className="cursor-pointer hover:text-[#2aa198]">
                    - <strong>research</strong>: the fields I'm interested in
                </p>
                <p onClick={() => executeCommandByTap('skills')} className="cursor-pointer hover:text-[#2aa198]">
                    - <strong>skills</strong>
                </p>
                <p onClick={() => executeCommandByTap('whoami')} className="cursor-pointer hover:text-[#2aa198]">
                    - <strong>whoami</strong>: a brief introduction to me
                </p>
            </div>
        );
    };

    return (
        <div 
            ref={terminalRef} 
            className="bg-[#002b36] text-[#839496] min-h-screen p-2 md:p-4 font-mono overflow-auto text-sm md:text-base terminal-container"
        >
            <pre className={`text-[#268bd2] overflow-x-auto whitespace-pre-wrap leading-tight ${isMobile ? 'text-[1.8vw]' : 'text-xs md:text-sm'}`}>
                {isMobile ? mobileRobotAscii : robotAscii}
            </pre>
            <div className="mb-2 text-[#2aa198] text-sm md:text-base leading-tight">
                Hi there, welcome to my personal website. 👋<br></br>I'm a dedicated and enthusiastic Master's degree student pursuing a degree in Robotics Engineering, with a strong passion for robotics, autonomous driving, and cutting-edge technology.
                <br></br><br></br>
                (This is a fake terminal. Type 'help' to see available commands)
            </div>
            <div className="mb-1">
                <div className="flex flex-wrap">
                    <span className="text-[#859900]">user@EdoardoCaciorgna:</span>
                    <span className="text-[#268bd2]">~$</span>
                    <span className="text-[#b58900] ml-1">help</span>
                </div>
                <div className="ml-2 whitespace-pre-line text-[#839496] leading-tight">
                    {renderHelp()}
                </div>
            </div>
            {history.map((item, index) => (
                <div key={index} className="mb-1">
                    <div className="flex flex-wrap">
                        <span className="text-[#859900]">user@EdoardoCaciorgna:</span>
                        <span className="text-[#268bd2]">~$</span>
                        <span className="text-[#b58900] ml-1">{item.command}</span>
                    </div>
                    <div className={`ml-2 whitespace-pre-line ${item.command in commands ? 'text-[#839496]' : 'text-[#dc322f]'} break-words leading-tight`}>
                        {item.response}
                    </div>
                </div>
            ))}
            <div className="flex flex-wrap items-center">
                <span className="text-[#859900]">user@EdoardoCaciorgna:</span>
                <span className="text-[#268bd2]">~$</span>
                <div className="flex-grow relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={executeCommand}
                        autoFocus
                        className="bg-transparent outline-none text-[#b58900] ml-1 w-full"
                        onClick={(e) => e.stopPropagation()}
                    />
                    {suggestion && (
                        <div className="absolute left-1 top-0 text-gray-500 pointer-events-none">
                            {input}
                            <span className="text-[#586e75]">{suggestion.slice(input.length)}</span>
                        </div>
                    )}
                </div>
            </div>
            <div ref={bottomRef} /> {/* Invisible element at the bottom for scrolling */}
        </div>
    );
}
