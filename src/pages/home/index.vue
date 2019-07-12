<template>
    <div>
        <router-view></router-view>
        <TotalStatus/>
    </div>
</template>

<script>
import TotalStatus from './component/total-status'

export default {
    data() {
        return {}
    },
    mounted() {

    },
    components: {
        TotalStatus
    }
}
</script>
