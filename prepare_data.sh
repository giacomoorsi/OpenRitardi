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