exports.flip = function flip() {
    return (Math.floor(Math.random() * 2) == 0) ? 'heads' : 'tails';
}

exports.flips = function flips(flips) {
    let array = [];
    for (let i = 1; i <= flips; i++) {
        array.push(flip());
    }
    return array;
}

exports.countFlips = function countFlips(array) {
    let counter = {};
    array.forEach(item => {
        if (counter[item]) {
            counter[item]++;
        } else {
            counter[item] = 1;
        }
    });
    return counter;
}

exports.flipCall = function flipCall(call) {
    let flip = flip();
    let result;
    if ( flip === call ) {
        result = 'win'
    } else {
        result = 'lose'
    }
    let game = {
        call: call,
        flip: flip,
        result: result
    }
    return game
}