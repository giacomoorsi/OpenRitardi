# unzip statistics on stops
mkdir -p website/dist/data
unzip -o -j "data/dataset_generated/data_stop_region.zip" -d website/dist/data
unzip -o -j "data/dataset_generated/data_stop.zip" -d website/dist/data

# unzip statistics on trains
unzip -o -j "data/dataset_generated/data_train_index.zip" -d website/dist/data
mkdir -p website/dist/data/trains
unzip -o -j "data/dataset_generated/data_train_stat/data_train_stat.zip" -d website/dist/data/trains

# unzip train shapes
mkdir -p website/dist/data/trains_shapes
unzip -o -j "data/dataset_generated/trains_shapes.zip" -d website/dist/data/trains_shapes
