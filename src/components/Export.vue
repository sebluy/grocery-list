<script setup>

import {ref} from "vue";

const props = defineProps({
    items: Array,
});

const mode = ref('plain');

</script>

<template>
    <v-dialog max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" variant="text">Export</v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Export">
                <v-card-text>
                    <v-btn-toggle v-model="mode"
                                  class="mb-2" color="deep-purple" max-width="400" variant="outlined" mandatory>
                        <v-btn density="compact" size="x-small" value="plain">Plain</v-btn>
                        <v-btn density="compact" size="x-small" value="json">JSON</v-btn>
                    </v-btn-toggle>

                    <pre v-if="mode === 'json'">{{ JSON.stringify(items, null, 4) }}</pre>
                    <pre v-else>{{ items.map(i => i.name).join("\n") }}</pre>

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