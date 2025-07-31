import { defineStore } from 'pinia';

export const useWodStore = defineStore('wod', {
    state: () => ({
        wods: []
    }),
    actions: {
        setWods(wods) {
            this.wods = wods;
        }
    }
});

export const useMemberStore = defineStore('member', {
    state: () => ({
        members: []
    }),
    actions: {
        setMembers(members) {
            this.members = members;
        }
    }
});

export const useRecordStore = defineStore('record', {
    state: () => ({
        records: []
    }),
    actions: {
        setRecords(records) {
            this.records = records;
        }
    }
});
