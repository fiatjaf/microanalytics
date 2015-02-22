## Microanalytics

This is your personal self-hosted simplistic web-analytics and event tracker that uses only a CouchDB instance, no other backend.

## Installation

Push this as a Design Document to some CouchDB provider ([Cloudant](https://cloudant.com/), [Smileupps](https://www.smileupps.com/), [Iriscouch](https://www.iriscouch.com/)), or your own CouchDB instance, then go to `http://your-host.com/microanalytics/_design/microanalytics/_rewrite` and get a tracking code and Javascript snippet to install in your website. Go there again to get a new tracking code, for another website.

### To push

Clone this repository and push it with [couchapp](https://github.com/couchapp/couchapp):

```
git clone https://github.com/fiatjaf/microanalytics
sudo pip install couchapp
cd microanalytics
npm install
npm run build
couchapp push YOUR_COUCHDB_DATABASE_URL # (with basic auth)
```

### To replicate

Tell your CouchDB server to create a new database and replicate from `http://microanalytics.smileupps.com/`.

### Observation:

If you're deploying to Cloudant you'll need to compile the Coffeescript code to Javascript first (normal CouchDB supports Coffeescript in raw format, Cloudant doesn't).

## Usage

The Javascript snippet will come with a call to `ma('pageView')`. It is not mandatory to have it, but is the most basic event you may want to track and the basis of unique session count. To track other events, just call `ma('event_name', '[value]')` anywhere.

After that, download our [Python command line client](https://github.com/fiatjaf/microanalytics-cli) to visualize, analytics and play with your data.

## Important

* Everything has to be public by default. There is no way to change this, it's a CouchDB thing.
* Microanalytics generates one POST event for each event, so if you're using one of these free providers for some other big thing and your websites have a lot of traffic, it may be worth looking closely on the usage, but in all cases it should work well. Cloudant and Smileupps both provide a lot of free quota for you to use.

## To be implemented

* Restrict tracking events from the domains or pages you want, to prevent other people from using your Microanalytics instance.
