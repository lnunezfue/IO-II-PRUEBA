import * as math from 'mathjs'
export const eval2 = (expression) => {
    if (typeof expression === 'number') {
        expression = expression.toString();
    }
    return math.evaluate(expression);
}