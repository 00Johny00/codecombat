<script>
import { coursesWithProjects, isOzaria, isCodeCombat } from 'core/utils'
import PrimaryButton from '../common/buttons/PrimaryButton'
import ButtonCurriculumGuide from '../common/ButtonCurriculumGuide'
import LicensesComponent from '../common/LicensesComponent'
import NavSelectUnit from '../common/NavSelectUnit'
import ClassInfoRow from './ClassInfoRow'
import moment from 'moment'
import zendeskResourceMixin from 'ozaria/site/components/teacher-dashboard/BaseResourceHub/index.vue'

import { mapActions, mapGetters } from 'vuex'

const Classroom = require('models/Classroom')

const resourceHubSections = [
  { sectionName: 'gettingStarted', slug: 'getting-started', i18nKey: 'teacher.getting_started' },
  { sectionName: 'educatorResources', slug: 'educator-resources', i18nKey: 'new_home.educator_resources' },
  { sectionName: 'lessonSlides', slug: 'lesson-slides', i18nKey: 'teacher.curriculum' },
  { sectionName: 'studentResources', slug: 'student-resources', i18nKey: 'teacher.student_resources' },
  { sectionName: 'faq', slug: 'faq', i18nKey: 'nav.faq' }
]

export default {
  components: {
    'primary-button': PrimaryButton,
    'button-curriculum-guide': ButtonCurriculumGuide,
    'licenses-component': LicensesComponent,
    'nav-select-unit': NavSelectUnit,
    'class-info-row': ClassInfoRow,
  },

  mixins: [
    zendeskResourceMixin
  ],

  props: {
    title: {
      type: String,
      required: true
    },
    showClassInfo: {
      type: Boolean,
      default: false
    },
    showPreviewMode: {
      type: Boolean,
      default: false
    },
    classroom: {
      type: Object,
      default: () => {}
    },
    selectedCourseId: {
      type: String,
      default: ''
    },
    courses: {
      type: Array,
      default: () => []
    },
    allClassesPage: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      resourceHubResources: {}
    }
  },

  computed: {
    ...mapGetters({
      activeClassrooms: 'teacherDashboard/getActiveClassrooms'
    }),

    editClassImgSrc () {
      return '/images/ozaria/teachers/dashboard/svg_icons/iconPencil.svg'
    },

    isCodeCombat () {
      return isCodeCombat
    },

    resourceHubSections () {
      return resourceHubSections
    },

    resourceHubLinks () {
      return this.resourceHubLinksHelper(this.resourceHubResources)
    },

    teacherToolkitView () {
      return this.$route.path.startsWith('/teachers/resources')
    },

    filteredCourses () {
      if (isOzaria) {
        return this.courses
      }
      if (this.$route.path.startsWith('/teachers/assessments')) {
        const classroom = new Classroom(this.classroom)
        return this.courses.filter(course => classroom.hasAssessments({ courseId: course._id }))
      } else if (this.$route.path.startsWith('/teachers/projects')) {
        return this.courses.filter(course => (coursesWithProjects || []).includes(course._id))
      } else {
        return this.courses
      }
    },

    classroomCreationDate () {
      if ((this.classroom || {})._id) {
        return moment(parseInt(this.classroom._id.substring(0, 8), 16) * 1000).format('ll')
      } else {
        return ''
      }
    },
    classroomStartDate () {
      if (!this.classroom.classDateStart) { return '' }
      return moment(this.classroom.classDateStart).format('ll')
    },
    classroomEndDate () {
      if (!this.classroom.classDateEnd) { return '' }
      return moment(this.classroom.classDateEnd).format('ll')
    },
    classroomLanguage () {
      return (this.classroom.aceConfig || {}).language
    },
    classroomStudentsLength () {
      return (this.classroom.members || []).length
    },
    sharePermission () {
      return this.allClassesPage ? null : (this.classroom.permissions || []).find(p => p.target === me.get('_id'))?.access
    },
    sharedClassroomId () {
      return this.sharePermission ? this.classroom._id : undefined
    },
    showOutcomesReportButton () {
      if (!this.allClassesPage) {
        // If classroom has students
        return (this.classroom.members || []).length > 0
      }
      // If we have any active classrooms
      return (this.activeClassrooms || []).length > 0
    },
    outcomesReportLink () {
      const kind = this.allClassesPage ? 'teacher' : 'classroom'
      const org = this.allClassesPage ? me.get('_id') : this.classroom._id
      return `/outcomes-report/${kind}/${org}`
    },
    showLicenses () {
      return !me.isCodeNinja()
    }
  },

  methods: {
    ...mapActions({
      toggleCurriculumGuide: 'baseCurriculumGuide/toggleCurriculumGuide',
      setCurriculumAccessViaSharedClass: 'baseCurriculumGuide/setAccessViaSharedClass'
    }),

    clickOutcomesReport () {
      window.tracker?.trackEvent('Outcomes Report Clicked', { category: 'Teachers', label: this.$route.path })
      this.$emit('outcomesReport')
    },

    clickEditClass () {
      this.$emit('editClass', this.classroom)
    },

    clickNewClass () {
      window.tracker?.trackEvent('Add New Class Clicked', { category: 'Teachers', label: this.$route.path })
      this.$emit('newClass')
    },

    clickCurriculumGuide () {
      let hasAccess = false
      if (this.sharePermission) {
        hasAccess = true
      }
      this.setCurriculumAccessViaSharedClass(hasAccess)
      window.tracker?.trackEvent('Curriculum Guide Clicked', { category: 'Teachers', label: this.$route.path })
      this.toggleCurriculumGuide()
    }
  }
}
</script>

