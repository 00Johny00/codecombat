
<script>
export default Vue.extend({
  props: {
    inactive: {
      type: Boolean,
      default: false
    },
    inProgress: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      required: true,
      default: 'Link Google Classroom'
    }
  },
  methods: {
    onClick () {
      if (!this.inactive) {
        this.$emit('click')
      }
    }
  }
})
</script>

<template>
  <div class="google-classroom-button">
    <div
      v-tooltip.bottom="{
        content: inactive ? $t('teachers.google_classroom_disabled_text') : null
      }"
      class="link-google-classroom"
      :class="{ disabled: inactive || inProgress }"
      @click="onClick"
    >
      <img
        v-if="inactive"
        src="/images/ozaria/teachers/dashboard/svg_icons/IconGoogleClassroom_inactive.svg"
      >
      <img
        v-else
        src="/images/ozaria/teachers/dashboard/svg_icons/IconGoogleClassroom.svg"
      >
      <span class="google-classroom-text"> {{ text }} </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "app/styles/ozaria/_ozaria-style-params.scss";
.google-classroom-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.link-google-classroom {
  cursor: pointer;
  background: #FFFFFF;
  box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.11), 2px 4px 5px rgba(0, 0, 0, 0.11);
  display: inline-block;
  padding: 10px;

  &.disabled {
    background: #D8D8D8;
    border: 0.584447px solid #DADADA;
    cursor: default;
    box-shadow: none;
    color: #757575;
    padding: 5px;
    .google-classroom-text {
      font-size: 14px;
      line-height: 16px;
    }
  }
}
.google-classroom-text {
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;
  margin-left: 10px;
}
</style>
