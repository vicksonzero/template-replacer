const dataInput = document.querySelector('#data-input');
const dataFormat = document.querySelector('#data-format');
const dataAliases = document.querySelector('#data-aliases');

const data = document.querySelector('#data');
const dataResidue = document.querySelector('#data-residue');
const templateInput = document.querySelector('#template-input');
const checkboxIterateByJS = document.querySelector('#iterate-by-js');
const btnApplyTemplate = document.querySelector('#apply-template');
const output = document.querySelector('#output');
const btnPreviewHTML = document.querySelector('#preview-html');
const previewBox = document.querySelector('#preview-box');


// console.log([
//     dataInput,
//     dataFormat,
//     data,
//     templateInput,
//     output,
// ]);


dataInput.addEventListener('change', () => onDataChange());
dataFormat.addEventListener('change', () => onDataChange());
dataAliases.addEventListener('change', () => onDataChange());
templateInput.addEventListener('change', () => onDataChange());

btnApplyTemplate.addEventListener('click', () => applyTemplate());
btnPreviewHTML.addEventListener('click', () => previewHTML());

function onDataChange() {
    document.querySelectorAll('.error').forEach((elem) => elem.innerText = '');

    console.log('onDataChange', [
        dataInput.value,
        dataFormat.value,
        data.value,
        templateInput.value,
        output.value,
    ]);

    const aliasList = ['_fullMatch', ...dataAliases.value.split('\n')];
    let splitRegex;
    let tokenRegex;
    try {
        splitRegex = new RegExp(dataFormat.value, 'gm'); // global multiline
        tokenRegex = new RegExp(dataFormat.value, 'm'); // global multiline
    } catch (error) {
        document.querySelector('#data-format-error').innerText = error;
        throw error;
    }

    // const canMatch = dataRegex.match(dataInput.value);
    const residue = dataInput.value.replace(splitRegex, '');
    const isTotalMatch = residue === '';
    const matchResults = dataInput.value.match(splitRegex);

    console.log(dataInput.value.split(tokenRegex));


    dataResidue.value = JSON.stringify(dataInput.value
        .replace(splitRegex, '\0')
        .split('\0')
        .filter((token) => token !== ''),
        null, 4);

    // console.log(matchResults);

    let matchResultSummary = matchResults == null ? 'no match' : `${matchResults.length} matches`;
    if (isTotalMatch) {
        matchResultSummary += ', total match';
        dataResidue.style.backgroundColor = 'white';
    } else {
        matchResultSummary += ', partial match';
        dataResidue.style.backgroundColor = '#FFCCCC';
    }
    document.querySelector('#data-count-label').innerHTML = `(${matchResultSummary})`;

    if (matchResults.length <= 0) return;

    const tokensList = (matchResults
        .map((match) => {
            return tokenRegex.exec(match);
        })
        .map((tokens, matchIndex) => {
            const result = {};

            tokens.forEach((token, i) => (result[aliasList[i] || i] = token));

            result._matchIndex = matchIndex;
            result._input = tokens.input;
            return result;
        })
    );
    // console.log(tokensList);
    data.value = JSON.stringify(tokensList, null, 4);
    window.tokensList = tokensList;
}

function applyTemplate() {
    try {
        // compile the template
        const template = Handlebars.compile(templateInput.value);
        window.template = template;
        // execute the compiled template and print the output to the console

        if (checkboxIterateByJS.checked) {
            output.value = tokensList.map((tokens) => template(tokens)).join('\n\n');
        } else {
            output.value = template(tokensList);
        }
    } catch (error) {
        document.querySelector('#template-input-error').innerText = error;
        throw error;
    }
}

function previewHTML() {
    previewBox.innerHTML = output.value;
}

function initData() {
    dataInput.value = 'RegExp.prototype.compile() 23\n' +
        '(Re-)compiles a regular expression during execution of a script.\n' +
        'RegExp.prototype.exec() 34\n' +
        'Executes a search for a match in its string parameter.\n' +
        'RegExp.prototype.test() 56\n' +
        'Tests for a match in its string parameter.\n' +
        'RegExp.prototype[@@match]() 18\n' +
        'Performs match to given string and returns match result.\n' +
        'RegExp.prototype[@@matchAll]() 14\n' +
        'Returns all matches of the regular expression against a string.\n' +
        'RegExp.prototype[@@replace]() 24\n' +
        'Replaces matches in given string with new substring.\n' +
        'RegExp.prototype[@@search]() 123\n' +
        'Searches the match in given string and returns the index the pattern found in the string.\n' +
        'RegExp.prototype[@@split]() 12.4\n' +
        'Splits given string into an array by separating the string into substring.\n' +
        'RegExp.prototype.toSource() 123\n' +
        'Returns an object literal representing the specified object; you can use this value to create a new object. Overrides the Object.prototype.toSource() method.\n' +
        'RegExp.prototype.toString() 44\n' +
        'Returns a string representing the specified object. Overrides the Object.prototype.toString() method.';

    dataFormat.value = 'RegExp.prototype.(.+) ([\\d\\.]+)\n' +
        '(.+)';

    dataAliases.value = 'name\n' +
        'size\n' +
        'description';

    templateInput.value = '<table>\n' +
        '{{#each this}}\n' +
        '<tr style="font-size:{{math size "/" 2}}px;">\n' +
        '    <td>{{@index}}</td>\n' +
        '    <td>{{name}}</td>\n' +
        '    <td>{{description}}</td>\n' +
        '</tr>\n' +
        '{{/each}}\n' +
        '</table>';
}

Handlebars.registerHelper("math", function (lValue, operator, rValue, options) {
    if (arguments.length < 4) {
        // Operator omitted, assuming "+"
        options = rValue;
        rValue = operator;
        operator = "+";
    }

    lValue = parseFloat(lValue);
    rValue = parseFloat(rValue);

    return {
        "+": lValue + rValue,
        "-": lValue - rValue,
        "*": lValue * rValue,
        "/": lValue / rValue,
        "%": lValue % rValue
    }[operator];
});

initData();