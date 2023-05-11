export const getCode = () => {
    const codeValues = [1, 2, 3, 4];
    let code = '';
    for (let i = 0; i < 3; i++) {
        code += codeValues[Math.floor(Math.random() * codeValues.length)];
    }
    return code;
};