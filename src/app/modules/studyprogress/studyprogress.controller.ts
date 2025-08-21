import { Request, Response } from 'express';
import { StudyprogressServices } from './studyprogress.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import pick from '../../../shared/pick';
import { studyprogressFilterables } from './studyprogress.constants';
import { paginationFields } from '../../../interfaces/pagination';

const createStudyprogress = catchAsync(async (req: Request, res: Response) => {
  const studyprogressData = req.body;

  const result = await StudyprogressServices.createStudyprogress(
    req.user!,
    studyprogressData
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Studyprogress created successfully',
    data: result,
  });
});

const updateStudyprogress = catchAsync(async (req: Request, res: Response) => {
  const studyprogressData = req.body;
  const user = req.user

  const result = await StudyprogressServices.updateStudyprogress(user, studyprogressData);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Studyprogress updated successfully',
    data: result,
  });
});

const getSingleStudyprogress = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await StudyprogressServices.getSingleStudyprogress(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Studyprogress retrieved successfully',
    data: result,
  });
});

const getAllStudyprogresss = catchAsync(async (req: Request, res: Response) => {
  const filterables = pick(req.query, studyprogressFilterables);
  const pagination = pick(req.query, paginationFields);

  const result = await StudyprogressServices.getAllStudyprogresss(
    req.user!,
    filterables,
    pagination
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Studyprogresss retrieved successfully',
    data: result,
  });
});

const deleteStudyprogress = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await StudyprogressServices.deleteStudyprogress(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Studyprogress deleted successfully',
    data: result,
  });
});

export const StudyprogressController = {
  createStudyprogress,
  updateStudyprogress,
  getSingleStudyprogress,
  getAllStudyprogresss,
  deleteStudyprogress,
};
