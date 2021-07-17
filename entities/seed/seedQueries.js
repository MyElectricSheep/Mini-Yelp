const createDatabaseQuery = `
    CREATE TABLE city (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        UNIQUE (name)
    );

    CREATE TABLE tag (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        UNIQUE (name)
    );

    CREATE TABLE restaurant (
        id SERIAL NOT NULL,
        name VARCHAR(255) NOT NULL,
        picture VARCHAR(255),
        city_id int NOT NULL,
        geolocation POINT,
        PRIMARY KEY (id),
        CONSTRAINT fk_city_id FOREIGN KEY (city_id) REFERENCES city (id) ON DELETE CASCADE
    );

    CREATE TABLE comment (
        id SERIAL PRIMARY KEY,
        restaurant_id int NOT NULL,
        comment TEXT NOT NULL,
        published_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_restaurant_id FOREIGN KEY (restaurant_id) REFERENCES restaurant (id) ON DELETE CASCADE
    );

    CREATE TABLE restaurant_has_tag (
        restaurant_id INT NOT NULL,
        tag_id INT NOT NULL,
        PRIMARY KEY(restaurant_id, tag_id),
        FOREIGN KEY(restaurant_id) REFERENCES restaurant(id) ON DELETE CASCADE,
        FOREIGN KEY(tag_id) REFERENCES tag(id) ON DELETE CASCADE
    );
    `;

const deleteCitiesAndCommentsQuery = `
    DELETE FROM city RETURNING *;
    DELETE FROM comment RETURNING *;
`;

const createCitiesQuery = `
    INSERT INTO city (name) VALUES
    ('Paris'), ('New-York'), ('Tokyo'), ('London'), ('Lisbon'), ('Lagos'), ('Seoul'), ('Busan'), ('Ho Chi Minh City')
    RETURNING *;
`;

const createTagsQuery = `
    INSERT INTO tag (name) VALUES
    ('Hipster'), ('Brunch'), ('Cocktails'), ('Fancy'), ('Affordable'), ('Michelin starred'), ('Street food'), ('Exotic'), ('Romantic')
    RETURNING *;
`;

const genRandomCityId = (cityRows) => {
  const possibleIds = cityRows.map((city) => city.id);
  return possibleIds[Math.floor(Math.random() * possibleIds.length)];
};

const coordinates = {
  paris: { lat: 48.8566969, long: 2.3514616 },
  newYork: { lat: 40.7127281, long: -74.0060152 },
  tokyo: { lat: 35.6828387, long: 139.7594549 },
  london: { lat: 51.5073219, long: -0.1276474 },
  lisbon: { lat: 38.7077507, long: -9.1365919 },
  lagos: { lat: 6.4550575, long: 3.3941795 },
  seoul: { lat: 37.5666791, long: 126.9782914 },
  busan: { lat: 35.1799528, long: 129.0752365 },
  hoChiMinhCity: { lat: 10.7758439, long: 106.7017555 },
};

const createRestaurantsQuery = (cityRows) => `
  INSERT INTO restaurant (name, picture, city_id, geolocation) VALUES
  ('JoJo Pizza', 'https://via.placeholder.com/250', '${genRandomCityId(
    cityRows
  )}', POINT(${coordinates["paris"].long}, ${coordinates["paris"].lat})),
  ('The Falafel Queen', 'https://via.placeholder.com/250', '${genRandomCityId(
    cityRows
  )}', POINT(${coordinates["newYork"].long}, ${coordinates["newYork"].lat})),
  ('Sushi Me Tenderly', 'https://via.placeholder.com/250', '${genRandomCityId(
    cityRows
  )}', POINT(${coordinates["tokyo"].long}, ${coordinates["tokyo"].lat})),
  ('My Big Fat Greasy Kebab', 'https://via.placeholder.com/250', '${genRandomCityId(
    cityRows
  )}', POINT(${coordinates["london"].long}, ${coordinates["london"].lat})),
  ('The Excellium', 'https://via.placeholder.com/250', '${genRandomCityId(
    cityRows
  )}', POINT(${coordinates["lisbon"].long}, ${coordinates["lisbon"].lat})),
  ('Benito Pepito Pizza', 'https://via.placeholder.com/250', '${genRandomCityId(
    cityRows
  )}', POINT(${coordinates["lagos"].long}, ${coordinates["lagos"].lat})),
  ('Kim Duk Hwang - Taste of Korea', 'https://via.placeholder.com/250', '${genRandomCityId(
    cityRows
  )}', POINT(${coordinates["seoul"].long}, ${coordinates["seoul"].lat})),
  ('Banh Mi To The Moon', 'https://via.placeholder.com/250', '${genRandomCityId(
    cityRows
  )}', POINT(${coordinates["busan"].long}, ${coordinates["busan"].lat})),
  ('Ganges Upon Thames', 'https://via.placeholder.com/250', '${genRandomCityId(
    cityRows
  )}', POINT(${coordinates["hoChiMinhCity"].long}, ${
  coordinates["hoChiMinhCity"].lat
}))
  RETURNING *;
  `;

const createCommentsQuery = (comment, restaurantIds) => `
  INSERT INTO comment (restaurant_id, comment) VALUES ('${
    restaurantIds[Math.floor(Math.random() * restaurantIds.length)]
  }', '${comment}') RETURNING *;
  `;

const attachTagToRestaurantQuery = (restaurantId, tagId) => `
  INSERT INTO restaurant_has_tag (restaurant_id, tag_id) VALUES
  ('${restaurantId}', '${tagId}')
  RETURNING *;
`;

const nukeQuery = `
DROP TABLE IF EXISTS restaurant_has_tag;
DROP TABLE IF EXISTS comment;
DROP TABLE IF EXISTS tag;
DROP TABLE IF EXISTS restaurant;
DROP TABLE IF EXISTS city;
`;

module.exports = {
  createDatabaseQuery,
  deleteCitiesAndCommentsQuery,
  createCitiesQuery,
  createTagsQuery,
  createRestaurantsQuery,
  createCommentsQuery,
  attachTagToRestaurantQuery,
  nukeQuery,
};
