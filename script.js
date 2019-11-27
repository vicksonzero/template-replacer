const dataInput = document.querySelector('#data-input');
const dataFormat = document.querySelector('#data-format');
const dataAliases = document.querySelector('#data-aliases');

const data = document.querySelector('#data');
const dataResidue = document.querySelector('#data-residue');
const templateInput = document.querySelector('#template-input');
const output = document.querySelector('#output');

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

function onDataChange() {

    console.log('onDataChange', [
        dataInput.value,
        dataFormat.value,
        data.value,
        templateInput.value,
        output.value,
    ]);

    const aliasList = dataAliases.value.split('\n');

    const splitRegex = new RegExp(dataFormat.value, 'gm'); // global multiline
    const tokenRegex = new RegExp(dataFormat.value, 'm'); // global multiline

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

            tokens.forEach((token, i) => (result[aliasList[i - 1] || i] = token));

            result._matchIndex = matchIndex;
            result._input = tokens.input;
            return result;
        })
    );
    // console.log(tokensList);
    data.value = JSON.stringify(tokensList, null, 4);

    // compile the template
    const template = Handlebars.compile(templateInput.value);
    window.template = template;
    // execute the compiled template and print the output to the console
    output.value = tokensList.map((tokens) => template(tokens)).join('\n\n');
}

function initData() {
    dataInput.value = 'RegExp.prototype.compile()\n' +
        '(Re-)compiles a regular expression during execution of a script.\n' +
        'RegExp.prototype.exec()\n' +
        'Executes a search for a match in its string parameter.\n' +
        'RegExp.prototype.test()\n' +
        'Tests for a match in its string parameter.\n' +
        'RegExp.prototype[@@match]()\n' +
        'Performs match to given string and returns match result.\n' +
        'RegExp.prototype[@@matchAll]()\n' +
        'Returns all matches of the regular expression against a string.\n' +
        'RegExp.prototype[@@replace]()\n' +
        'Replaces matches in given string with new substring.\n' +
        'RegExp.prototype[@@search]()\n' +
        'Searches the match in given string and returns the index the pattern found in the string.\n' +
        'RegExp.prototype[@@split]()\n' +
        'Splits given string into an array by separating the string into substring.\n' +
        'RegExp.prototype.toSource() \n' +
        'Returns an object literal representing the specified object; you can use this value to create a new object. Overrides the Object.prototype.toSource() method.\n' +
        'RegExp.prototype.toString()\n' +
        'Returns a string representing the specified object. Overrides the Object.prototype.toString() method.';

    dataFormat.value = 'RegExp.prototype.(.+)\n' +
        '(.+)';

    dataAliases.value = 'name\n' +
        'description';

    templateInput.value = '<tr>\n' +
        '    <td>{{name}}</td>\n' +
        '    <td>{{description}}</td>\n' +
        '</tr>';
}


initData();