import { GetObjectCommand } from '@aws-sdk/client-s3';
import nconf from 'nconf';
import { AttachmentError } from '../../../middleware/error-handler/index.js';

export default (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {get} /attachments/:uuid
   * @apiName AttachmentItemGet
   * @apiGroup Attachment
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object} data.attributes
   * @apiSuccess (200) {string} data.attributes[created-at]
   * @apiSuccess (200) {string} data.attributes[download-url]
   * @apiSuccess (200) {string} data.attributes.name
   * @apiSuccess (200) {string} data.id
   * @apiSuccess (200) {string} data.type
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
      const user = await models.User.findOne({
        attributes: ['household_uuid', 'uuid'],
        where: {
          uuid: req.userUuid,
        },
      });
      if (!user) {
        throw new Error('Unauthorized');
      }

      const attachment = await models.Attachment.findOne({
        attributes: [
          'aws_key',
          'created_at',
          'name',
          'uuid',
        ],
        include: [{
          as: 'Expense',
          attributes: ['uuid'],
          include: [{
            attributes: ['uuid'],
            include: [{
              attributes: ['uuid'],
              model: models.Category,
              required: true,
              where: {
                household_uuid: user.get('household_uuid'),
              },
            }],
            model: models.Subcategory,
            required: true,
          }],
          model: models.Expense,
          required: true,
        }],
        where: {
          uuid: req.params.uuid,
        },
      });
      if (!attachment) {
        throw new AttachmentError('Not found');
      }

      const presignedUrl = await controllers.AttachmentCtrl.s3GetSignedUrl(
        controllers.AttachmentCtrl.s3Client,
        new GetObjectCommand({
          Bucket: nconf.get('AWS_STORAGE_BUCKET'),
          Key: attachment.get('aws_key'),
        }),
        { expiresIn: 3600 },
      );

      return res.status(200).json({
        'data': {
          'attributes': {
            'created-at': attachment.get('created_at'),
            'download-url': presignedUrl,
            'name': attachment.get('name'),
          },
          'id': attachment.get('uuid'),
          'type': 'attachments',
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