<template>
  <div class="teacher-title-bar">
    <div class="sub-nav">
      <h1 :class="showClassInfo ? 'short' : 'long'">
        {{ title }}
      </h1>
      <div
        v-if="teacherToolkitView"
        class="resource-hub-container"
      >
        <div
          v-for="(resourceHubSection, index) in resourceHubSections"
          :key="resourceHubSection.slug"
        >
          <div
            v-if="resourceHubLinks(resourceHubSection.sectionName).length"
            class="resource-hub-section"
          >
            <a
              :href="'#' + resourceHubSection.slug"
            >{{ $t(resourceHubSection.i18nKey) }}</a>
            <span v-if="index < resourceHubSections.length - 1">|</span>
          </div>
        </div>
      </div>
      <div
        v-if="showClassInfo"
        class="edit-class"
      >
        <a @click="clickEditClass()">
          <img
            class="pencil-svg"
            :src="editClassImgSrc"
          >
        </a>
      </div>
      <class-info-row
        v-if="showClassInfo"
        class="class-info-row"
        :language="classroomLanguage"
        :num-students="classroomStudentsLength"
        :date-created="classroomCreationDate"
        :date-start="classroomStartDate"
        :date-end="classroomEndDate"
        :share-permission="sharePermission"
      />
    </div>
    <div
      v-if="!showPreviewMode && !teacherToolkitView"
      class="sub-nav"
    >
      <div
        v-if="sharePermission"
        class="small-text"
      >
        {{ $t('teacher_dashboard.class_owner') }}:
      </div>
      <!--  we want to use classroom ownerID always even when class is not owned by teacher in case of shared classes since license is cut from owner -->
      <licenses-component
        v-if="showLicenses"
        class="btn-margins-height"
        :selected-teacher-id="allClassesPage ? null : classroom.ownerID"
        :shared-classroom-id="sharedClassroomId"
      />
      <nav-select-unit
        v-if="showClassInfo"
        class="btn-margins-height"
        :courses="filteredCourses"
        :selected-course-id="selectedCourseId"
        @change-course=" (courseId) => $emit('change-course', courseId)"
      />

      <div class="main-buttons-container">
        <a :href="outcomesReportLink">
          <primary-button
            v-if="showOutcomesReportButton"
            id="outcomes-report-btn"
            class="btn-title-padding btn-margins-height"
            @click="clickOutcomesReport"
          >
            {{ $t('outcomes.outcomes_report') }}
          </primary-button>
        </a>

        <primary-button
          v-if="!showClassInfo"
          id="new-class-btn-shepherd"
          class="btn-title-padding btn-margins-height"
          @click="clickNewClass"
        >
          {{ $t('teacher_dashboard.add_class') }}
        </primary-button>

        <button-curriculum-guide
          id="curriculum-guide-btn-shepherd"
          class="btn-margins-height"
          @click="clickCurriculumGuide"
        />
        <div
          v-if="showClassInfo"
          class="add-students"
        >
          <button
            class="dusk-btn"
            @click="$emit('addStudentsClicked')"
          >
            <span> {{ $t('courses.add_students') }} </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "app/styles/bootstrap/variables";
@import "ozaria/site/styles/common/variables.scss";
@import "app/styles/ozaria/_ozaria-style-params.scss";
@import "dusk-button";

.btn-title-padding {
  padding: 8px 22px;
}

.btn-margins-height {
  margin: 0 12.5px;
  white-space: nowrap;
}

.resource-hub-container {
  display: flex;
  gap: 0px;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  a {
    text-decoration: underline;
  }
}

.resource-hub-section {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.resource-hub-section * {
  margin-left: 5px;
  margin-right: 5px;
  color: $blue;
}

.main-buttons-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  .btn-margins-height {
    margin: 0;
  }
  .btn-title-padding {
    padding: 8px 12px;
  }
}

.sub-nav {
  display: flex;
  flex-direction: row;
  align-items: center;

  &:last-child {
    margin-right: -12.5px;
  }

  &>h1:first-child {
    margin-right: 10px;
  }

  @media (max-width: 1280px) {
    .class-info-row {
      display: none;
    }

    h1 {
      max-width: 600px;

      &.short {
        max-width: calc(100vw - 832px);
      }
    }
  }
}

.teacher-title-bar {
  height: 60px;
  background-color: #f2f2f2;
  border: 1px solid #d8d8d8;
  border-left: unset;
  border-right: unset;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  padding-left: 30px;
  padding-right: 30px;

  position: relative;
  z-index: 11;

  /* Drop shadow bottom ref: https://css-tricks.com/snippets/css/css-box-shadow/ */
  -webkit-box-shadow: 0 8px 6px -6px #D2D2D2;
    -moz-box-shadow: 0 8px 6px -6px #D2D2D2;
        box-shadow: 0 8px 6px -6px #D2D2D2;
}

h1 {
  @include font-h-2-subtitle-black;
  max-width: calc(100vw - 650px);
  overflow-y: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  &.short {
    max-width: calc(100vw - 1000px);
  }
}

.small-text {
  font-size: small;
}

.add-students {
  display: inline-block;

  &__icon {
    margin-right: 5px;
  }
}

  .pencil-svg {
    width: 20px;
    margin-right: 10px;
  }
</style>
