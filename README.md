# OpenRitardi
The motivation for this project comes from the crucial lack of open data regarding public transportation in Italy: differently from what happens in other European countries, there is no public database curating these data nationally and releasing them in an aggregate form. Transportation is unfortunately not an exception, since Italy ranks 32nd in the global rankings of the [Open Data Index](http://index.okfn.org/place/), with major shortcomings in other key categories. A first effort in independently collecting a dataset of that kind has been carried on by [TrainStats](https://trainstats.altervista.org/), but the data is currently presented in a form very close to raw: the website only shows basic aggregate statistics and visualizations, and only at the level of a single day or a single train. In addition, the UI is very minimal, and it is not easy to navigate the website nor to quickly gain insights or general trends. In other words, these data are currently readable by engineers, who know how to approach and process them, but not by everyone else. The goal of this project is to fill this gap, by making them available to the general population in a simple and intuitive manner. On one side, this would be a service to the community, improving the information currently available and helping people in planning a more informed trip schedule. On the other, it would improve public accountability, pushing Trenitalia to improve its rail system to decrease delays and malfunctions.

# Website
The website is available at [openritardi.it](https://openritardi.it)

# OpenRitardi datasets
We publish tutorials on how to use OpenRitardi data and replicate our analysis. We welcome contribution with new processing ideas and visualization. You can find more information [on this page](data.md) ([here](data.pdf) in pdf).

# Contribution
Contribution is welcome! Please use the [Roadmap](https://github.com/giacomoorsi/OpenRitardi/issues/1) to suggest new features, feel free to open new issues. We will credit you on the [About](https://www.openritardi.it/about.html) page on the website.

### Setup
#### Website
The website is stored on GitHub pages. The data for stations and train delays is currently stored in this repository in zip archives in the `data/dataset_generated` folder. 
The GitHub action that prepares the website unzips all files and stores them in the `website/data` folder.  

#### Data
If you develop locally, you can clone the folder and run the following Bash command 
```bash
$ bash prepare_data.sh
```
to unzip all datasets locally.

The [data](data) folder contains all the procedures to download and process all data of Italian trains. 

#### Development environment
Once you have unzipped the data using the script above, you can run a local server to do your experiments. Feel free to use whatever local server. 
A good possibilty is to use Visual Studio Code with the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extention enabled. You can easily launch a live server which points to the `website/dist` folder and you can access the preview of the website from `localhost` and the port given by Live Server, in your favorite browser. 

#### Website development
You can statically compile the website with the following commands 
```
cd website
npm install
npm run build
```
The folder `dist` is the entrypoint of the website. 

### Pull requests
Feel free to submit pull requests. Please document your code in English and write a PR description. **Test** your code before submitting a PR and after implementing PR comments as it will most likely not be tested by the reviewers!
