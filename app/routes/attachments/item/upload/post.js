export default (app) => {
  const controllers = app.get('controllers');

  /**
   * @api {post} /attachments/:uuid/upload
   * @apiName AttachmentItemUploadPost
   * @apiGroup Attachment
   *
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 401 Unprocessable Entity
   *    {
   *      "errors": [{
   *        "detail": "Unauthorized",
   *      }],
   *    }
   */
  return async(req, res, next) => {
    try {
      await controllers.AttachmentCtrl.uploadAttachment({
        attachmentUuid: req.params.uuid,
        auditApiCallUuid: req.auditApiCallUuid,
        fileBody: req.file.buffer,
        fileName: req.file.originalname,
      });

      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  };
};
