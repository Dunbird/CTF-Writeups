document.addEventListener('DOMContentLoaded', () => {
    const term = new Terminal();
    term.open(document.getElementById('terminal'));
    term.writeln('Welcome to my portfolio! Type "help" for a list of commands.');
    term.prompt = 'user@portfolio:~$ ';

    // Handle input from the user
    term.onData(e => {
        if (e === '\r') {
            return;
        }

        // Process command
        if (e === 'help\r') {
            term.writeln('Available commands:');
            term.writeln('about  - Learn more about me');
            term.writeln('contact - Contact information');
            term.writeln('blog    - View my blog');
            term.writeln('writeups - Read my writeups');
            term.writeln('clear   - Clear the terminal');
            term.prompt = 'user@portfolio:~$ ';
        } else if (e === 'about\r') {
            term.writeln('About me: I am a cybersecurity specialist...');
            term.prompt = 'user@portfolio:~$ ';
        } else if (e === 'contact\r') {
            term.writeln('Contact: example@example.com');
            term.prompt = 'user@portfolio:~$ ';
        } else if (e === 'blog\r') {
            term.writeln('Blog: Here is a link to my blog...');
            term.prompt = 'user@portfolio:~$ ';
        } else if (e === 'writeups\r') {
            term.writeln('Read my writeups on cybersecurity...');
            term.prompt = 'user@portfolio:~$ ';
        } else if (e === 'clear\r') {
            term.clear();
            term.prompt = 'user@portfolio:~$ ';
        } else {
            term.writeln('Command not found. Type "help" for available commands.');
            term.prompt = 'user@portfolio:~$ ';
        }
    });
});
