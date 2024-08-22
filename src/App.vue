<script setup>

import {computed, onMounted, reactive, ref} from "vue";
import {orderBy} from "lodash";
import Item from "./item.js";
import {faCalendar, faTrash} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import dayjs from "dayjs";

const items = reactive([]);

const newItem = ref('');
const sort = ref('due');

const sortedByActive = computed(() => {
    if (sort.value === 'due') {
        return orderBy(items, ['active', 'next', 'name'], ['desc', 'asc', 'asc']);
    } else {
        return orderBy(items, ['active', 'name', 'name'], ['desc', 'asc', 'asc']);
    }
});

const createItem = () => {
    let item = items.find((item) => item.name.toLowerCase() === newItem.value.toLowerCase());

    if (item) {
        item.active = true;
    } else {
        item = new Item(newItem.value);
        items.push(item);
        newItem.value = '';
    }

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

onMounted(() => {
    for (let key in localStorage) {
        if (key.includes('groceries-')) {
            items.push(Item.fromJson(localStorage.getItem(key)));
        }
    }

    items.push(new Item('testy', [
        dayjs('2024-08-07'),
        dayjs('2024-08-15'),
    ]))
})

// toggle
// create
// remove

</script>

<template>
    <div class="container">
        <div class="row">
            <div class="col-md-4 offset-md-4">
                <h3 class="text-center mb-2 mt-4">Groceries</h3>

                <div class="d-flex justify-content-center m-2">
                    <input type="radio" class="btn-check" name="sort" id="sort-due" autocomplete="off"
                           v-model="sort" value="due">
                    <label class="btn btn-outline-success m-1" for="sort-due">Due</label>

                    <input type="radio" class="btn-check" name="sort" id="sort-az" autocomplete="off"
                           v-model="sort" value="az">
                    <label class="btn btn-outline-success m-1" for="sort-az">A-Z</label>
                </div>

                <div class="input-group mb-1">
                    <input class="form-control" type="text" placeholder="What do you need?"
                           v-model="newItem" @keyup.enter="createItem()"/>
                </div>
                <div class="list-group">
                    <div v-for="item in sortedByActive"
                            @click="toggleItem(item)"
                            class="list-group-item list-group-item-action">
                        <div class="d-flex">
                            <span class="flex-grow-1" :class="{'text-decoration-line-through': !item.active}">
                                {{ item.name }}
                            </span>
                            <span v-if="!item.active && item.next" class="badge rounded-pill bg-info text-dark pt-2 me-1">
                                <FontAwesomeIcon :icon="faCalendar"/>
                                {{ item.next }}
                            </span>
                            <button class="btn btn-danger btn-sm" @click="(e) => removeItem(item, e)">
                                <FontAwesomeIcon :icon="faTrash"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
