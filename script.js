
require.config({ paths: { 'vs': 'monaco-editor/min/vs' } });
require(['vs/editor/editor.main'], function () {
    const dataInput = document.querySelector('#data-input');
    // const dataFormat = document.querySelector('#data-format');
    // const dataAliases = document.querySelector('#data-aliases');
    const btnSplitInput = document.querySelector('#split-input');

    // const data = document.querySelector('#data-output');
    // const dataResidue = document.querySelector('#data-residue');
    // const templateInput = document.querySelector('#template-input');
    const checkboxIterateByJS = document.querySelector('#iterate-by-js');
    const btnApplyTemplate = document.querySelector('#apply-template');
    // const output = document.querySelector('#output');
    const btnPreviewHTML = document.querySelector('#preview-html');
    const previewBox = document.querySelector('#preview-box');


    const dataInputB = monaco.editor.create(document.getElementById('data-input-b'), {
        value: '',
        language: 'plaintext',
        mouseWheelScrollSensitivity: 0.2,
    });
    dataInputB.onDidBlurEditorWidget(() => onDataChange());
    (document.querySelector('span[data-editor-id="data-input-b"]')
        .appendChild(createLanguageSelector(dataInputB))
    );

    const dataFormatB = monaco.editor.create(document.getElementById('data-format-b'), {
        value: '',
        language: 'plaintext',
        minimap: { enabled: false },
        mouseWheelScrollSensitivity: 0.2,
    });
    dataFormatB.onDidBlurEditorWidget(() => onDataChange());

    const dataAliasesB = monaco.editor.create(document.getElementById('data-aliases-b'), {
        value: '',
        language: 'plaintext',
        minimap: { enabled: false },
        lineNumbers: "off",
        mouseWheelScrollSensitivity: 0.2,
    });
    dataAliasesB.onDidBlurEditorWidget(() => onDataChange());

    const dataOutputB = monaco.editor.create(document.getElementById('data-output-b'), {
        value: '',
        language: 'json',
        mouseWheelScrollSensitivity: 0.2,
    });
    (document.querySelector('span[data-editor-id="data-output-b"]')
        .appendChild(createDummyLanguageSelector('json'))
    );

    const dataResidueB = monaco.editor.create(document.getElementById('data-residue-b'), {
        value: '',
        language: 'json',
        minimap: { enabled: false },
        mouseWheelScrollSensitivity: 0.2,
    });
    (document.querySelector('span[data-editor-id="data-residue-b"]')
        .appendChild(createDummyLanguageSelector('json'))
    );
    const templateInputB = monaco.editor.create(document.getElementById('template-input-b'), {
        value: '<table>\n' +
            '{{#each this}}\n' +
            '<tr style="font-size:{{math size "/" 2}}px;">\n' +
            '    <td>{{@index}}</td>\n' +
            '    <td>{{name}}</td>\n' +
            '    <td>{{description}}</td>\n' +
            '</tr>\n' +
            '{{/each}}\n' +
            '</table>',
        language: 'handlebars',
        mouseWheelScrollSensitivity: 0.2,
    });
    (document.querySelector('span[data-editor-id="template-input-b"]')
        .appendChild(createDummyLanguageSelector('handlebars'))
    );

    const outputB = monaco.editor.create(document.getElementById('output-b'), {
        value: '',
        language: 'plaintext',
        minimap: { enabled: false },
        mouseWheelScrollSensitivity: 0.2,
    });
    (document.querySelector('span[data-editor-id="output-b"]')
        .appendChild(createLanguageSelector(outputB))
    );

    window.onresize = () => {
        dataInputB.layout();
        dataFormatB.layout();
        dataAliasesB.layout();
        dataOutputB.layout();
        dataResidueB.layout();
        templateInputB.layout();
        outputB.layout();
    };
    document.querySelectorAll('.btn-size.minus').forEach((btnMinus) => {
        const editorId = (btnMinus.dataset || {}).editorId;
        if (editorId) {
            btnMinus.addEventListener('click', () => {
                const editor = document.querySelector(`#${editorId}`);

                editor.style.height = Math.max(100, (parseFloat(editor.style.height)||0) - 100) + 'px';
                editor.children[0].layout();
            })
        }
    });

    document.querySelectorAll('.btn-size.plus').forEach((btnPlus) => {
        const editorId = (btnPlus.dataset || {}).editorId;
        if (editorId) {
            btnPlus.addEventListener('click', () => {
                const editor = document.querySelector(`#${editorId}`).children[0];

                editor.style.height = ((parseFloat(editor.style.height)||0) + 100) + 'px';
                editor.layout();
            })
        }
    });



    // console.log([
    //     dataInput,
    //     dataFormat,
    //     data,
    //     templateInput,
    //     output,
    // ]);


    // dataInput.addEventListener('focusout', () => onDataChange());
    // dataFormat.addEventListener('focusout', () => onDataChange());
    // dataAliases.addEventListener('focusout', () => onDataChange());
    btnSplitInput.addEventListener('click', () => onDataChange());
    //templateInput.addEventListener('change', () => onDataChange());

    btnApplyTemplate.addEventListener('click', () => applyTemplate());
    btnPreviewHTML.addEventListener('click', () => previewHTML());

    document.querySelectorAll('.error').forEach((elem) => {
        elem.innerText = '';
        elem.style.display = 'none';
    });
    function onDataChange() {
        document.querySelectorAll('.error').forEach((elem) => {
            elem.innerText = '';
            elem.style.display = 'none';
        });

        console.log('onDataChange', [
            dataInputB.getValue(),
            dataFormatB.getValue(),
            dataOutputB.getValue(),
            templateInputB.getValue(),
            outputB.getValue(),
        ]);

        const aliasList = ['_fullMatch', ...dataAliasesB.getValue().split('\n')];
        let splitRegex;
        let tokenRegex;
        try {
            splitRegex = new RegExp(dataFormatB.getValue(), 'gm'); // global multiline
            tokenRegex = new RegExp(dataFormatB.getValue(), 'm'); // global multiline
        } catch (error) {
            document.querySelector('#data-format-error').innerText = error;
            document.querySelector('#data-format-error').style.display = 'block';
            throw error;
        }

        // const canMatch = dataRegex.match(dataInput.value);
        const residue = dataInputB.getValue().replace(splitRegex, '');
        const isTotalMatch = residue === '';
        const matchResults = dataInputB.getValue().match(splitRegex);

        console.log(dataInputB.getValue().split(tokenRegex));


        dataResidueB.setValue(JSON.stringify(dataInputB.getValue()
            .replace(splitRegex, '\0')
            .split('\0')
            .filter((token) => token !== ''),
            null, 4)
        );

        // console.log(matchResults);

        let matchResultSummary = matchResults == null ? 'no match' : `${matchResults.length} matches`;
        if (isTotalMatch) {
            matchResultSummary += ', full match';
            // dataResidueB.style.backgroundColor = 'white';
        } else {
            matchResultSummary += ', partial match';
            // dataResidueB.style.backgroundColor = '#FFCCCC';
        }
        document.querySelector('#data-count-label').innerHTML = `(${matchResultSummary})`;

        if (!matchResults || matchResults.length <= 0) {
            document.querySelector('#data-count-label').innerHTML = `(no match)`;
            return;
        }

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
        dataOutputB.setValue(JSON.stringify(tokensList, null, 4));
        window.tokensList = tokensList;
    }

    function applyTemplate() {
        document.querySelectorAll('.error').forEach((elem) => {
            elem.innerText = '';
            elem.style.display = 'none';
        });
        try {
            // compile the template
            const template = Handlebars.compile(templateInputB.getValue());
            window.template = template;
            // execute the compiled template and print the output to the console

            if (checkboxIterateByJS.checked) {
                outputB.setValue(tokensList.map((tokens) => template(tokens)).join('\n\n'));
            } else {
                outputB.setValue(template(tokensList));
            }
        } catch (error) {
            document.querySelector('#template-input-error').innerText = error;
            document.querySelector('#template-input-error').style.display = 'block';
            throw error;
        }
    }

    function previewHTML() {
        previewBox.innerHTML = outputB.getValue();
    }

    function initData() {
        dataInputB.setValue('RegExp.prototype.compile() 23\n' +
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
            'Returns a string representing the specified object. Overrides the Object.prototype.toString() method.'
        );

        dataFormatB.setValue('RegExp.prototype.(.+) ([\\d\\.]+)\n' +
            '(.+)'
        );

        dataAliasesB.setValue('name\n' +
            'size\n' +
            'description'
        );

        // templateInput.value = '<table>\n' +
        //     '{{#each this}}\n' +
        //     '<tr style="font-size:{{math size "/" 2}}px;">\n' +
        //     '    <td>{{@index}}</td>\n' +
        //     '    <td>{{name}}</td>\n' +
        //     '    <td>{{description}}</td>\n' +
        //     '</tr>\n' +
        //     '{{/each}}\n' +
        //     '</table>';
    }

    function createLanguageSelector(editor) {
        const list = [
            'abap',
            'aes',
            'apex',
            'azcli',
            'bat',
            'c',
            'clojure',
            'coffeescript',
            'cpp',
            'csharp',
            'csp',
            'css',
            'dockerfile',
            'fsharp',
            'go',
            'graphql',
            'handlebars',
            'html',
            'ini',
            'java',
            'javascript',
            'json',
            'kotlin',
            'less',
            'lua',
            'markdown',
            'mips',
            'msdax',
            'mysql',
            'objective-c',
            'pascal',
            'pascaligo',
            'perl',
            'pgsql',
            'php',
            'plaintext',
            'postiats',
            'powerquery',
            'powershell',
            'pug',
            'python',
            'r',
            'razor',
            'redis',
            'redshift',
            'ruby',
            'rust',
            'sb',
            'scheme',
            'scss',
            'shell',
            'sol',
            'sql',
            'st',
            'swift',
            'tcl',
            'twig',
            'typescript',
            'vb',
            'xml',
            'yaml',
        ];

        const select = document.createElement('select');
        list.forEach((item) => {
            const option = document.createElement('option');
            option.value = item;
            option.innerHTML = item;
            if (item === 'plaintext') option.selected = 'selected';
            select.appendChild(option);
        });

        select.addEventListener('change', ({ target }) => {
            monaco.editor.setModelLanguage(editor.getModel(), target.value);
        })
        return select;
    }

    function createDummyLanguageSelector(item) {

        const select = document.createElement('select');
        const option = document.createElement('option');
        option.value = item;
        option.innerHTML = item;
        option.selected = 'selected';
        select.appendChild(option);
        select.disabled = 'disabled';

        return select;
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

});

