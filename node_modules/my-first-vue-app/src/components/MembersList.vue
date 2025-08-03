<template>
  <div>
    <h2>Members</h2>
    <ul>
      <li v-for="member in members" :key="member.id">{{ member.name }}</li>
    </ul>
  </div>
</template>

<script>
import api from '../services/api';
import { useMemberStore } from '../stores/main';

export default {
  name: 'MembersList',
  setup() {
    const memberStore = useMemberStore();
    api.getMembers().then(res => {
      memberStore.setMembers(res.data.data);
    });
    return { members: memberStore.members };
  }
};
</script>
