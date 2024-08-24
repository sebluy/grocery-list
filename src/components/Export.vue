<script setup>

import {defineProps} from 'vue';

const props = defineProps({
    items: Array,
});

</script>

<template>
    <v-dialog max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" variant="text">Export</v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Export">
                <v-card-text>
                    <div v-for="item in items">
                        {{ item.name }}
                    </div>
                </v-card-text>

                <v-card-actions>
                    <v-btn text="Close" @click="isActive.value = false"></v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<style scoped>

</style>