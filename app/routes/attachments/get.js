const { GetObjectCommand } = require('@aws-sdk/client-s3');
const nconf = require('nconf');
const { AttachmentError, ExpenseError } = require('../../middleware/error-handler');

module.exports = (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {get} /attachments
   * @apiName AttachmentGet
   * @apiGroup Attachment
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object[]} data.attachments
   * @apiSuccess (200) {object} data.attachments[].attributes
   * @apiSuccess (200) {string} data.attachments[].attributes[created-at]
   * @apiSuccess (200) {string} data.attachments[].attributes[download-url]
   * @apiSuccess (200) {string} data.attachments[].attributes.name
   * @apiSuccess (200) {string} data.attachments[].id
   * @apiSuccess (200) {string} data.attachments[].type
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
      // Query params
      let limit = 25;
      if (req.query && req.query.limit) {
        limit = parseInt(req.query.limit, 10);
      }
      let offset = 0;
      if (req.query && req.query.page) {
        offset = limit * (parseInt(req.query.page, 10) - 1);
      }

      const user = await models.User.findOne({
        attributes: ['household_uuid', 'uuid'],
        where: {
          uuid: req.userUuid,
        },
      });

      const attachmentWhere = {};
      if (req.query.expense_id) {
        const expense = await models.Expense.findOne({
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
          where: {
            uuid: req.query.expense_id,
          },
        });
        if (!expense) {
          throw new ExpenseError('Not found');
        }
        attachmentWhere.entity_type = 'expense';
        attachmentWhere.entity_uuid = expense.get('uuid');
      } else {
        throw new AttachmentError('No open queries');
      }

      let attachmentOrder = [['name', 'ASC']];
      let sortField = [];
      if (req.query.sort && req.query.sort === 'name') {
        sortField = ['name'];
      }
      if (sortField.length) {
        attachmentOrder = [];
        if (req.query.sortDirection && req.query.sortDirection === 'desc') {
          attachmentOrder.push([...sortField, 'DESC']);
        } else {
          attachmentOrder.push([...sortField, 'ASC']);
        }
      }

      const attachments = await models.Attachment.findAndCountAll({
        attributes: [
          'aws_key',
          'created_at',
          'name',
          'uuid',
        ],
        limit,
        offset,
        order: attachmentOrder,
        where: attachmentWhere,
      });

      return res.status(200).json({
        'data': await Promise.all(attachments.rows.map(async(attachment) => {
          const presignedUrl = await controllers.AttachmentCtrl.s3GetSignedUrl(
            controllers.AttachmentCtrl.s3Client,
            new GetObjectCommand({
              Bucket: nconf.get('AWS_STORAGE_BUCKET'),
              Key: attachment.get('aws_key'),
            }),
            { expiresIn: 3600 },
          );
          return {
            'attributes': {
              'created-at': attachment.get('created_at'),
              'download-url': presignedUrl,
              'name': attachment.get('name'),
            },
            'id': attachment.get('uuid'),
            'type': 'attachments',
          };
        })),
        'meta': {
          'pages': Math.ceil(attachments.count / limit),
          'total': attachments.count,
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
