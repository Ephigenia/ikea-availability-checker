import * as checker from "."

(async function() {
    const result = await checker.availability('394', '00501436');
    console.log('RESULT', result);
})();
