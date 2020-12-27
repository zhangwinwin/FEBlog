<template>
    <div class="alarm-realtime" :id="`rt${alarmItem.id}`" :style="{top: topCount}">
        <div class="alarmList">
            <div class="alarmList-item flex" :class="showDialog ? 'show' : 'disappear'">
                <img src="" alt="" class="normal">
                <div class="info">
                    <div class="type flex">
                        <p class="typeName">智能报警</p>
                        <div class="checkBtn">查看</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'alarm-realtime',
    data () {
        return {
            topCount: '72px'
        };
    },
    filters: {
        similarityClass (val) {
            if (val >= 90) {
                return 'similarityBest';
            } else if (val >= 80 && val < 90) {
                return 'similarityBetter';
            } else {
                return 'similarityGood';
            }
        }
    },
    computed: {
        currentCheckAlarmIdList () {
            return this.$store.state.Alarm.currentCheckAlarmIdList;
        },
        dialogIndx () {
            const index = this.$store.state.Alarm.currentCheckAlarmIdList.findIndex(item => item === this.alarmItem.id);
            return index;
        },
        showDialog () {
            const id = this.$store.state.Alarm.currentCheckAlarmIdList.find(item => item === this.alarmItem.id);
            return !!id;
        }
    },
    watch: {
        dialogIndx () {
            const top = this.dialogIndx * 130;
            this.topCount = 72 + top + 'px';
        }
    },
    mounted () {
        const top = this.dialogIndx * 116;
        this.topCount = 72 + top + 'px';
    }
};
</script>

<style lang="scss">
.alarm-realtime{
    position: fixed;
    left: 11px;
    transition: top .5s;
    .flex{
        display: flex !important;
    }
    @mixin font($size, $color, $weight) {
        font-size:$size;
        font-family:SourceHanSansSC-Regular,SourceHanSansSC;
        font-weight:$weight;
        color:$color;
        text-shadow:0px 2px 2px rgba(12,59,84,0.5);
    }
    .alarmList{
        &-item{
            position: relative;
            cursor: pointer;
            width:328px;
            height:108px;
            background:linear-gradient(90deg,rgba(172,0,34,.6) 0%,rgba(142,0,30,.6) 43%,rgba(172,0,36,0) 100%);
            border-radius:4px;
            padding: 8px;
            margin-bottom: 8px;
            &:hover{
                background:linear-gradient(90deg,rgba(172,0,34,1) 0%,rgba(142,0,30,1) 43%,rgba(172,0,36,0) 100%);
                .info .type .checkBtn{
                    background:rgba(249,0,88,.8);
                    color: #FFF;
                }
            }
            .small{
                width:64px;
                height:92px;
                &:last-child{
                    margin-right: 2px;
                }
            }
            .normal{
                width:128px;
                height:92px;
            }
            .similarity{
                position: absolute;
                width:40px;
                height:22px;
                border-radius:12px;
                @include font(14px, #FFF, 400);
                text-align: center;
                line-height: 22px;
                bottom: 15px;
                left: 53px;
            }
            .similarityBest{
                background:rgba(249,0,88,1);
            }
            .similarityBetter{
                background:#FF9100;
            }
            .similarityGood{
                background:#00B57B;
            }
            .info{
                margin-left: 8px;
                width: 168px;
                .type{
                    justify-content: space-between;
                    .typeName{
                        @include font(14px,#FFF, bold);
                    }
                    .checkBtn{
                        width:48px;
                        height:22px;
                        background:rgba(249,0,88,.4);
                        border-radius:4px;
                        line-height: 22px;
                        text-align: center;
                        cursor: pointer;
                        @include font(14px, rgba(217,255,255,.85), 400);
                    }
                }
                &-item{
                    display: flex;
                    align-items: center;
                    @include font(14px, rgba(217,255,255,.85), 400);
                    height: 22px;
                    line-height: 22px;
                    margin-bottom: 2px;
                    img{
                        margin-right: 2px;
                        width: 18px;
                        height: 18px;
                    }
                }
            }
        }
    }
    .show{
        animation: show 0.5s linear;
    }
    .disappear{
        animation: disappear 0.5s linear;
    }
    @keyframes show {
        0% {
            transform: scale(0, 0);
        }
        100% {
            transform: scale(1, 1);
        }
    }
    @keyframes disappear {
        0% {
            transform: scale(1, 1);
        }
        100% {
            transform: scale(0, 0);
        }
    }
}
</style>
