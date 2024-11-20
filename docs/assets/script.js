document.addEventListener("DOMContentLoaded", () => {
    const outputElement = document.getElementById("terminal-output");
    const inputElement = document.getElementById("command-input");
  
    const commands = {
      help: "Available commands: about, contact, blog, writeups, clear",
      about: "This is a terminal-style portfolio for Dunbird (Carlos C.)!",
      contact: "Email: notdunbird@gmail.com",
      blog: "Blog section is under construction.",
      writeups: "Visit: /CTF-Writeups for detailed writeups.",
    };
  
    const executeCommand = (command) => {
      if (command === "clear") {
        outputElement.innerHTML = "";
        return;
      }
  
      if (commands[command]) {
        appendOutput(commands[command]);
      } else {
        appendOutput(`Command not found: ${command}`);
      }
    };
  
    const appendOutput = (text) => {
      outputElement.innerHTML += `<div>${text}</div>`;
      outputElement.scrollTop = outputElement.scrollHeight;
    };
  
    inputElement.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        const command = inputElement.value.trim();
        inputElement.value = "";
        appendOutput(`> ${command}`);
        executeCommand(command);
      }
    });
  
    appendOutput("Welcome to my terminal-style portfolio! Type 'help' to get started.");
  });
  