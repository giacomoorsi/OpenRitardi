# Data
This folder contains the data generation process for OpenRitardi. 

First, it contains a data wrangling procedure from the original source and a conversion of data into a more suitable format to be analyzed. Second, some preliminary data analysis and visualization are performed. Finally, there is a notebook that generates all the data for the website. 

Since the dataset is quite large (~15GB), we use [PySpark](https://spark.apache.org/docs/latest/api/python/) to manage computations. In order to be able to replicate the results, follow the istructions described [here](#dependencies). 

## Data 
The data used is taken from [TrainStats](https://trainstats.altervista.org), an independent platform that has been collecting data from Trenitalia for more than one year. They daily scrape [ViaggiaTreno](https://www.viaggiatreno.it), the official Trenitalia data source, and they store the data in a database. The data is made available on [TrainStats](https://trainstats.altervista.org) website and it can be downloaded at [this link](https://mega.nz/folder/vIAyDaTJ#PcLTFDbKaJaa0FZIEh5E-w). 

The data is organized in a set of daily `.json` files, where each file contains the data for a specific day. Each `.json` file contains a list of dictionaries, where each dictionary represents a train stop. 

## Notebooks
1. [Data Wrangling](data_wrangling.ipynb): this notebook contains the code to wrangle the data from the original source and to create the dataset used in the other notebooks. Specifically, it reads a set of daily `.json` files and it converts them to a single `.parquet` file, where each row represents a stop of a train in a specific station. 
2. [Data Exploration](data_exploration.ipynb): this notebook contains some preliminary data analysis and visualization. It also shows maps in Plotly, so we recommend to open it using [nbviewer](https://nbviewer.jupyter.org/).
3. [Data Generation](data_generation.ipynb): this notebook generates all the data for the visualizations of the website

### Dependencies
Create a new [conda](https://docs.conda.io/en/latest/) environment with the following command:
```bash
conda create -n OpenRitardi
```
Activate the environment:
```bash
conda activate OpenRitardi
```
Install the dependencies:
```bash
conda install -r requirements.txt
```