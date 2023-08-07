const crypto = require('crypto');

const numsToRGBColor = ([color1, color2, color3]) => {
  return `rgb(${color1}, ${color2}, ${color3})`;
};

// Look at how we promisified the crypto.randomFill function!
// It returns a promise of an array with 3 random numbers 0-255 in it
const getRandomBytes = () => new Promise((resolve, reject) => {
  crypto.randomFill(new Uint8Array(3), (err, buf) => {
    if (err) return reject(err);
    resolve([...buf]);
  });
});

const return4RandomColors = () => {
  const colors = [];
  return getRandomBytes()
    .then(() => {
    })
    .then(() => {
    })
    .then(() => {
    })
    .then(() => {
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = {
  numsToRGBColor,
  getRandomBytes,
  return4RandomColors,
};
