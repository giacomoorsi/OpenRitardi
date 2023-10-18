let colormap = d3.scaleLinear()
    .domain([-10, 0, 3, 7, 100])
    .range(['#10ad0a', '#10ad0a', '#f7f414', '#e81710', '#e81710']);


/**
 * Given a delay in float format, returns a string that shows the minutes and seconds, example: 5.5 is converted to 5' 30'' (5 minutes, 30 seconds)
 */
function generateDelayString(delay) {
    let minutes = Math.floor(delay);
    let seconds = Math.round((delay - minutes) * 60);
    if (seconds == 0) {
        return minutes + "'";
    } else {
        return minutes + "' " + seconds + "''";
    }
}

var train_data = []


function trainClassToImage(train_class) {
    if (train_class == "IC") {
        image = "/media/intercity.svg width='130px'";
    } else if (train_class == "ICN") {
        image = "/media/intercity_notte.svg width='130px'";
    } else if (train_class == "REG") {
        image = "/media/RE.svg width='60px'";
    } else if (train_class == "EC") {
        image = "/media/EC.svg width='60px'";
    } else if (train_class == "FR") {
        image = "/media/frecciarossa.svg width='130px'";
    } else if (train_class == "FB") {
        image = "/media/frecciabianca.svg width='130px'";
    } else if (train_class == "FA") {
        image = "/media/frecciargento.svg width='130px'";
    }
    else image = "/media/logo/favicon.png";
    return image;
}


function displayTrainInformation(trainID) {
    /**
     * The function is called when the user clicks on a train in the dropdown menu.
     */

    // hide the dropdown 
    UIkit.dropdown(search_options_dropdown_id).hide(false);

    // get from dataset the train with the given ID
    let train_summary = dataset_dropdown.filter(function (train) {
        return train['train_id'] == trainID;
    })[0];

    let searched_train_info_div = document.getElementById('searched_train_info_div');

    // compute the average delay at each stop

    content = `<div class="uk-card uk-card-default uk-card-body">
        <h2><span id="train_name_label"><img src=${trainClassToImage(train_summary["train_class"])}>${' ' + train_summary['train_number']}</span></h2>
        <p class="uk-text-lead" id="train_description_label">${train_summary['train_departure_stop_name']} <span uk-icon="arrow-right"></span> ${train_summary['train_arrival_stop_name']}</p>

        <div class="uk-child-width-1-2@s uk-grid-match uk-margin-large" uk-grid>
            <div>
                <div class="uk-text-center uk-card uk-card-default uk-card-body">
                    <span class="uk-h1 uk-margin-small" style="color: ${colormap(train_summary['avg_arrival_delay'])}">${generateDelayString(train_summary['avg_arrival_delay'])}</span>
                    <div class="uk-h4 uk-margin-small">Average delay per stop</div>
                </div>
            </div>
            <div>
                <div class="uk-text-center uk-card uk-card-default uk-card-body"
                    uk-tooltip="A train is considered delayed if it arrives with a delay higher than 5'. This shows on average, at every stop, how many times it is delayed">
                    <span class="uk-h1" id="train_perc_delayed_label">${Math.round(train_summary['perc_5m_delay'])}%</span>
                    <div class="uk-h4 uk-margin-small">% trains delayed</div>
                </div>
            </div>
        </div>
    </div>`



    searched_train_info_div.innerHTML = content;

    // get the dataset of the train
    let train_dataset = d3.csv('/data/trains/' + trainID + '.csv').then(function (data) {
        return data
    });

    // when ready
    train_dataset.then(function (data) {
        train_data = data;
        showStopsStatisticsHistogram(data);
        showStopsStatisticsDropdown(data);

    });

    let train_shapes = d3.csv('/data/trains_shapes/' + trainID + '.csv').then(function (data) {
        return data
    });

    train_shapes.then(function (data) {
        plotLines(data);
    });

}





/**
 * Shows an histogram with the delays at each stop
 * using d3.js
 */
