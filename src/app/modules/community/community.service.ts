import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ICommunityFilterables, ICommunity } from './community.interface';
import { Community } from './community.model';
import { JwtPayload } from 'jsonwebtoken';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { communitySearchableFields } from './community.constants';
import { Types } from 'mongoose';
import { IUser } from '../user/user.interface';


const createCommunity = async (
  user: JwtPayload | undefined,
  payload: ICommunity
): Promise<ICommunity> => {
  try {

    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'User not authorized');
    }

    const communityData = {
      ...payload,
      userId: user?.authId,
    };

    const result = await Community.create(communityData);
    if (!result) {
      
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Failed to create Community, please try again with valid data.'
      );
    }

    return result;
  } catch (error: any) {
    
    if (error.code === 11000) {
      throw new ApiError(StatusCodes.CONFLICT, 'Duplicate entry found');
    }
    throw error;
  }
};

const getAllCommunitys = async (
  user: JwtPayload,
  filterables: ICommunityFilterables,
  pagination: IPaginationOptions
) => {
  const { searchTerm, ...filterData } = filterables;
  const { page, skip, limit, sortBy, sortOrder } = paginationHelper.calculatePagination(pagination);

  const andConditions = [];

  // Search functionality
  if (searchTerm) {
    andConditions.push({
      $or: communitySearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  // Filter functionality
  if (Object.keys(filterData).length) {
    andConditions.push({
      $and: Object.entries(filterData).map(([key, value]) => ({
        [key]: value,
      })),
    });
  }

  const whereConditions = andConditions.length ? { $and: andConditions } : {};

  const [result, total] = await Promise.all([
    Community
      .find(whereConditions)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder }).populate('userId', 'name email role'),
    Community.countDocuments(whereConditions),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: result,
  };
};

const getSingleCommunity = async (id: string): Promise<ICommunity> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Community ID');
  }

  const result = await Community.findById(id).populate('userId', 'name email role');
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested community not found, please try again with valid id'
    );
  }

  return result;
};

const updateCommunity = async (
  id: string,
  user: JwtPayload | undefined,
  payload: Partial<ICommunity>
): Promise<ICommunity | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Community ID');
  }

    if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'User not authorized');
  }

  const community = await Community.findOne({ _id: id, userId: user.authId });

  if (!community) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Community not found');
  }


  console.log({email : user.email, communityEmail: (community?.userId as IUser | undefined)?.email})
console.log("hitt")
  if (user.email !== (community?.userId as IUser | undefined)?.email) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You are not allowed to delete this community');
  }

  const result = await Community.findByIdAndUpdate(
    new Types.ObjectId(id),
    { $set: payload },
    {
      new: true,
      runValidators: true,
    }
  ).populate('userId');

  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested community not found, please try again with valid id'
    );
  }

  return result;
};

const deleteCommunity = async (id: string, user: JwtPayload | undefined): Promise<ICommunity> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Community ID');
  }

  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'User not authorized');
  }

  const community = await Community.findOne({ _id: id });

    if (!community) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Community not found');
  }

  if (user.email !== (community?.userId as IUser | undefined)?.email) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You are not allowed to delete this community');
  }

  const result = await Community.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Something went wrong while deleting community, please try again with valid id.'
    );
  }

  return result;
};

export const CommunityServices = {
  createCommunity,
  getAllCommunitys,
  getSingleCommunity,
  updateCommunity,
  deleteCommunity,
};