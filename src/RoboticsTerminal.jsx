import React, { useState, useRef, useEffect } from 'react';
import myImage from './images/myImage.jpeg';

const commands = {
	help: <p><strong>Available commands:</strong> help, whoami, education, research, projects, skills, contacts, clear</p>,
	
	whoami: `Hi there 👋\nI'm a dedicated and enthusiastic Master's degree student pursuing a degree in Robotics Engineering, with a strong passion for robotics, autonomous driving, and cutting-edge technology.\n\nFun fact: My GitHub username "rimaturus" is derived from the Latin word "rimor" meaning "to explore/discover." I chose this verb in the future participle form to reflect my ongoing passion and commitment for delving into new technologies and pushing the boundaries of what's possible in robotics.`,

	education: `🎓 Master's Degree in Robotics Engineering - University of Pisa\n🎓 Bachelor's Degree in Electronics Engineering - University of Pisa`,
	
	research: `Research Interests:\n\n🤖 Robotics\n🚗 Autonomous Driving\n📟 PCB & Microcontrollers`,
	
	projects: `Projects I have worked on:
				\n🏎️ ETeam Squadra Corse\n
					\t- Model Predictive Control for autonomous driving FSAE car based on SLAM and cone detection\n
					\t- GraphSLAM for precise and dynamic mapping and localization during environment exploration\n
					\t- Real-time code development using FreeRTOS for Vehicle Control Unit and other critical system
				\n
				\n🏎️ SmartDrive`,
	
	skills: `Skills:\n\n💻 Programming Languages: Python, C++\n🤖 Robotics Frameworks: ROS/ROS2 (Robot Operating System), Gazebo\n📂 Version Control: Git, GitHub, Gitlab\n🔧 Others: Docker, MATLAB/Simulink`,
	
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
};

const robotAscii = `
██████╗  ██╗ ███╗   ███╗  █████╗  ████████╗ ██╗   ██╗ ██████╗  ██╗   ██╗ ███████╗
██╔══██╗ ██║ ████╗ ████║ ██╔══██╗ ╚══██╔══╝ ██║   ██║ ██╔══██╗ ██║   ██║ ██╔════╝
██████╔╝ ██║ ██╔████╔██║ ███████║    ██║    ██║   ██║ ██████╔╝ ██║   ██║ ███████╗
██╔══██╗ ██║ ██║╚██╔╝██║ ██╔══██║    ██║    ██║   ██║ ██╔══██╗ ██║   ██║ ╚════██║
██║  ██║ ██║ ██║ ╚═╝ ██║ ██║  ██║    ██║    ╚██████╔╝ ██║  ██║ ╚██████╔╝ ███████║
╚═╝  ╚═╝ ╚═╝ ╚═╝     ╚═╝ ╚═╝  ╚═╝    ╚═╝     ╚═════╝  ╚═╝  ╚═╝  ╚═════╝  ╚══════╝
by Edoardo Caciorgna

`;

export default function RoboticsTerminal() {
	const [history, setHistory] = useState([]);
	const [input, setInput] = useState('');
	const [commandHistory, setCommandHistory] = useState([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const inputRef = useRef(null);

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
			if (input.trim() !== '') {
				if (input === 'clear') {
					setHistory([]);
				} else {
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