function showStopsStatisticsHistogram(train_data) {
    let container = document.getElementById('histogram_container');

    d3.select("#histogram_container svg").remove();
    d3.select("#histogram_container div").remove();

    // set the dimensions and margins of the graph
    let margin = { top: 30, right: 30, bottom: 130, left: 60 },
        width = 500 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;


    // append the svg object to the body of the page
    let svg = d3.select("#histogram_container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        // center
        .style("margin-left", "auto")
        .style("margin-right", "auto")
        .style("display", "block")
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // X axis
    let x = d3.scaleBand()
        .range([0, width])
        .domain(train_data.map(function (d) { return d.stop_name; }))
        .padding(0.2);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end")

    // Add Y axis

    max_delay = d3.max(train_data, function (d) { return Number(d.avg_arrival_delay); })
    min_delay = d3.min(train_data, function (d) { return Number(d.avg_arrival_delay); })
    min_delay = Math.min(min_delay, 0)

    let y = d3.scaleLinear()
        .domain([min_delay, max_delay + 1])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));


    var Tooltip = d3.select("#histogram_container")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .attr("z-index", "10000000000")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")

    var mouseover = function(d) {
        Tooltip
            .style("opacity", 1)
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
    }
    var mousemove = function(d) {
        train = d.target.__data__
        output = '<div class="uk-text-lead" style="width: 250px">'
        output += '<span style="text-align:center"><b>' + train.stop_name 
               +  "</b></span><br/>" + "Number of trains: " + train.count_dates_train 
               + "<br/>" + "Avg Arrival Delay: <span style='color: " + colormap(train.avg_arrival_delay) + "'>" + Math.round(train.avg_arrival_delay * 10) / 10 + " min</span>"
        output += "</div>"
        Tooltip
            .html(output)
            .style("left", (d3.pointer(d, this)[0]+70) + "px")
            .style("top", (d3.pointer(d, this)[1]) + "px")
    }
    var mouseleave = function(d) {
        Tooltip
            .style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8)
    }
    // Bars
    svg.selectAll("mybar")
        .data(train_data)
        .enter()
        .append("rect")
        .attr("x", function (d) { return x(d.stop_name); })
        .attr("width", x.bandwidth())
        .attr("fill", function (d) { return colormap(d.avg_arrival_delay); })
        // no bar at the beginning thus:
        .attr("height", function (d) { return height - y(0); }) // always equal to 0
        .attr("y", function (d) { return y(0); })
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .on("click", function (d) {
            document.getElementById('dropdown_stop').value=d.target.__data__.stop_number-1;
            updateDropdown(d.target.__data__.stop_number-1);
        });


    // Animation
    svg.selectAll("rect")
        .transition()
        .duration(800)
        .attr("y", function (d) { return y(d.avg_arrival_delay); })
        .attr("height", function (d) { return height - y(d.avg_arrival_delay); })
        .delay(function (d, i) { return (i * 100) })

    // label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Average delay");

    // make font size of axis labels larger
    svg.selectAll("text")
        .style("font-size", "12px");

}


/**
 * Shows a dropdown with statistics at each stop
 */
function showStopsStatisticsDropdown(train_data) {

    let dropdown = document.getElementById('dropdown_stop');

    // remove all entries from dropdown
    dropdown.innerHTML = '';
    // add one entry per stop, if selected show statistics
    for (let i = 0; i < train_data.length; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.innerHTML = train_data[i]['stop_name'];
        dropdown.appendChild(option);
    }

    // when a stop is selected
    dropdown.onchange = function () {
        updateDropdown(dropdown.value);
    }

    // select first stop
    dropdown.value = 0;
    updateDropdown(0);

}

function updateDropdown(index) {
    let stop_data = train_data[index];

    let stop_statistics_div = document.getElementById('stop_statistics_container');

    let perc_3m_delay = Math.round(stop_data['count_3m_delay'] / stop_data['count_dates_stop'] * 100);
    let perc_5m_delay = Math.round(stop_data['count_5m_delay'] / stop_data['count_dates_stop'] * 100);
    let perc_10m_delay = Math.round(stop_data['count_10m_delay'] / stop_data['count_dates_stop'] * 100);

    content = `
    <div class="uk-child-width-1-2@s uk-grid-match uk-margin-small uk-grid-small" uk-grid>
        <div>
            <div class="uk-text-center uk-card uk-card-default uk-card-body"
                >
                <span class="uk-h1 uk-margin-small" style="color: ${colormap(stop_data["avg_arrival_delay"])}">${generateDelayString(stop_data["avg_arrival_delay"])}</span>
                <div class="uk-h4 uk-margin-small">Average delay</div>
            </div>
        </div>

        <div>
            <div class="uk-text-center uk-card uk-card-default uk-card-body"
                uk-tooltip="Half of the trains arrive with a lower delay than this">
                <span class="uk-h1 uk-margin-small" style="color: ${colormap(stop_data["median_arrival_delay"])}">${generateDelayString(stop_data["median_arrival_delay"])}</span>
                <div class="uk-h4 uk-margin-small">Median delay</div>
            </div>
        </div>
    </div>
    <div class="uk-child-width-1-3@s uk-grid-match uk-margin-small uk-grid-small" uk-grid>

        <div>
            <div class="uk-text-center uk-card uk-card-default uk-card-body"
                uk-tooltip="Percentage of trains delayed more than 3' at this stop">
                <span class="uk-h1 uk-margin-small">${perc_3m_delay}%</span>
                <div class="uk-h4 uk-margin-small">> 3' delay</div>
            </div>
        </div>
        <div>
            <div class="uk-text-center uk-card uk-card-default uk-card-body"
                uk-tooltip="Percentage of trains delayed more than 5' at this stop">
                <span class="uk-h1">${perc_5m_delay}%</span>
                <div class="uk-h4 uk-margin-small">> 5' delay</div>
            </div>
        </div>
        <div>
            <div class="uk-text-center uk-card uk-card-default uk-card-body"
                uk-tooltip="Percentage of trains delayed more than 10' at this stop">
                <span class="uk-h1">${perc_10m_delay}%</span>
                <div class="uk-h4 uk-margin-small">> 10' delay</div>
            </div>
        </div>
    </div>
    `;

    stop_statistics_div.innerHTML = content;
}