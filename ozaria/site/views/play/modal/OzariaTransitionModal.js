import ModalComponent from 'app/views/core/ModalComponent'
import ModalTransition from 'ozaria/site/components/common/ModalTransition'

class OzariaTransitionModal extends ModalComponent {
  // Runs before the constructor is called.
  initialize () {
    this.propsData = {
      campaignHandle: null,
      currentLevel: null,
      capstoneStage: null,
      courseId: null,
      courseInstanceId: null,
      goToNextDirectly: null,
      showShareModal: null
    }
  }

  constructor (options) {
    super(options)
    this.propsData.campaignHandle = options.level.get('campaign')
    this.propsData.currentLevel = options.level
    this.propsData.capstoneStage = options.capstoneStage
    this.propsData.courseId = options.courseID
    this.propsData.courseInstanceId = options.courseInstanceId
    this.propsData.goToNextDirectly = options.goToNextDirectly
    this.propsData.showShareModal = options.showShareModal
  }

  destroy () {
    if (this.onDestroy) {
      this.onDestroy()
    }
  }
}

OzariaTransitionModal.prototype.id = 'ozaria-transition-modal'
OzariaTransitionModal.prototype.template = require('ozaria/site/templates/core/modal-base-flat')
OzariaTransitionModal.prototype.VueComponent = ModalTransition
OzariaTransitionModal.prototype.propsData = null
OzariaTransitionModal.prototype.closesOnClickOutside = false
OzariaTransitionModal.prototype.closesOnEscape = false

export default OzariaTransitionModal
