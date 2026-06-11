import {ref, onMounted} from 'vue'

export function useFetchHabits() {
    const habits = ref([])
    const isLoading = ref(true)
    const error = ref(null)

    
}