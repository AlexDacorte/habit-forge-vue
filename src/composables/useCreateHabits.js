import {ref, onMounted} from 'vue'
import { createHabits } from '@/utils/createHabits'

export function useCreateHabits() {
    const habits = ref([])
    const isLoading = ref(false)
    const error = ref(null)

}
