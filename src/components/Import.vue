<script setup>

import {ref} from "vue";

const emit = defineEmits(['import']);

const text = ref('');

const importItems = (isActive) => {
    isActive.value = false;
    emit('import', text.value.split("\n"));
};

</script>

<template>
    <v-dialog max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" variant="text">Import</v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Import" subtitle="Enter a list of items seperated by newlines">
                <v-card-text>
                    <v-textarea v-model="text"/>
                </v-card-text>

                <v-card-actions>
                    <v-btn text="Close" @click="isActive.value = false"></v-btn>
                    <v-btn text="Import" @click="importItems(isActive)"></v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<style scoped>

</style>