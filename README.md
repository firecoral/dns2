# A Dynamic DNS updater written for Google Cloud DNS using Google Functions

## The Problem
I was migrating a zone on freedns to Google Cloud DNS.  (Although freedns was solid, I wanted more features and google offered them for less than $1/month).  Unfortunately I use a pfsense firewall and Google Cloud DNS doesn't have a builtin interface for dynamicDNS updates.

## The Solution
I wrote this script for Google Functions.  I used the @google-cloud/dns library for my Node.js development (since Google Functions uses Node and I wanted to take advantage of promises to keep the code clean).  My pfSense device can simply hit a URL with the appropriate change and my host and zone is updated.

## Brief Instructions
* Create a project and set up a Google Cloud DNS zone.
* Create a service account
* Create a storage bucket for the Google Function
* Generate a service key for this service account into keys.json
* Create a Google Cloud development environment somewhere
* Copy index.js and keys.json into a folder in that environment
* Run: npm install --save @google-cloud/dns
* Deploy the funtion: gcloud beta functions deploy dns2 --stage-bucket [YOUR_STAGING_BUCKET_NAME] --trigger-http
* The gcloud command should provide you with the url to your service.  See index.js for usage information.

Here are some instructions for using Google Functions: https://cloud.google.com/functions/docs/tutorials/http

## Licensing Information
I relinquish any copyrights or licenses that may have been created by writing and publishing this code.  I hope you find it useful.
