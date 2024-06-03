const { Client } = require("pg");

// pg client
const client = new Client({
  connectionString:
    "postgres://postgres:password@localhost:5432/acme_reservations",
});

client.connect();

// Create tables
const createTables = async () => {
  try {
    await client.query(`
      DROP TABLE IF EXISTS reservations;
      DROP TABLE IF EXISTS customers;
      DROP TABLE IF EXISTS restaurants;
      
      CREATE TABLE customers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL
      );

      CREATE TABLE restaurants (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL
      );

      CREATE TABLE reservations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        date DATE NOT NULL,
        party_count INTEGER NOT NULL,
        restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
        customer_id UUID REFERENCES customers(id) NOT NULL
      );
    `);
    console.log("Tables created successfully.");
  } catch (err) {
    console.error("Error creating tables:", err);
  }
};

// Create a customer
const createCustomer = async (name) => {
  const result = await client.query(
    "INSERT INTO customers (name) VALUES ($1) RETURNING *",
    [name]
  );
  return result.rows[0];
};

// Create a restaurant
const createRestaurant = async (name) => {
  const result = await client.query(
    "INSERT INTO restaurants (name) VALUES ($1) RETURNING *",
    [name]
  );
  return result.rows[0];
};

// Fetch all customers
const fetchCustomers = async () => {
  const result = await client.query("SELECT * FROM customers");
  return result.rows;
};

// Fetch all restaurants
const fetchRestaurants = async () => {
  const result = await client.query("SELECT * FROM restaurants");
  return result.rows;
};

// Create a reservation
const createReservation = async (
  date,
  partyCount,
  restaurantId,
  customerId
) => {
  const result = await client.query(
    "INSERT INTO reservations (date, party_count, restaurant_id, customer_id) VALUES ($1, $2, $3, $4) RETURNING *",
    [date, partyCount, restaurantId, customerId]
  );
  return result.rows[0];
};

// Delete a reservation
const destroyReservation = async (id) => {
  await client.query("DELETE FROM reservations WHERE id = $1", [id]);
};

// Fetch all reservations
const fetchReservations = async () => {
  const result = await client.query("SELECT * FROM reservations");
  return result.rows;
};

module.exports = {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
  createReservation,
  destroyReservation,
};
