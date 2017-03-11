module.exports = {
    pagination: require('./pagination'),
    ifArray: (item, options) => {
        if(Array.isArray(item)) {
            return options.fn(item);
        } else {
            return options.inverse(item);
        }
    }
};