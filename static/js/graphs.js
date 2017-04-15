queue()
    .defer(d3.json, "/studentData/dashboard")
    .defer(d3.json, "static/geojson/us-states.json")
    .await(makeGraphs);

    function makeGraphs(error, projectsJson, statesJson) {
    	//Clean projectsJson data

    	var studentData = projectsJson;
      console.log(studentData);
    	var dateFormat = d3.time.format("%Y-%m-%d").parse;
      // var parseDate = d3.time.format("%Y").parse;

    	studentData.forEach(function(d) {
        // console.log(d["date_posted"]);
    		d["semester"]= dateFormat(d["semester"]);
        console.log(d["semester"]);
        d["semester"]= d3.time.year(d["semester"]).getFullYear();
    		d["salary"] = +d["salary"];

    	});

    	//Create a Crossfilter instance
    	var ndx = crossfilter(studentData);

    	//Define Dimensions
    	var dateDim = ndx.dimension(function(d) {
                                  return d["semester"]; });
    	var employerTypeDim = ndx.dimension(function(d) { return d["sector"]; });
    	var jobTypeDim = ndx.dimension(function(d) { return d["category"]; });
    	var stateDim = ndx.dimension(function(d) { return d["state"]; });
    	var totalSalaryDim  = ndx.dimension(function(d) { return d["salary"]; });



    	//Calculate metrics
    	var numProjectsByDate = dateDim.group();
    	var numEmployersType = employerTypeDim.group();
    	var numJobsType = jobTypeDim.group();
    	var totalSalaryByState = stateDim.group().reduceSum(function(d) {
    		return d["salary"];
    	});

    	var all = ndx.groupAll();

    	var totalSalary = ndx.groupAll().reduceSum(function(d) {return d["salary"];});

    	var max_state = totalSalaryByState.top(1)[0].value;

      console.log("CHAD" + max_state);
    	//Define values (to be used in charts)
    	var minDate = dateDim.bottom(1)[0]["semester"];

    	var maxDate = dateDim.top(1)[0]["semester"];
        //Charts
    	var timeChart = dc.barChart("#time-chart");
    	var jobTypeChart = dc.rowChart("#employer-type-row-chart");
    	var topJobChart = dc.rowChart("#job-type-row-chart");
    	var usChart = dc.geoChoroplethChart("#us-chart");
    	var numberAlumniND = dc.numberDisplay("#number-alumni-nd");
    	var totalSalaryND = dc.numberDisplay("#average-salary-nd");

      var formatxAxis = d3.format('');
      var format = d3.format("0000");

      var domain12 = d3.time.scale().domain([minDate,maxDate]);
      var dictionary1 = {};


    	numberAlumniND
    		.formatNumber(d3.format("d"))
    		.valueAccessor(function(d){
          return d; })

    		.group(all);

    	totalSalaryND
    		.formatNumber(d3.format("d"))
    		.valueAccessor(function(d){return d; })
    		.group(totalSalary)
    		.formatNumber(d3.format(".3s"));

    	timeChart
    		.width(600)
    		.height(160)

    		.margins({top: 10, right: 50, bottom: 30, left: 50})
    		.dimension(dateDim)
    		.group(numProjectsByDate)
    		.x(d3.time.scale().domain([String(minDate), maxDate]))

    		.elasticY(true)
    		.xAxisLabel("Count")
    		.yAxis().ticks(3);


        //top employer
    	jobTypeChart
            .width(300)
            .height(250)
            .dimension(employerTypeDim)
            .group(numEmployersType)
            .xAxis().ticks(4);

      //TOP JOB
    	topJobChart
    		.width(300)
    		.height(250)
            .dimension(jobTypeDim)
            .group(numJobsType)
            .xAxis().ticks(4);



    	usChart.width(1000)
    		.height(330)
    		.dimension(stateDim)
    		.group(totalSalaryByState)
    		.colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"])
    		.colorDomain([0, max_state])
    		.overlayGeoJson(statesJson["features"], "state", function (d) {
    			return d.properties.name;
    		})
    		.projection(d3.geo.albersUsa()
        				.scale(600)
        				.translate([340, 150]))
    		.title(function (p) {
    			return "State: " + p["key"];
    		})

        dc.renderAll();

    };
