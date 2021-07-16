const db = require("../dabatase/client");

module.exports.create = async (req, res, next) => {
  const query = `
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
  try {
    await db.query(query);
    res.send("Database successfully created");
  } catch (e) {
    console.log(e.message);
  }
};

module.exports.seed = async (req, res, next) => {
  try {
    // Remove all previous values before seeding (prevent UNIQUE constraint errors)
    const deleteQuery = `
    DELETE FROM city RETURNING *;
    DELETE FROM comment RETURNING *;
`;

    const [{ rows: cityDeleteRows }, { rows: tagDeleteRows }] = await db
      .query(deleteQuery)
      .catch((e) => console.log({ deleteQuery: e.message }));

    // Seed tables sequentially (not in parallel, some depend upon the others (for foreign keys))
    // 1/ cities
    // 2/ tags
    // 3/ restaurants
    // 4/ comments
    // 5/ restaurant_has_tag

    const cityQuery = `
    INSERT INTO city (name) VALUES
    ('Paris'), ('New-York'), ('Tokyo'), ('London'), ('Lisbon'), ('Lagos'), ('Seoul'), ('Busan'), ('Ho Chi Minh City')
    RETURNING *;
`;

    const { rows: cityRows } = await db
      .query(cityQuery)
      .catch((e) => console.log({ citySeedError: e.message }));
    // Will return something like this:
    // [
    //     {
    //         "id": 1,
    //         "name": "Paris"
    //     },
    //     {
    //         "id": 2,
    //         "name": "New-York"
    //     }
    // ]

    const tagQuery = `
    INSERT INTO tag (name) VALUES
    ('Hipster'), ('Brunch'), ('Cocktails'), ('Fancy'), ('Affordable'), ('Michelin starred'), ('Street food'), ('Exotic'), ('Romantic')
    RETURNING *;
`;

    const { rows: tagRows } = await db
      .query(tagQuery)
      .catch((e) => console.log({ tagSeedError: e.message }));
    // Will return something like this:
    //    [
    //     {
    //         "id": 55,
    //         "name": "Hipster"
    //     },
    //     {
    //         "id": 56,
    //         "name": "Brunch"
    //     }
    //    ]

    const genRandomCityId = () => {
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

    const restaurantQuery = `
    INSERT INTO restaurant (name, picture, city_id, geolocation) VALUES
    ('JoJo Pizza', 'https://via.placeholder.com/250', '${genRandomCityId()}', POINT(${
      coordinates["paris"].long
    }, ${coordinates["paris"].lat})),
    ('The Falafel Queen', 'https://via.placeholder.com/250', '${genRandomCityId()}', POINT(${
      coordinates["newYork"].long
    }, ${coordinates["newYork"].lat})),
    ('Sushi Me Tenderly', 'https://via.placeholder.com/250', '${genRandomCityId()}', POINT(${
      coordinates["tokyo"].long
    }, ${coordinates["tokyo"].lat})),
    ('My Big Fat Greasy Kebab', 'https://via.placeholder.com/250', '${genRandomCityId()}', POINT(${
      coordinates["london"].long
    }, ${coordinates["london"].lat})),
    ('The Excellium', 'https://via.placeholder.com/250', '${genRandomCityId()}', POINT(${
      coordinates["lisbon"].long
    }, ${coordinates["lisbon"].lat})),
    ('Benito Pepito Pizza', 'https://via.placeholder.com/250', '${genRandomCityId()}', POINT(${
      coordinates["lagos"].long
    }, ${coordinates["lagos"].lat})),
    ('Kim Duk Hwang - Taste of Korea', 'https://via.placeholder.com/250', '${genRandomCityId()}', POINT(${
      coordinates["seoul"].long
    }, ${coordinates["seoul"].lat})),
    ('Banh Mi To The Moon', 'https://via.placeholder.com/250', '${genRandomCityId()}', POINT(${
      coordinates["busan"].long
    }, ${coordinates["busan"].lat})),
    ('Ganges Upon Thames', 'https://via.placeholder.com/250', '${genRandomCityId()}', POINT(${
      coordinates["hoChiMinhCity"].long
    }, ${coordinates["hoChiMinhCity"].lat}))
    RETURNING *;
    `;

    const { rows: restaurantRows } = await db
      .query(restaurantQuery)
      .catch((e) => console.log({ restaurantSeedError: e.message }));
    // Will return something like this:
    //   [
    //     {
    //         "id": 1,
    //         "name": "JoJo",
    //         "picture": "https://via.placeholder.com/250",
    //         "city_id": 5,
    //         "comment_id": null
    //     },
    //     {
    //         "id": 2,
    //         "name": "Falafel King",
    //         "picture": "https://via.placeholder.com/250",
    //         "city_id": 3,
    //         "comment_id": null
    //     }
    // ]

    const fakeComments = [
      "Lovely",
      "Very good!",
      "5 Stars *****",
      "The waiter is an a$$hole! And so is the manager!",
      "I would rather eat my own food!",
      "Me and my friends had a lovely time!",
      "How can this gem not be known more? Great food/service/ambiance",
      "Could avoid",
      "Oh, fantastic!",
    ];

    const restaurantIds = restaurantRows.map((restaurant) => restaurant.id);

    const commentsQuery = (comment) => `
    INSERT INTO comment (restaurant_id, comment) VALUES ('${
      restaurantIds[Math.floor(Math.random() * restaurantIds.length)]
    }', '${comment}') RETURNING *;
    `;

    const commentsPromises = fakeComments.map(async (comment) => {
      try {
        const { rows: commentsRow } = await db.query(commentsQuery(comment));
        return { ...commentsRow["0"] };
      } catch (e) {
        console.log({ commentsSeedError: e.message });
      }
    });

    const commentsRows = await Promise.all(commentsPromises);
    // Will return something like this:
    // [
    //     {
    //         "id": 1,
    //         "restaurant_id": 5,
    //         "comment": "Lovely",
    //         "published_date": "2020-11-20T01:23:12.966Z"
    //     },
    //     {
    //         "id": 2,
    //         "restaurant_id": 1,
    //         "comment": "5 Stars *****",
    //         "published_date": "2020-11-20T01:23:12.972Z"
    //     }
    // ]

    const restaurantTagsQuery = (restaurantId, tagId) => `
    INSERT INTO restaurant_has_tag (restaurant_id, tag_id) VALUES
    ('${restaurantId}', '${tagId}')
    RETURNING *;
`;

    const tagIds = tagRows.map((tag) => tag.id);

    const restaurantTagsPromises = restaurantIds.map(async (restaurantId) => {
      try {
        const { rows: restaurantTagsRow } = await db.query(
          restaurantTagsQuery(
            restaurantId,
            tagIds[Math.floor(Math.random() * tagIds.length)]
          )
        );
        return { ...restaurantTagsRow["0"] };
      } catch (e) {
        console.log({ restaurantTagsError: e.message });
      }
    });

    const restaurantTagsRows = await Promise.all(restaurantTagsPromises);
    // Will return something like:
    // [
    //     {
    //         "restaurant_id": 1,
    //         "tag_id": 6
    //     },
    //     {
    //         "restaurant_id": 2,
    //         "tag_id": 2
    //     }
    // ]

    // At the end: Return a formatted object containing all deleted/created values to the client
    res.send({
      created: [
        { cities: cityRows },
        { tags: tagRows },
        { restaurants: restaurantRows },
        { comments: commentsRows },
        { restaurant_tags: restaurantTagsRows },
      ],
      deleted: [{ cities: cityDeleteRows }, { tags: tagDeleteRows }],
    });
  } catch (e) {
    console.log({ seedDatabaseError: e.message });
  }
};

module.exports.destroy = async (req, res, next) => {
  const nukeQuery = `
        DROP TABLE IF EXISTS restaurant_has_tag;
        DROP TABLE IF EXISTS comment;
        DROP TABLE IF EXISTS tag;
        DROP TABLE IF EXISTS restaurant;
        DROP TABLE IF EXISTS city;
    `;
  try {
    await db.query(nukeQuery);
    res.send("Database successfully wiped clean");
  } catch (e) {
    console.log({ destroyDatabaseError: e.message });
  }
};
