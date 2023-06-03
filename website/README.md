# Readme Milestone 3

# Technical setup

In this folder, all the files needed to run the website are stored. The website is available at this [link](https://com-480-data-visualization.github.io/project-2023-rail-runners/). The data can be found in the <code>data</code> folder. They are stored in zip format, and get unzipped through a Github Action, in order for the website to access them. 

The website is built using HTML, CSS and JavaScript, and the libraries used are:
[D3.js](https://d3js.org/), [UIkit](https://getuikit.com/),[mapBox](https://www.mapbox.com/).

The <code>js</code> folder contains the JavaScript files, and the <code>media</code> folder contains the images used in the website. The <code>index.html</code> file is the main page of the website.

# Intended usage

The website is intended to be used by people who want to know about the delays in the Italian railway network. The main page of the website contains a map of Italy, with the railway network highlighted. The user can hover on a station to see the number of trains that pass through it, and the average delay of the trains passing there. Users can also filter the trains considered by day of the week and type of train, or they can search for a specific station. 

In the trains page instead, you can search for a specific station, visualize its path, average statistics about it, and detailed information for each station. 

Finally, in the statistics page, you can see the leaderboard of the best and worst trains and stations of Italy in terms of delay, and also a map with regional differences in the aggregate average delay. 

