import { Request, Response } from 'express';
import { OnboardingscreenServices } from './onboardingscreen.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import pick from '../../../shared/pick';
import { onboardingscreenFilterables } from './onboardingscreen.constants';
import { paginationFields } from '../../../interfaces/pagination';
import fs from 'fs/promises'
import path from 'path'

const createOnboardingscreen = catchAsync(async (req: Request, res: Response) => {

  // Only handle image uploads
  const images = req.body.images;

  // Convert image file paths to full URLs
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const staticRoute = '/uploads';

  function toUrl(filePath: string | undefined): string | undefined {
    if (!filePath) return undefined;
    return `${baseUrl}${staticRoute}${filePath}`;
  }

  function toUrlArray(filePaths: string[] | undefined): string[] | undefined {
    if (!filePaths) return undefined;
    return filePaths.map(fp => toUrl(fp) as string);
  }

  const imageURLs = Array.isArray(images)
    ? toUrlArray(images)
    : images ? [toUrl(images)] : undefined;

  // Merge image URLs into the payload
  const payload = {
    ...req.body,
    imageURL: imageURLs ? imageURLs[0] : undefined,
    imageURLs,
  };

  const result = await OnboardingscreenServices.createOnboardingscreen(
    req.user!,
    payload,
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Onboardingscreen created successfully',
    data: result,
  });
})

const updateOnboardingscreen = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const onboardingscreenData = req.body;

  const result = await OnboardingscreenServices.updateOnboardingscreen(id, onboardingscreenData);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Onboardingscreen updated successfully',
    data: result,
  });
});

const getSingleOnboardingscreen = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OnboardingscreenServices.getSingleOnboardingscreen(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Onboardingscreen retrieved successfully',
    data: result,
  });
});

const getAllOnboardingscreens = catchAsync(async (req: Request, res: Response) => {
  const filterables = pick(req.query, onboardingscreenFilterables);
  const pagination = pick(req.query, paginationFields);

  const result = await OnboardingscreenServices.getAllOnboardingscreens(
    req.user!,
    filterables,
    pagination
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Onboardingscreens retrieved successfully',
    data: result,
  });
});

const deleteOnboardingscreen = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OnboardingscreenServices.deleteOnboardingscreen(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Onboardingscreen deleted successfully',
    data: result,
  });
});

export const OnboardingscreenController = {
  createOnboardingscreen,
  updateOnboardingscreen,
  getSingleOnboardingscreen,
  getAllOnboardingscreens,
  deleteOnboardingscreen,
};