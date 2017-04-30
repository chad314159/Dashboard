queue()
    .defer(d3.json, "/studentData/dashboard")
    .defer(d3.json, "static/geojson/us-states.json")
    .await(makeGraphs);

    function makeGraphs(error, projectsJson, statesJson) {
    	//Clean projectsJson data

    	var studentData = projectsJson;
    	var dateFormat = d3.time.format("%Y-%m-%d").parse;
      // var parseDate = d3.time.format("%Y").parse;

    	studentData.forEach(function(d) {
        // console.log(d["date_posted"]);
    		d["semester"]= dateFormat(d["semester"]);
        // console.log(Object.prototype.toString.call(d["semester"]) + " year");
        // d["semester"]= d3.time.year(d["semester"]).getFullYear();
        // console.log(d["semester"]);
    		d["salary"] = +d["salary"];
        d["count"] = +d["count"];
    	});


    	//Create a Crossfilter instance
    	var ndx = crossfilter(studentData);
      var all = ndx.groupAll();


    	//Define Dimensions
    	var dateDim = ndx.dimension(function(d) {
                                  return d["semester"]; });

    	var employerTypeDim = ndx.dimension(function(d) {
                                  return d["sector"]; });

    	var jobTypeDim = ndx.dimension(function(d) {
                                  return d["category"]; });
      //State dimension
    	var stateDim = ndx.dimension(function(d) {
                                  return d["state"]; });

      // //Count dimension
    	// var countDim = ndx.dimension(function(d) {
      //                             return d["count"]; });


    	//Calculate metrics
    	var numProjectsByDate = dateDim.group();
    	var numEmployersType = employerTypeDim.group();
    	var numJobsType = jobTypeDim.group();


      //For state map
    	var totalSalaryByState = stateDim.group().reduceSum(function(d) {
    		return d["salary"];
    	});

      var totalCountByState = stateDim.group().reduceSum(function(d) {
        return d["count"];
      });




// totalSalaryByState.top(1)[0].value;

      //this is for the average
      //returns each salary


    	var totalSalary = ndx.groupAll().reduceSum(function(d) {
                              return (d["salary"]);});

      var totalCounts = ndx.groupAll().reduceSum(function(d) {
                              return (d["count"]);});



      console.log("chaddy");

      var totalSalary1 = stateDim.group().reduce(reduceAdd, reduceRemove, reduceInitial);

      function reduceAdd(p, v) {
        ++p.count;
        p.total += v.salary;
        return p;
      }

      function reduceRemove(p, v) {
        --p.count;
        p.total -= v.value;
        return p;
      }

      function reduceInitial() {
        return {count: 0, total: 0};
      }


      var a = totalSalary1.top(100);
      a.forEach(function(d) {
        // console.log(d["date_posted"]);
        console.log(d.key, Math.round(d.value.total/d.value.count));

      });



    	var max_state = totalSalaryByState.top(1)[0].value;



    	//Define values (to be used in charts)
    	var minDate = new Date(dateDim.bottom(1)[0]["semester"]);
      console.log(Object.prototype.toString.call(minDate) + " chaddddy");

      // var extra = d3.time.format('%Y').parse(minDate);
      // console.log(extra);

    	var maxDate = new Date(dateDim.top(1)[0]["semester"]);



      minDate.setYear(minDate.getYear() - 1);
      maxDate.setYear(maxDate.getYear() + 1);





        //Charts
    	var timeChart = dc.barChart("#time-chart");
    	var jobTypeChart = dc.rowChart("#employer-type-row-chart");
    	var topJobChart = dc.rowChart("#job-type-row-chart");
    	var usChart = dc.geoChoroplethChart("#us-chart");



    	var numberAlumniND = dc.numberDisplay("#number-alumni-nd");
    	var totalSalaryND = dc.numberDisplay("#average-salary-nd");


      var formatxAxis = d3.format('');
      var format = d3.format("0000");

      var average = function(d) {
          console.log(d);
          var x =1
          if (d in dict){
            x=dict[d];
          }else{
            x=1;
          }
          return d/x;
      };

      var numAlumniTest=1;

    	numberAlumniND
    		.formatNumber(d3.format("d"))
    		.valueAccessor(function(d){
                          numAlumniTest=d;
                          return d; })
    		.group(all);


      //Average Salary in USD
    	totalSalaryND
    		.formatNumber(d3.format("d"))
    		.valueAccessor(function(d){
                          return d/numAlumniTest; })
    		.group(totalSalary)
    		.formatNumber(d3.format(".3s"));


      var number_of_bins = 8;
    	timeChart
    		.width(750)
    		.height(160)
    		.margins({top: 10, right: 50, bottom: 30, left: 50})
    		.dimension(dateDim)
    		.group(numProjectsByDate)
    		.x(d3.time.scale().domain([minDate, maxDate]))
        .xUnits(function(){return number_of_bins;})
        .xAxisPadding(22)
        .elasticX(true)
        .elasticY(true)
        .gap(0)
        .centerBar(true);

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
