export const getCode = () => {
    const codeValues = [1, 2, 3, 4];
    let code = '';
    for (let i = 0; i < 3; i++) {
        const index = Math.floor(Math.random() * codeValues.length);
        code += codeValues[index];
        codeValues.splice(index, 1);
    }
    return code;
};