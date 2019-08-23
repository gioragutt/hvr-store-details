# What is this project?

- The purpose of this project is to collect a list of all stores that work with the yellow giftcard of Hever (״חבר״ של חבר).

- The collected data can then be used to show the stores on a map, and allow easy search for stores that fit your needs.

# How to run?

- Copy `.env.example` to `.env`, and change `TZ` and `PASSWORD` to your hever username and password. This is required to log in to the site to collect the data.
- `npm install`
- `npm start`

# Output

Aside from the small output amount of stores per cagegory, the program output the data as a json file to: `/tmp/hvr-store-details.json`.

# Roadmap

Also collect the stores that work with the blue, hvr teamim (״חבר טעמים״) card
