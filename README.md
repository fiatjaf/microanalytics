## Microanalytics

This is your personal self-hosted simplistic web-analytics and event tracker that uses only a CouchDB instance, no other backend.

## Usage

Push this as a Design Document to some CouchDB provider ([Cloudant](https://cloudant.com/), [Couchappy](https://www.couchappy.com/), [Iriscouch](https://www.iriscouch.com/)), or your own CouchDB instance, then go to http://your-host.com/microanalytics/_design/microanalytics/_rewrite and get a tracking code and Javascript snippet to install in your website. Go there again to get a new tracking code, for another website.

The Javascript snippet will come with a call to `ma('pageView')`. This is not mandatory, but is the most basic event you may want to track. To track other events, just call `ma('event_name', '[value]')` anywhere.

After that, download our [Python command line client](https://github.com/fiatjaf/microanalytics-cli) and see your data.

## Important

* Everything has to be public by default. There is no way to change this, it's a CouchDB thing.
* It will be free to run this in any of the mentioned CouchDB providers, but only for low traffic. If you get a lot of traffic, then don't do it.

## To be implemented

* Restrict tracking events from the domains or pages you want, to prevent other people from using your Microanalytics instance.
