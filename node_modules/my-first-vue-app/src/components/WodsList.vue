<template>
  <div>
    <h2>WODs</h2>
    <ul>
      <li v-for="wod in wods" :key="wod.id">{{ wod.name }}</li>
    </ul>
  </div>
</template>

<script>
import api from '../services/api';
import { useWodStore } from '../stores/main';

export default {
  name: 'WodsList',
  setup() {
    const wodStore = useWodStore();
    api.getWods().then(res => {
      wodStore.setWods(res.data.data);
    });
    return { wods: wodStore.wods };
  }
};
</script>
