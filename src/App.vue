<script setup>

import {computed, onMounted, reactive, ref} from "vue";
import {orderBy, upperFirst} from "lodash";
import Item from "./item.js";
import Export from "@/components/Export.vue";
import Import from "@/components/Import.vue";
import dayjs from "dayjs";

const items = reactive([]);
const newItem = ref('');
const sort = ref('due');

const nameSorter = (item) => item.name.toLowerCase();

const sortedItems = computed(() => {
    if (sort.value === 'due') {
        return orderBy(items, ['active', 'next', nameSorter], ['desc', 'asc', 'asc']);
    } else {
        return orderBy(items, ['active', nameSorter], ['desc', 'asc']);
    }
});

const createItem = () => {
    if (newItem.value.trim() === '') return;

    let item = items.find((item) => item.name.toLowerCase() === newItem.value.toLowerCase());

    if (item) {
        item.active = true;
    } else {
        item = new Item(newItem.value);
        items.push(item);
    }

    newItem.value = '';
    localStorage.setItem(item.key(), JSON.stringify(item));
};

const removeItem = (toRemove, event) => {
    event.stopPropagation();

    const index = items.findIndex((item) => item.name === toRemove.name);
    items.splice(index, 1);

    localStorage.removeItem(toRemove.key());
};

const toggleItem = (item) => {
    item.toggle();
    localStorage.setItem(item.key(), JSON.stringify(item));
}

const importItems = (newItems) => {
    for (name of newItems) {
        if (name.trim() === '') return;

        let item = items.find((item) => item.name.toLowerCase() === name.toLowerCase());

        if (item) {
            item.active = true;
        } else {
            item = new Item(name);
            items.push(item);
        }

        localStorage.setItem(item.key(), JSON.stringify(item));
    }
}

onMounted(() => {
    for (let key in localStorage) {
        if (key.includes('groceries-')) {
            items.push(Item.fromJson(localStorage.getItem(key)));
        }
    }
});

// toggle
// create
// remove

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

        <v-text-field label="What do you need?" v-model="newItem" @keyup.enter="createItem()" hide-details="auto"/>
        <v-list>
            <v-list-item v-for="item in sortedItems"
                         @click="toggleItem(item)">
                <div class="d-flex align-center">
                    <span class="flex-grow-1 ma-4" :class="{'text-decoration-line-through': !item.active}">
                        {{ upperFirst(item.name) }}
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
            <Import :items="sortedItems" @import="importItems"/>
            <Export :items="sortedItems"/>
        </div>

    </v-card>
</template>

<style scoped>

</style>
