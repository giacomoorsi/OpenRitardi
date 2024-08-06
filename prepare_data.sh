# unzip all zip files in "dataset_generated" folder
mkdir -p website/dist/data
for file in data/dataset_generated/*.zip; do
unzip -o -j "$file" -d website/dist/data
done
# unzip all zip files in "dataset_generated/data_train_stat" folder
mkdir -p website/dist/data/trains
for file in data/dataset_generated/data_train_stat/*.zip; do
unzip -o -j "$file" -d website/dist/data/trains
done
# unzip all zip files in "dataset_generated/trains_shapes" folder
mkdir -p website/dist/data/trains_shapes
for file in data/dataset_generated/trains_shapes/*.zip; do
unzip -o -j "$file" -d website/dist/data/trains_shapes
done

# MORE EFFICIENT VERSION BELOW, BUT IT SEEMS IT'S NOT WORKING ON GITHUB PAGES
# unzip statistics on stops
# mkdir -p website/dist/data
# unzip -o -j "data/dataset_generated/data_stop_region.zip" -d website/dist/data
# unzip -o -j "data/dataset_generated/data_stop.zip" -d website/dist/data

# # unzip statistics on trains
# unzip -o -j "data/dataset_generated/data_train_index.zip" -d website/dist/data
# mkdir -p website/dist/data/trains
# unzip -o -j "data/dataset_generated/data_train_stat/data_train_stat.zip" -d website/dist/data/trains

# # unzip train shapes
# mkdir -p website/dist/data/trains_shapes
# unzip -o -j "data/dataset_generated/trains_shapes.zip" -d website/dist/data/trains_shapes