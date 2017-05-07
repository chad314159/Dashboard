#### Heinz Dashboard Prototype
## Getting started

1. The data for this prototype is proprietary and belongs to Heinz College
Career Services Office. Therefore, the data has not been uploaded and one will
need to contact Heinz College for more information.

2. Once you do obtain the required data,  The dependencies for the project can be installed using

    $ pip install -r requirements.txt

3. The user will also need to have an instance of MongoDB. Once it is installed, you can easily
import it by

    $ mongoimport -d studentdata -c dashboard --type csv --file dashboard_data -headerline
