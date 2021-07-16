const db = require("../database/client");

module.exports.seedPart1 = async (req, res, next) => {
  //Questions query
  const questionsQuery = `
    INSERT INTO question (name) VALUES
    ('Save the wahles'), ('Eat less chicken')
    RETURNING *;
`;

  try {
    const { rows: questionRows } = await db.query(questionsQuery);
  } catch (e) {
    console.log({ questionSeedError: e.message });
  }

  // Scientist query
  const scientistsQuery = `
    INSERT INTO scientist (name, picture, city_id) VALUES
    ('JoJo Pizza', 'https://via.placeholder.com/250', '123'),
    ('The Falafel Queen', 'https://via.placeholder.com/250', '123'),
    ('Sushi Me Tenderly', 'https://via.placeholder.com/250', '123'),
    ('My Big Fat Greasy Kebab', 'https://via.placeholder.com/250', '123'),
    ('The Excellium', 'https://via.placeholder.com/250', '123'),
    ('Benito Pepito Pizza', 'https://via.placeholder.com/250', '123'),
    ('Kim Duk Hwang - Taste of Korea', 'https://via.placeholder.com/250', '123'),
    ('Banh Mi To The Moon', 'https://via.placeholder.com/250', '123'),
    ('Ganges Upon Thames', 'https://via.placeholder.com/250', '123')
    RETURNING *;
`;

  try {
    const { rows: scientistsRows } = await db.query(scientistsQuery);
  } catch (e) {
    console.log({ questionSeedError: e.message });
  }

  res.send({
    questionRows,
    scientistsRows,
  });
};
