const path = require('path');
const ScoreCounter = require('score-tests');
const { return4RandomColors } = require('./modify');

const testSuiteName = 'Modify Tests';
const scoresDir = path.join(__dirname, '..', 'scores');
const scoreCounter = new ScoreCounter(testSuiteName, scoresDir);

describe(testSuiteName, () => {
  afterEach(() => {
    jest.clearAllMocks();
    // flushing promises, don't worry about it
    return new Promise(setImmediate);
  });

  it('return4RandomColors - should return 4 different colors each time in a promised array', () => {
    let firstColor1;
    let firstColor2;
    let firstColor3;
    let firstColor4;

    return return4RandomColors()
      .then((colors) => {
        expect(colors).toHaveLength(4);
        const [color1, color2, color3, color4] = colors;
        firstColor1 = color1;
        firstColor2 = color2;
        firstColor3 = color3;
        firstColor4 = color4;
        expect(color1).toMatch(/rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)/);
        expect(color2).toMatch(/rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)/);
        expect(color3).toMatch(/rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)/);
        expect(color4).toMatch(/rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)/);

        return return4RandomColors();
      })
      .then((colors) => {
        expect(colors).toHaveLength(4);
        const [color1, color2, color3, color4] = colors;
        expect(color1).not.toBe(firstColor1);
        expect(color2).not.toBe(firstColor2);
        expect(color3).not.toBe(firstColor3);
        expect(color4).not.toBe(firstColor4);

        scoreCounter.correct(expect); // DO NOT TOUCH
      })
      .catch((err) => {
        expect(err).toBeNull();
      });
  });

  // IGNORE PLEASE
  beforeEach(() => scoreCounter.add(expect));
  afterAll(scoreCounter.export);
});
