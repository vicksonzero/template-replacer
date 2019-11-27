# template-replacer

Simple regex split / replace, with handlebar template support

Version 1 written in 3 hours (thanks npm)

# How to use

1. Put your source to `data-input`. Note that the null character `\0` is reserved for internal use.
2. Make a regular expression in `data-format` (default with flags g and m, stands for global and multiline)
    - The whole regex will split the source into records,
    - The capture groups will tokenize each record
    - Fell free to match the whole input though. it is up to you.
3. (Optional) List out aliases for the capture groups, separate by new lines
4. Press "Split input"
5. Preview the split `data`, check `data-residue` for any sign of mismatch
6. In `template-input`, put your template in the handlebarjs language. handlebar v4 is used.
7. Press "Apply Template" to convert data


# TODO

- Save as file for reuse (or other persistence)
- Bootstrap
- Code editor (monarch by microsoft?)
- Handlebar helpers
- Common file format tokenizer cheatsheet (such as csv)






