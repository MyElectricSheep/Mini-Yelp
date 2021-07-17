const db = require("../../database/client");
const {
  createDatabaseQuery,
  deleteCitiesAndCommentsQuery,
  createCitiesQuery,
  createTagsQuery,
  createRestaurantsQuery,
  createCommentsQuery,
  attachTagToRestaurantQuery,
  nukeQuery,
} = require("./seed.queries");

const create = async (req, res, next) => {
  try {
    await db.query(createDatabaseQuery);
    res.send("Database successfully created");
  } catch (e) {
    next(e);
  }
};

const seed = async (req, res, next) => {
  try {
    // Remove all previous values before seeding (prevent UNIQUE constraint errors)
    const [{ rows: cityDeleteRows }, { rows: tagDeleteRows }] = await db
      .query(deleteCitiesAndCommentsQuery)
      .catch((e) => console.log({ deleteQueryError: e.message }));

    // Seed tables sequentially (not in parallel, some depend upon the others (for foreign keys))
    // 1/ cities
    // 2/ tags
    // 3/ restaurants
    // 4/ comments
    // 5/ restaurant_has_tag

    const { rows: cityRows } = await db
      .query(createCitiesQuery)
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

    const { rows: tagRows } = await db
      .query(createTagsQuery)
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

    const { rows: restaurantRows } = await db
      .query(createRestaurantsQuery(cityRows))
      .catch((e) => console.log({ restaurantSeedError: e.message }));
    // Will return something like this:
    //   [
    //     {
    //         "id": 1,
    //         "name": "JoJo",
    //         "picture": "https://via.placeholder.com/250",
    //         "city_id": 5,
    //         "geolocation": {
    //         "x": -87.6244212,
    //         "y": 41.8755616
    //          }
    //     },
    //     {
    //         "id": 2,
    //         "name": "Falafel King",
    //         "picture": "https://via.placeholder.com/250",
    //         "city_id": 3,
    //         "geolocation": {
    //         "x": -87.6244212,
    //         "y": 41.8755616
    //          }
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

    const commentsPromises = fakeComments.map(async (comment) => {
      try {
        const { rows: commentsRow } = await db.query(
          createCommentsQuery(comment, restaurantIds)
        );
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

    const tagIds = tagRows.map((tag) => tag.id);

    const restaurantTagsPromises = restaurantIds.map(async (restaurantId) => {
      try {
        const { rows: restaurantTagsRow } = await db.query(
          attachTagToRestaurantQuery(
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
    next(e);
  }
};

const destroy = async (req, res, next) => {
  try {
    await db.query(nukeQuery);
    res.send("Database successfully wiped clean");
  } catch (e) {
    next(e);
  }
};

module.exports = {
  create,
  seed,
  destroy,
};
