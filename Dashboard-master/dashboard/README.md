## Getting started

The dependencies for the project can be installed using

    $ pip install -r requirements.txt


To initialize the database you need to obtain data the Heinz team has

and import it

    $ mongoimport -d studentdata -c dashboard --type csv --file dashboard_data -headerline
