# unzip all zip files in "dataset_generated" folder
mkdir -p website/data
for file in data/dataset_generated/*.zip; do
unzip -o -j "$file" -d website/data
done
# unzip all zip files in "dataset_generated/data_train_stat" folder
mkdir -p website/data/trains
for file in data/dataset_generated/data_train_stat/*.zip; do
unzip -o -j "$file" -d website/data/trains
done
# unzip all zip files in "dataset_generated/trains_shapes" folder
mkdir -p website/data/trains_shapes
for file in data/dataset_generated/trains_shapes/*.zip; do
unzip -o -j "$file" -d website/data/trains_shapes
done