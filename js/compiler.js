const variables = {};

const ReplaceMent = [
    '.',
    '(',
    ')'
];

const syntax  = {
    'var': '#00f',
    "out": '#ff0',
    ';': '#4d4949',
    'func': '#b64dca',
    'endfunc': '#b64dca',
    '(': '#ff0',
    ')': '#ff0',
    '"': '#f00',
    'console': '#00bfff',
    'Clear': '#b64dca'
}

function Run() {
    let jshConsole = document.querySelector('.window .jshConsole');
    let jshConsoleContent = document.querySelector('.window .jshConsole .jshConsoleContent');
    let jshConsoleTitle = document.querySelector('.window .jshConsole .jshTitle');

    jshConsoleTitle.style['display'] = 'flex';
        jshConsole.style['height'] = '250px'; 
        jshConsole.style['background'] = '#1c1a1a';
    jshConsoleContent.style['height'] = '190px'; 
    jshConsoleContent.style['display'] = 'block';

    let script = document.querySelectorAll('.window .windowContent .content .codeLine');

    script.forEach(line => {
        lineContent = line.innerText;
        if(!lineContent.includes('#')) {
            let words = lineContent.split(' ');

            Execute(words);
        }
    });
}

function Syntax() {
    let linesContainer = document.querySelector('.window .codeOverFlow .windowContent .codeLines');
    let codeLines = document.querySelectorAll('.window .windowContent .content .codeLine');

    for(let i = 0; i < codeLines.length; i++) {
       linesContainer.innerHTML += `<p>${i+1}.</p>`;
    }
    
    codeLines.forEach(line =>  {
        let codeLine = '<p class="codeLine">'; 
        let content = line.innerText;

        if(line.innerText.includes('#')) {
            codeLine = `<span style="color: #545454;"> ${content} </span> </p>`;
            line.innerHTML = codeLine;
        }
        else {
            let data = ReplaceSyntax(content);
            let words = data.split(' ');

            words.forEach(word => {
                if(!word.includes('"')) {
                    if(word in syntax)
                        codeLine += `<span style="color: ${syntax[word]}; filter: drop-shadow(2px 4px 10px ${syntax[word]});"> ${word} </span>`;
                        
                        else 
                            codeLine += `${word} `;
                    }
                    else {
                        codeLine += `<span style="color: #f00; filter: drop-shadow(2px 4px 10px #f00);"> ${word} </span>`;
                    }
            });

            codeLine += '</p>';
            line.innerHTML = codeLine;
        }
    });     
}


function Execute(script) {
    for(let i = 0; i < script.length-1; i++) {
        switch(script[i]) {
            case 'var':
                let value = script[i+3];
                value = value.replaceAll('"', '');

                if(script[i+2] != '=')
                    variables[script[i+1]] = 'none';
                else {
                    variables[script[i+1]] = value;
                }
            break;

            case 'out': 
                DisplayConsole('Hello world!');
            break;
        }
    }
}


function DisplayConsole(consoleData) {
    let jshConsoleContent = document.querySelector('.window .jshConsole .jshConsoleContent');
    let data = new Date()

    let m = data.getMinutes();
    let s = data.getSeconds();
    let h = data.getHours();

    jshConsoleContent.innerHTML += `<p><i>[${h}:${m}:${s}]</i> <b>${consoleData}</b></p>\n`; 
}

function ReplaceSyntax(script) {
    ReplaceMent.forEach(el => {
        script = script.replaceAll(el, ' ');
    });
    return script;
}