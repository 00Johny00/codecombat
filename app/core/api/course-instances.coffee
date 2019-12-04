fetchJson = require './fetch-json'

module.exports = {
  get: ({ courseInstanceID }, options={}) ->
    fetchJson("/db/course_instance/#{courseInstanceID}", options)

  getProjectGallery: ({ courseInstanceID }, options={}) ->
    fetchJson("/db/course_instance/#{courseInstanceID}/peer-projects", options)

  getSessions: ({ courseInstanceID }, options={}) ->
    userID = options?.userID or me.id
    fetchJson("/db/course_instance/#{courseInstanceID}/course-level-sessions/#{userID}", options)

  fetchByOwner: (ownerID) ->
    fetchJson("/db/course_instance", {
      data: { ownerID: ownerID }
    })

  # courseInstanceDetails = {classroomID: '', courseID: ''}
  post: (courseInstanceDetails, options={}) ->
    fetchJson("/db/course_instance", _.assign({}, options, {
      method: 'POST'
      json: courseInstanceDetails
    }))
}
