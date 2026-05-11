<script setup>

import {computed, onMounted, reactive, ref} from "vue";
import {orderBy, toLower} from "lodash";
import Item from "./item.js";
import Export from "@/components/Export.vue";
import Import from "@/components/Import.vue";

const items = reactive([]);
const searchText = ref('');
const sort = ref('due');

const keySorter = (item) => item.key

const processedItems = computed(() => {
    const filtered = items.filter((item) => item.key.includes(searchText.value))

    if (sort.value === 'due') {
        return orderBy(filtered, ['active', 'next', keySorter], ['desc', 'asc', 'asc']);
    } else {
        return orderBy(filtered, ['active', keySorter], ['desc', 'asc']);
    }
});

const createItem = () => {
    const newItem = searchText.value;

    if (newItem.trim() === '') return;

    let item = items.find((item) => item.key === toLower(newItem));

    if (item) {
        item.active = true;
    } else {
        item = new Item(newItem);
        items.push(item);
    }

    searchText.value = '';
    localStorage.setItem(item.storageKey(), JSON.stringify(item));
};

const removeItem = (toRemove, event) => {
    event.stopPropagation();
    searchText.value = ''

    const index = items.findIndex((item) => item.key === toRemove.key);
    items.splice(index, 1);

    localStorage.removeItem(toRemove.storageKey());
};

const toggleItem = (item) => {
    searchText.value = ''
    item.toggle();
    localStorage.setItem(item.storageKey(), JSON.stringify(item));
}

const importItems = (newItems) => {
    for (let name of newItems) {
        if (name.trim() === '') return;

        let item = items.find((item) => item.key === toLower(name));

        if (item) {
            item.active = true;
        } else {
            item = new Item(name);
            items.push(item);
        }

        localStorage.setItem(item.storageKey(), JSON.stringify(item));
    }
}

onMounted(() => {
    for (let key in localStorage) {
        if (key.includes('groceries-')) {
            items.push(Item.fromJson(localStorage.getItem(key)));
        }
    }
});

</script>

<template>
    <v-card class="mx-auto" max-width="400">
        <h3 class="text-center mb-4 mt-4">Groceries</h3>

        <div class="d-flex justify-center mb-2 mt-2">
            <v-btn-toggle v-model="sort" color="deep-purple"
                          class="mx-auto" max-width="400" variant="outlined" mandatory>
                <v-btn value="due">Due</v-btn>
                <v-btn value="az">A-Z</v-btn>
            </v-btn-toggle>
        </div>

        <v-text-field label="What do you need?" v-model="searchText" @keyup.enter="createItem()" hide-details="auto"/>
        <v-list>
            <v-list-item v-for="item in processedItems"
                         @click="toggleItem(item)">
                <div class="d-flex align-center">
                    <span class="flex-grow-1 ma-4" :class="{'text-decoration-line-through': !item.active}">
                        {{ item.name() }}
                    </span>
                    <v-badge class="ma-4" v-if="!item.active && item.next" :content="item.next" color="deep-purple">
                        <v-icon icon="mdi-calendar"/>
                    </v-badge>
                    <v-btn color="red-darken-4 ml-2" density="comfortable" icon="mdi-delete"
                           @click="(e) => removeItem(item, e)"/>
                </div>
            </v-list-item>
        </v-list>

        <div class="d-flex justify-center mb-2">
            <Import @import="importItems"/>
            <Export :items="items"/>
        </div>

    </v-card>
</template>

<style scoped>

</style>
