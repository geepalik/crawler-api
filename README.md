# Crawler API
Needs Docker installed to run

Clone repository in target path
-----

    git clone https://github.com/geepalik/crawler-api.git

Rename .env.example to .env
-----

    .env

Run Docker containers
-----
In the project root directory run this to create containers and run them in background:
-----
    docker-compose up -d --build 

Requests
-----
The main URL for requests is this:
-----
    http://localhost:8081/crawler-api/


Crawl a domain (POST):

    http://localhost:8081/crawler-api/crawl

In request body, add a url:

{
    "url": "https://www.mobilda.com/"
}

It will return the document in the collection crawlingData

Get all crawl data (GET):
    
    http://localhost:8081/crawler-api/crawling-data/

It will return an array of all records in collection crawlingData

Get crawling data for a specific URL saved in the database (GET):
    
    localhost:8081/crawler-api/crawling-data/https%3A%2F%2Fmobilda.com%2F

It will return data for the url passed in the params (must have been encoded in client with encodeURIComponent())
If it's an unknown URL that has not been crawled by the system, a 404 response will be returned instead.