const variables = {};

const ReplaceMent = [
    '.'
];

const executedVariables = []

const HEX = '0123456789ABCDEF';

const syntax  = {
    'var': '#7400fe',
    "out": '#ff0',
    ';': '#4d4949',
    'func': '#b64dca',
    'endfunc': '#b64dca',
    'if': '#b64dca',
    'endif': '#b64dca',
    'extends': '#ff8910',
    '(': '#ff0',
    ')': '#ff0',
    '"': '#f00',
    'console': '#00bfff',
    'Clear()': '#b64dca',
    'floor': '#0f0',
    '>': '#4d4949',
    '<': '#4d4949',
    '=': '#4d4949',
    '/=': '#4d4949',
    'goto': '#f00',
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
    
    let start = GetTime();

    let script = document.querySelectorAll('.window .windowContent .content .codeLine');

    script.forEach(line => {
        lineContent = line.innerText;
        if(!lineContent.includes('#')) {
            let words = lineContent.split(' ');
            Execute(words);
        }
    });

    let end = GetTime();

    // DisplayConsole(`Execution time: ${start/end}s`);
}

function Syntax() {
    let linesContainer = document.querySelector('.window .windowContent .codeLines');
    let codeLines = document.querySelectorAll('.window .windowContent .content .codeLine');

    for(let i = 0; i < codeLines.length; i++) {
       linesContainer.innerHTML += `<p>${i+1}.</p>`;
    }
    
    codeLines.forEach(line =>  {
        let content = line.innerText;
        let codeLine = '';

        if(line.innerText.includes('#')) {
            codeLine = `<span style="color: #545454;"> ${content} </span> </p>`;
            line.innerHTML = codeLine;
        }
        else {
            let data = ReplaceSyntax(content);
            let words = data.split(' ');

            if(words.includes('var'))
                executedVariables.push(words[1])

            words.forEach(word => {
                if(!word.includes('"')) {
                    if(word in syntax)
                        codeLine += `<span style="color: ${syntax[word]}; filter: drop-shadow(2px 4px 10px ${syntax[word]});"> ${word} </span>`;
                        
                        else if(!executedVariables.includes(word))
                            codeLine += `${word} `;
                        else 
                            codeLine += `<span style="color: #ff7f1d; filter: drop-shadow(2px 4px 10px #ff7f1d);"> ${word} </span>`;
                    }   

                else {
                    codeLine += `<span style="color: #f00; filter: drop-shadow(2px 4px 10px #f00);"> ${word} </span>`;
                }
            });

            line.innerHTML = codeLine;
        }
    });   
    codeLines[codeLines.length-1].innerHTML += '<span class="cursor">|</span>';  
}


function Execute(script) {
    for(let i = 0; i < script.length; i++) {
        let command = script[i];
        switch(command) {
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
                let key = script[i+1]; 
                
                if(key in variables) {
                    let adress = GetHexVariableAdress(key);
                    DisplayConsole(`<span style="color: #68c8ec; filter: drop-shadow(2px 2px 6px #68c8ec);">${variables[key]}</span> (${adress})`);
                }
                else
                    DisplayConsole(key);
            break;

            case 'Clear()':
                DisplayConsole('Console has been cleared.', true);
            break;

            }
        }
    }
    
    
function DisplayConsole(consoleData, clear=false ,color='none') {
    let jshConsoleContent = document.querySelector('.window .jshConsole .jshConsoleContent');
    let data = new Date()
    
    if(clear)
        jshConsoleContent.innerHTML = '';

    let m = LeadingZero(data.getMinutes());
    let s = LeadingZero(data.getSeconds());
    let h = LeadingZero(data.getHours());
    

    jshConsoleContent.innerHTML += `<p><i>[${h}:${m}:${s}]</i> <b>${consoleData}</b></p>\n`; 
}

function ReplaceSyntax(script) {
    ReplaceMent.forEach(el => {
        script = script.replaceAll(el, ' ');
    });
    return script;
}

function LeadingZero(content) {
    return (content < 10) ? "0"+content : content;
} 


function CloseConsole() {
    let jshConsole = document.querySelector('.window .jshConsole');
    let jshConsoleContent = document.querySelector('.window .jshConsole .jshConsoleContent');
    let jshConsoleTitle = document.querySelector('.window .jshConsole .jshTitle');
    
    jshConsoleTitle.style['display'] = 'none';
    jshConsole.style['height'] = '0px'; 
    jshConsole.style['background'] = '#00000000';
    jshConsoleContent.style['height'] = '0px'; 
    jshConsoleContent.style['display'] = 'none';
}

function GetTime() {
    let dayTime = new Date();
    return dayTime.getHours()*3600+dayTime.getMinutes()*60+dayTime.getSeconds()+dayTime.getMilliseconds();
}

function GetHexVariableAdress(variable) {
    let adress = executedVariables.indexOf(variable);

    if (adress == 0)
        return '0x0000';
    else {
        let hexAdress = '';
        
        while(adress > 0) {
            hexAdress += HEX[adress%16];
            adress = Math.floor(adress/16);
        }
        let ADRESS = '0x';

        for(let i = 0; i < 4-hexAdress.length; i++) {
            ADRESS += '0';
        }
        ADRESS += hexAdress;
        return ADRESS;
    }


}