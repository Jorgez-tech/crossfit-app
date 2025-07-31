<template>
  <div>
    <h2>Records</h2>
    <ul>
      <li v-for="record in records" :key="record.id">{{ record.description }}</li>
    </ul>
  </div>
</template>

<script>
import api from '../services/api';
import { useRecordStore } from '../stores/main';

export default {
  name: 'RecordsList',
  setup() {
    const recordStore = useRecordStore();
    api.getRecords().then(res => {
      recordStore.setRecords(res.data);
    });
    return { records: recordStore.records };
  }
};
</script>
