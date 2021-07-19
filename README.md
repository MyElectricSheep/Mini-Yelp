# Mini Yelp Workshop Correction

#### The [detailled endpoints documentation for this API is available here](https://documenter.getpostman.com/view/14782056/TzmCgD9r)
#### A [deployed version of the API is located here](https://wbs-mini-yelp.herokuapp.com/)

Clone this repo `mini-yelp` on your computer, then go into the folder with your terminal and execute:

```sh
npm install
```

## Step 1: Initialize the project

### 1/ For the local environment: Use a local database:  

Create a [locally hosted postgres database](https://www.postgresqltutorial.com/postgresql-create-database/)  

Create a `.env` file at the root of the project  

Put the database credentials into your .env file as such:  
```
PGHOST=<Your database host>
PGUSER=<Your database user>
PGDATABASE=<Your database name>
PGPASSWORD=<Your database password>
PGPORT=5432
```

If you choose this option, run `npm run dev` and try to hit `http://localhost:3000/`  

You should get `Welcome to Mini-Yelp!` as a reply.

### 2/ For the production environment: Provision a database on Heroku:  

Deploy the project on Heroku following this [documentation](https://devcenter.heroku.com/articles/deploying-nodejs)

Create a database hosted on [Heroku Postgres](https://devcenter.heroku.com/articles/heroku-postgresql#provisioning-heroku-postgres) and link it to your project.  

Make sure the `DATABASE_URL` env variable is defined and that the DB connection string is passed on to the app.

(Note: You can also use ElephantSQL, but it comes with some limitations for the seeding)

## Step 2: Create and seed the database

Before you can execute any commands on the API; you need to initialize and seed some fake data into the database.

Fortunately, there's a `/seed` route for this!

_To test our API, we need a software called [Postman](https://www.postman.com/downloads/) or [Insomnia](https://insomnia.rest/), it will allow us to fire some queries on our endpoints._  

So launch Postman (or Insomnia) and execute the following requests:

**POST** `/seed/create`  
then  
**POST** `/seed`  

You should see `Database successfully created` for the first command and the seeded data for the second.

If at any point after playing around with the database you need a clean slate; you can run:  
**DELETE** `/seed/destroy`

This will drop all tables. You can then redo the creation and the seeding accordingly to start fresh.

![pic](readme/seed.png)

## Step 3: Make some queries

Now you can query the API :partying_face:

You could start by checking all the restaurants located in a city:  
**GET** `/city/4`  

![pic](readme/oneCity.png)

or 

You could get all the restaurants with their associated data (comments/tags/city) as such:  
**GET** `/restaurant`  

![pic](readme/allRestaurants.png)

You can control if you want to retrieve all the associated information for the restaurants by passing a JSON object in the body of your request:  

```JSON
{
    "comments": false,
    "tags": true
}
```

or  

You could search for all restaurants linked to a tag by sending the id of that tag:  
**GET** `/tag/7`  

![pic](readme/oneTag.png)

This is not an exhaustive list.  

You're encouraged to check the entities folder and check what you can do with the API! :nerd_face:
