#### Heinz Dashboard Prototype
## Getting started

1. The data for this prototype is proprietary and belongs to Heinz College
Career Services Office. Therefore, the data has not been uploaded and one will
need to contact Heinz College for more information. For visualizations other than the dashboard,
the data has been generated for the prototype and do not reflect actual Heinz College data.

2. Once you do obtain the required data,  The dependencies for the project can be installed using

    $ pip install -r requirements.txt

3. The user will also need to have an instance of MongoDB. Once it is installed, you can easily
import it by:

    $ mongoimport -d studentdata -c dashboard --type csv --file dashboard_data -headerline

4. The Dendrogram visualization for this prototype was based upon Mike Bostick's
d3 visualization page. Various other visualizations, some which inspired visualizations within
this prototype can be accessed at: https://bl.ocks.org/mbostock. Scripts are free and open to be used.

5. For the network graph chart, we credit Stephen A. Thomas for his idea of creating a network with
ITunes music data. It can be accessed here: http://jsdatav.is/visuals.html


6. The tutorial for the dashboard was based from Adil Moujahid. Many of his other visualization tutorials
can be accessed at his tutorial blog:http://adilmoujahid.com/posts/2016/08/interactive-data-visualization-geospatial-d3-dc-leaflet-python/
