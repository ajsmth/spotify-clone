import React from 'react';
import {api} from '../../services/api';
import {SafeAreaView, ScrollView, View, Text, Image} from '../shared/tailwind';
import {Link, useFocus} from '../../earhart';
import {useCategories} from '../../providers/spotify-providers';

function Categories() {
  const categories = useSearchCategories();
  const top = categories.slice(0, 4);
  const all = categories.slice(4);

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 px-4 bg-white">
        <View className="py-2">
          <Text className="text-lg font-semibold">Your top genres</Text>
        </View>

        <View className="flex-wrap flex-row">
          {top.map((category) => {
            return <CategoryItem key={category.id} category={category} />;
          })}
        </View>

        <View className="my-2">
          <Text className="text-lg font-semibold">Browse all</Text>
        </View>

        <View className="flex-wrap flex-row">
          {all.map((category) => {
            return <CategoryItem key={category.id} category={category} />;
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface ICategoryItem {
  category: ICategory;
}

function CategoryItem({category}: ICategoryItem) {
  return (
    <View className="w-1/3 h-full p-1" style={{aspectRatio: 1}}>
      <Link to={`/search/${category.id}`}>
        <View className="w-full h-full">
          <Image
            className="w-full h-full"
            source={{uri: category.icons[0]?.url}}
          />
          <View className="pb-2 absolute bottom-0 left-0 right-0">
            <Text className="text-center text-base font-semibold text-white">
              {category.name}
            </Text>
          </View>
        </View>
      </Link>
    </View>
  );
}

function useSearchCategories() {
  const update = useCategories((state) => state.update);

  const focused = useFocus();

  React.useEffect(() => {
    if (focused) {
      api.get(`/categories`).then((categories) => {
        update(categories);
      });
    }
  }, [focused]);

  const categories = useCategories((state) =>
    state.ids.map((id) => state.lookup[id]),
  );
  
  return categories;
}

export {Categories};
